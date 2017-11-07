# jdeserialize

[![NPM](https://nodei.co/npm/jdeserialize.png?downloads=true)](https://nodei.co/npm/jdeserialize/)

[![Actual version published on npm](http://img.shields.io/npm/v/jdeserialize.svg)](https://www.npmjs.org/package/jdeserialize)
[![Travis build status](https://travis-ci.org/chronosis/jdeserialize.svg)](https://www.npmjs.org/package/jdeserialize)
[![Total npm module downloads](http://img.shields.io/npm/dt/jdeserialize.svg)](https://www.npmjs.org/package/jdeserialize)
[![Package Quality](http://npm.packagequality.com/shield/jdeserialize.svg)](http://packagequality.com/#?package=jdeserialize)

JDeserialize is a library to deserialize Java Object Streams v2.

Note: Version 1 streams are are only used by very old version of Java and are therefore not supported by this library.

### Installation

```
$ npm install jdeserialize
```

### Usage
```js
  const JDeserialize = require('jdeserialize');

  let deserializer = new JDeserialize();
  let obj = deserializer.read(buff);
```

## API

### .read(buff)
Reads the contents of the Buffer `buff` and creates an JavaScript Object
