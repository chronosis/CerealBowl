// lib/objects/index.js

const
  _                 = require('lodash')
  , fs              = require('fs')
  , path            = require('path')
;

class PreLoadedObjectFactory {
  constructor(jObjectStrem) {
    this.objStream = jObjectStrem;
  }

  /*
   * This iterates through all .js files in the routes folder and loads them in
   * to the `controllers`` object. The purpose of this is to separate each of
   * the controller logics into its own file class for easie maintainability of the code.
   *
   * The `controller` object is returned to the paired `require('thisLib')` statement
   * inside the host code.
   */
  load() {
    console.log(' - Loading objects - ');
    let objects = {};
    fs.readdirSync(__dirname)
      .filter((file) => {
        return (file.substr(-3) === '.js') && (file.indexOf('.') !== 0) && (file !== 'index.js');
      })
      .forEach((file) => {
        let name = file.substring(0,file.length - 3);
        let ProxyClass = require(path.join(__dirname, file));
        console.log(`Loading object classes: '${name}'`);
        objects[name] = new ProxyClass(this.objStream);
      });
    return objects;
  }
}

module.exports = PreLoadedObjectFactory;
