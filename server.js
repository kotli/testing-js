var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;

app.listen(port);

const semver = require('semver');
var fifo = require('fifo')();
var treeify = require('treeify');
var axios=require('axios');

var promises = [];
var uiqueIndex=1;
var dependencyMap = new Map();

console.log('todo list RESTful API server started on: ' + port);

function MapValue(id, parentid, package, version) {
	this.id = id;
    this.parentid = parentid;
    this.package = package;
    this.version = version;
}

function NodeObj(key, name,version,id,parentid){
	this.key=key;
	this.name=name;
	this.version=version;
	this.id=id;
	this.parentid=parentid;
}

function DependenciesObj(dep, parentId){
	this.dep=dep;
	this.parentId=parentId;
}

function combinePackageNameVersion(fPackName , fPackvalue) {
	return fPackName + ' ' + resolveVersion(fPackvalue);
} 

function checkVersionOverlap(ver1, ver2){
	let verCom = semver.toComparators(ver2)[0].join('||');
	ver1.forEach(function(element) {
  		if(([element.version]).some(function(x) { return semver.intersects(semver.toComparators(x)[0].join('||') , verCom); }))
  		return true;
	});
	return false;
}

function resolveVersion(fPackvalue){
	let newStr=fPackvalue;
	if(!semver.valid(fPackvalue) && fPackvalue != 'latest'){
		newStr=semver.coerce(fPackvalue).raw;
	}
	return newStr;
}

async function getFromURL(){
    let queue = fifo.pop();

    let url = 'https://registry.npmjs.org/' + queue.name + '/'+ queue.version;
    var ans;
    await axios.get(url).then((response)=>{
        ans = response.data.dependencies;
    })
    return new DependenciesObj(ans,queue.id);
}

async function getPackageDependencies(){
	let packageNameValue;
	let mapVal;
	let isOverlapedVersions;
	let resolvedVersion;
    while(fifo.length > 0){
        var dependencies =  await getFromURL();
        for(let entry in dependencies.dep){
        	packageNameValue= combinePackageNameVersion(entry , dependencies.dep[entry] );
           	resolvedVersion= resolveVersion(dependencies.dep[entry]);
            if(!dependencyMap.has(entry) ){
                dependencyMap.set(entry, [new MapValue(uiqueIndex,dependencies.parentId ,entry,dependencies.dep[entry])]) ;
                fifo.push(new NodeObj(packageNameValue,entry,resolvedVersion,uiqueIndex,dependencies.parentId));
                uiqueIndex++;
            }else if (dependencyMap.has(entry) && !checkVersionOverlap(dependencyMap.get(entry),dependencies.dep[entry])){
            	mapVal= dependencyMap.get(entry);
            	dependencyMap.set(entry, mapVal.concat([new MapValue(uiqueIndex,dependencies.parentId ,entry, dependencies.dep[entry])]));
                fifo.push(new NodeObj(packageNameValue,entry,resolvedVersion,uiqueIndex,dependencies.parentId));
                uiqueIndex++;
            }else if(dependencyMap.has(entry) && checkVersionOverlap(dependencyMap.get(entry),dependencies.dep[entry])){
            	mapVal= dependencyMap.get(entry);
            	dependencyMap.set(entry, mapVal.concat([new MapValue(uiqueIndex,dependencies.parentId ,entry, dependencies.dep[entry])]));
            }
        }
    }
}

async function npmRegistry (packName, packVer){
	let packageNameValue=combinePackageNameVersion(packName,packVer);
	let resolvedVersion =resolveVersion(packVer);
    fifo.push(new NodeObj(packageNameValue , packName ,resolvedVersion , uiqueIndex ,0));
    dependencyMap.set(packName, [new MapValue(uiqueIndex,0,packName,packVer)]);
    uiqueIndex++;
    await getPackageDependencies();
    var printMap = [].concat(...Array.from(dependencyMap.values()));
    console.log(printMap);
    tree = unflatten( printMap);
	// console.log(JSON.stringify(tree, replacer," ")); 
		
	console.log(treeify.asTree(JSON.parse(JSON.stringify(tree, replacer," ")), true));
	// console.log(treeify.asTree(tree,true));

	console.log('DONE');
}

function unflatten(array, parent, tree ){
    tree = typeof tree !== 'undefined' ? tree : [];
    parent = typeof parent !== 'undefined' ? parent : { id: 0 };
	
	var children = array.filter(function(child){ return child.parentid == parent.id; });
	
    if( children.length ){
        if( parent.id == 0 ){
           tree = children;   
        }else{
           parent['dependencies'] = children;
        }
        children.forEach(function( child ){ unflatten( array, child ) } );                    
    }
    return tree;
}


function replacer(key, value) {
  if (key === 'parentid' || key === 'id') {
    return undefined;
  }
  return value;
}


npmRegistry('express','latest');

// npmRegistry('async','2.0.1');