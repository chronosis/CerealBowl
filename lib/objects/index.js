// lib/objects/index.js

const fs = require('fs');
const path = require('path');

class PreLoadedObjectFactory {
  constructor(jObjectStrem, log) {
    this.objStream = jObjectStrem;
    this.log = log;
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
    this.log.debug(' - Loading objects - ');
    const objects = {};
    fs.readdirSync(__dirname)
      .filter((file) => {
        return file.substr(-3) === '.js' && file.indexOf('.') !== 0 && file !== 'index.js';
      })
      .forEach((file) => {
        const name = file.substring(0, file.length - 3);
        const ProxyClass = require(path.join(__dirname, file));
        this.log.debug(`Loading object classes: '${name}'`);
        objects[name] = new ProxyClass(this.objStream);
      });
    return objects;
  }
}

module.exports = PreLoadedObjectFactory;
