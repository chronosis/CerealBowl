// lib/objects/index.js

const
  _                 = require('lodash')
  , fs              = require('fs')
  , path            = require('path')
;

let objects = {};

/*
 * This iterates through all .js files in the routes folder and loads them in
 * to the `controllers`` object. The purpose of this is to separate each of
 * the controller logics into its own file class for easie maintainability of the code.
 *
 * The `controller` object is returned to the paired `require('thisLib')` statement
 * inside the host code.
 */

module.exports = (jObjStream) => {
   console.log(' - Loading objects - ');
   fs.readdirSync(__dirname)
     .filter(function(file) {
       return (file.substr(-3) === '.js') && (file.indexOf('.') !== 0) && (file !== 'index.js');
     })
     .forEach(function(file) {
       let name = file.substring(0,file.length - 3);
       let ProxyClass = require(path.join(__dirname, file));
       console.log(`Loading object classes: '${name}'`);
       objects[name] = new ProxyClass(jObjStream);
     });
   return objects;
 };
