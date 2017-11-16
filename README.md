# jdeserialize

[![NPM](https://nodei.co/npm/jdeserialize.png?downloads=true)](https://nodei.co/npm/jdeserialize/)

[![Actual version published on npm](http://img.shields.io/npm/v/jdeserialize.svg)](https://www.npmjs.org/package/jdeserialize)
[![Travis build status](https://travis-ci.org/chronosis/jdeserialize.svg)](https://www.npmjs.org/package/jdeserialize)
[![Total npm module downloads](http://img.shields.io/npm/dt/jdeserialize.svg)](https://www.npmjs.org/package/jdeserialize)
[![Package Quality](http://npm.packagequality.com/shield/jdeserialize.svg)](http://packagequality.com/#?package=jdeserialize)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/88cafbb608b1497cbb685fd1f4f9b05e)](https://www.codacy.com/app/chronosis/jdeserialize?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=chronosis/jdeserialize&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/88cafbb608b1497cbb685fd1f4f9b05e)](https://www.codacy.com/app/chronosis/jdeserialize?utm_source=github.com&utm_medium=referral&utm_content=chronosis/jdeserialize&utm_campaign=Badge_Coverage)

JDeserialize is a library to deserialize Java Object Streams v2.

**This library is in Beta. As such, it is incomplete and does not function as expected with some real world data. Additionally, undocumented breaking changes are expected with the data output as issues with the library are addressed.**

**Note**: Version 1 streams are are only used by very old version of Java and are therefore not supported by this library.

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
