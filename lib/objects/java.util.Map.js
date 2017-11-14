// lib/objects/java.util.Map.js

class JavaUtilMap {
  constructor(jObjStream) {
    this.jObjStream = jObjStream;
    this.jObjStream.classes['java.util.Map'] = {
      name: 'java.util.Map',
      type: 'Class',
      fields: { }
    };
  }
}

module.exports = JavaUtilMap;
