// lib/objects/java.lang.String.js

class JavaLangStream {
  constructor(jObjStream) {
    this.jObjStream = jObjStream;
    this.jObjStream.classes['java.lang.String'] = {
      name: 'java.lang.String',
      type: 'Class',
      fields: { }
    };
  }
}

module.exports = JavaLangStream;
