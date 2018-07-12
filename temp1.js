// var express = require('express'),
//   app = express(),
//   port = process.env.PORT || 3000;

// app.listen(port);
// const semver = require('semver');
// var fifo = require('fifo')();
// var treeify = require('treeify');

// var promises = [];
// var uiqueIndex=1;
// // var fifo = [];

// console.log('todo list RESTful API server started on: ' + port);

// var dependencyMap = new Map();

// var axios=require('axios');

// function combinePackageNameVersion(fPackName , fPackvalue) {
// 	return fPackName + ' ' + stripVersionPrefix(fPackvalue);
// } 

// function checkVersionOverlap(ver1, ver2){
// 	// console.log('ver1: ' + ver1 + ' ver2 '+ ver2);
// 	// console.log(semver.intersects(semver.toComparators(ver1)[0].join('||') , semver.toComparators(ver2)[0].join('||')));
	
// 	return ver1.some(function(x) { return semver.intersects(semver.toComparators(x)[0].join('||') , semver.toComparators(ver2)[0].join('||')); });
// }


// function stripVersionPrefix(fPackvalue){
// 	let newStr=fPackvalue;
// 	// console.log('inside stripVersionPrefix fPackName:' + fPackName + ' fPackvalue: ' + fPackvalue);
// 	// console.log(fPackvalue);
// 	if(!semver.valid(fPackvalue) && fPackvalue != 'latest'){
// 		newStr=semver.coerce(fPackvalue).raw;
// 	}
// 	return newStr;
// }

// function buildNodeObj(nameVer, packName,packVer,idx,pId){
// 	console.log('{key:'+nameVer+' , name:'+packName+' , version:'+packVer+' , id:'+idx+' , parentid:'+pId+'}');
// 	return {key:nameVer , name:packName , version:stripVersionPrefix(packVer) , id:idx , parentid:pId};
// }

// var getFromURL = async ()=>{
//     // packageName = 'async';
//     let queue = fifo.pop();


//     let url = 'https://registry.npmjs.org/' + queue.name + '/'+ queue.version;
//     var ans;
//     // console.log('url : ' + url);
//     await axios.get(url).then((response)=>{
//         ans = response.data.dependencies;
//     })
//     return {dep:ans,parentId:queue.id};
// }



// var getPackageDependencies = async ()=>{
// 	let packageNameValue;
// 	let mapVal;
// 	let isOverlapedVersions;
//     while(fifo.length > 0){
//         var dependencies =  await getFromURL();
//         for(let entry in dependencies.dep){
//         	packageNameValue =combinePackageNameVersion(entry , dependencies.dep[entry] );
//             if(!dependencyMap.has(entry) ||
//             	(dependencyMap.has(entry) && !checkVersionOverlap(dependencyMap.get(entry).versions,dependencies.dep[entry]))){
//             	// console.log('if uiqueIndex: ' + uiqueIndex);
//                 dependencyMap.set(entry, {id:uiqueIndex,parentid:dependencies.parentId ,package:entry, versions:[dependencies.dep[entry]]});
//                 fifo.push(buildNodeObj(packageNameValue,entry,dependencies.dep[entry],uiqueIndex,dependencies.parentId));
//                 uiqueIndex++;
//             }
//              else if(dependencyMap.has(entry) && checkVersionOverlap(dependencyMap.get(entry).versions,dependencies.dep[entry])){

//             	// add existing dependencyMap but with diff parentid?
//             	// console.log('if else: ' + uiqueIndex);
//             	mapVal =dependencyMap.get(entry);
//             	console.log('id: ' +mapVal.id + ' parentId: ' + dependencies.parentId);
//             	dependencyMap.set(entry, {id:mapVal.id,parentid:dependencies.parentId ,package:mapVal.package, versions:mapVal.versions});
//             }
//             else{
//             	console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
//             }
//         }
//     }
// }

// async function asyncCall (packName, packVer){
// 	let packageNameValue=combinePackageNameVersion(packName,packVer);
//     fifo.push(buildNodeObj(packageNameValue , packName ,packVer , uiqueIndex ,0));
//     dependencyMap.set(packName, {id:uiqueIndex,parentid:0,package:packName,versions:[packVer]});
//     uiqueIndex++;
//     await getPackageDependencies();
//     console.log(Array.from(dependencyMap.values()));
//     tree = unflatten( Array.from(dependencyMap.values()));
// 	// console.log(JSON.stringify(tree, replacer," ")); 
		
// 	// console.log(treeify.asTree(JSON.parse(JSON.stringify(tree, replacer," ")), true));
// 	// console.log(treeify.asTree(tree,true));

// 	console.log('DOOOOOOOOOOOOOOOOOOOOOOOOOOONE');
// }

// var unflatten = function( array, parent, tree ){

//     tree = typeof tree !== 'undefined' ? tree : [];
//     parent = typeof parent !== 'undefined' ? parent : { id: 0 };
	
// 	var children = array.filter(function(child){ return child.parentid == parent.id; });
	
//     if( children.length ){
//         if( parent.id == 0 ){
//            tree = children;   
//         }else{
//            parent['dependencies'] = children;
//         }
//         children.forEach(function( child ){ unflatten( array, child ) } );                    
//     }

//     return tree;
// }


// function replacer(key, value) {
//   if (key === 'parentid' || key === 'id') {
//     return undefined;
//   }
//   return value;
// }


// // asyncCall('express','latest');

// dependencyMap.set('shalom', 1);
// dependencyMap.set('shalom', 2);
// console.log(dependencyMap);


// // asyncCall('async','2.0.1');

// // console.log(semver.clean('>= 1.3.1 < 2'));
// // console.log(semver.coerce('~1.3.1'));
// // if(!semver.valid('~1.3.1')){
// // 	console.log('wwwwwwwwwwww');
// // }
// // console.log(semver.toComparators('~1.3.1')[0].join('||'));
// // console.log(semver.toComparators('1.3.1')[0].join('||'));
// // console.log(semver.toComparators('~1.3.1')[0].join('||') + '||' + semver.toComparators('1.3.1')[0].join('||'));
// // console.log(semver.intersects(semver.toComparators('~1.3.1')[0].join('||') , semver.toComparators('1.3.1')[0].join('||')));
// // console.log(semver.intersects());
// // console.log(semver.valid('~1.3.1'));
// // console.log(semver.toComparators('1.3.1'));
// // console.log(semver.toComparators('~1.3.1')[0].concat(semver.toComparators('1.3.1')[0]));
// // console.log(semver.coerce('1.3.1'));
// // console.log(semver.toComparators('~1.3.1')[0]);
// // console.log(semver.satisfies('1.3.1',semver.toComparators('~1.3.1')));

// // console.log(semver.satisfies('1.3.1',semver.toComparators('~1.3.1')[0].join('||')));

// // console.log(semver.valid('~1.3.1'));
// // console.log(semver.coerce('~1.3.1').raw);
// // console.log(semver.coerce('^1.3.1'));
// // console.log(semver.coerce('>= 1.3.1 < 2').raw);
// // adding depth var as parent id