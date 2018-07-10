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
//     while(fifo.length > 0){
//         var dependencies =  await getFromURL();
//         for(let entry in dependencies.dep){
//         	packageNameValue =combinePackageNameVersion(entry , dependencies.dep[entry] );
//             if(!dependencyMap.has(packageNameValue)){
//                 dependencyMap.set(packageNameValue, {id:uiqueIndex,parentid:dependencies.parentId ,package:packageNameValue});
//                 fifo.push(buildNodeObj(packageNameValue,entry,dependencies.dep[entry],uiqueIndex,dependencies.parentId));
//                 uiqueIndex++;
//             }else{
//             	// add existing dependencyMap but with diff parentid?
//             }
//         }
//     }
// }

// async function asyncCall (packName, packVer){
// 	let packageNameValue=combinePackageNameVersion(packName,packVer);
//     fifo.push(buildNodeObj(packageNameValue , packName ,packVer , uiqueIndex ,0));
//     dependencyMap.set(packageNameValue, {id:uiqueIndex,parentid:0,package:packageNameValue});
//     uiqueIndex++;
//     await getPackageDependencies();
//     console.log(Array.from(dependencyMap.values()));
//     tree = unflatten( Array.from(dependencyMap.values()));
// 	//console.log(JSON.stringify(tree, replacer," ")); 
		
// 	console.log(treeify.asTree(JSON.parse(JSON.stringify(tree, replacer," ")), true));
// 	// console.log(treeify.asTree(tree,true));

// 	console.log('DOOOOOOOOOOOOOOOOOOOOOOOOOOONE');
// }

// var unflatten = function( array, parent, tree ){

//     tree = typeof tree !== 'undefined' ? tree : [];
//     parent = typeof parent !== 'undefined' ? parent : { id: 0 };

//     var children = array.filter(function(child){ return child.parentid == parent.id; });

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


// asyncCall('express','latest');

// // asyncCall('async','2.0.1');

// // console.log(semver.clean('>= 1.3.1 < 2'));
// // console.log(semver.coerce('~1.3.1'));
// // console.log(semver.coerce('~1.3.1').raw);
// // console.log(semver.coerce('^1.3.1'));
// // console.log(semver.coerce('>= 1.3.1 < 2').raw);
// // adding depth var as parent id