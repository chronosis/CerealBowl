# Java Object Stream Specification
From https://docs.oracle.com/javase/7/docs/platform/serialization/spec/protocol.html#8299

## Grammar
For ease of use, the grammar has been reorganized into the order which new verbs appear below.

```
stream:
  magic version contents

magic:
  STREAM_MAGIC

version
  STREAM_VERSION

contents:
  content
  contents content

content:
  object
  blockdata

object:
  newObject
  newClass
  newArray
  newString
  newEnum
  newClassDesc
  prevObject
  nullReference
  exception
  TC_RESET

newObject:
 TC_OBJECT classDesc newHandle classdata[]  // data for each class

classDesc:
  newClassDesc
  nullReference
  (ClassDesc)prevObject      // an object required to be of type
                             // ClassDesc

newClassDesc:
  TC_CLASSDESC className serialVersionUID newHandle classDescInfo
  TC_PROXYCLASSDESC newHandle proxyClassDescInfo

className:
  (utf)

serialVersionUID:
  (long)

newHandle:       // The next number in sequence is assigned (not read)
                 // to the object being serialized or deserialized

classDescInfo:
  classDescFlags fields classAnnotation superClassDesc

classDescFlags:
  (byte)                  // Defined in Terminal Symbols and
                          // Constants

fields:
  (short)<count>  fieldDesc[count]

fieldDesc:
  primitiveDesc
  objectDesc

primitiveDesc:
  prim_typecode fieldName

prim_typecode:
  `B'	// byte
  `C'	// char
  `D'	// double
  `F'	// float
  `I'	// integer
  `J'	// long
  `S'	// short
  `Z'	// boolean

fieldName:
  (utf)

objectDesc:
  obj_typecode fieldName className1

obj_typecode:
  `[`	// array
  `L'	// object

className1:
  (String)object             // String containing the field's type,
                             // in field descriptor format

classAnnotation:
  endBlockData
  contents endBlockData      // contents written by annotateClass

endBlockData:
  TC_ENDBLOCKDATA

superClassDesc:
  classDesc

proxyClassDescInfo:
  (int)<count> proxyInterfaceName[count] classAnnotation superClassDesc

proxyInterfaceName:
  (utf)

nullReference:
  TC_NULL

prevObject:
  TC_REFERENCE (int)handle

classdata:
  nowrclass                 // SC_SERIALIZABLE & classDescFlag &&
                            // !(SC_WRITE_METHOD & classDescFlags)
  wrclass objectAnnotation  // SC_SERIALIZABLE & classDescFlag &&
                            // SC_WRITE_METHOD & classDescFlags
  externalContents          // SC_EXTERNALIZABLE & classDescFlag &&
                            // !(SC_BLOCKDATA  & classDescFlags
  objectAnnotation          // SC_EXTERNALIZABLE & classDescFlag&&
                            // SC_BLOCKDATA & classDescFlags

nowrclass:
  values                    // fields in order of class descriptor
                            // The size and types are described by the
                            // classDesc for the current object

wrclass:
  nowrclass

externalContent:          // Only parseable by readExternal
   (bytes)                // primitive data
   object

externalContents:         // externalContent written by
  externalContent         // writeExternal in PROTOCOL_VERSION_1.
  externalContents externalContent

objectAnnotation:
  endBlockData
  contents endBlockData     // contents written by writeObject
                            // or writeExternal PROTOCOL_VERSION_2.

newClass:
  TC_CLASS classDesc newHandle

newArray:
  TC_ARRAY classDesc newHandle (int)<size> values[size]

newString:
 TC_STRING newHandle (utf)
 TC_LONGSTRING newHandle (long-utf)

newEnum:
  TC_ENUM classDesc newHandle enumConstantName

enumConstantName:
  (String)object

exception:
  TC_EXCEPTION reset (Throwable)object	 reset

reset:           // The set of known objects is discarded
                 // so the objects of the exception do not
                 // overlap with the previously sent objects
                 // or with objects that may be sent after
                 // the exception

blockdata:
  blockdatashort
  blockdatalong

blockdatashort:
  TC_BLOCKDATA (unsigned byte)<size> (byte)[size]

blockdatalong:
  TC_BLOCKDATALONG (int)<size> (byte)[size]
```

## Constants
The following symbols in java.io.ObjectStreamConstants define the terminal and constant values expected in a stream.

```
  STREAM_MAGIC = (short)0xaced;
  STREAM_VERSION = 5;
  TC_NULL = (byte)0x70;
  TC_REFERENCE = (byte)0x71;
  TC_CLASSDESC = (byte)0x72;
  TC_OBJECT = (byte)0x73;
  TC_STRING = (byte)0x74;
  TC_ARRAY = (byte)0x75;
  TC_CLASS = (byte)0x76;
  TC_BLOCKDATA = (byte)0x77;
  TC_ENDBLOCKDATA = (byte)0x78;
  TC_RESET = (byte)0x79;
  TC_BLOCKDATALONG = (byte)0x7A;
  TC_EXCEPTION = (byte)0x7B;
  TC_LONGSTRING = (byte) 0x7C;
  TC_PROXYCLASSDESC = (byte) 0x7D;
  TC_ENUM = (byte) 0x7E;
  baseWireHandle = 0x7E0000;
```

## Flags
The flag byte classDescFlags may include values of

```
  SC_WRITE_METHOD = 0x01;      //if SC_SERIALIZABLE
  SC_BLOCK_DATA = 0x08;        //if SC_EXTERNALIZABLE
  SC_SERIALIZABLE = 0x02;
  SC_EXTERNALIZABLE = 0x04;
  SC_ENUM = 0x10;
```

  The flag `SC_WRITE_METHOD` is set if the Serializable class writing the stream had a writeObject method that may have written additional data to the stream. In this case a `TC_ENDBLOCKDATA` marker is always expected to terminate the data for that class.

  The flag `SC_BLOCKDATA` is set if the Externalizable class is written into the stream using STREAM_PROTOCOL_2. By default, this is the protocol used to write Externalizable objects into the stream in JDK 1.2. JDK 1.1 writes `STREAM_PROTOCOL_1`.

  The flag `SC_SERIALIZABLE` is set if the class that wrote the stream extended java.io.Serializable but not java.io.Externalizable, the class reading the stream must also extend java.io.Serializable and the default serialization mechanism is to be used.

  The flag `SC_EXTERNALIZABLE` is set if the class that wrote the stream extended java.io.Externalizable, the class reading the data must also extend Externalizable and the data will be read using its writeExternal and readExternal methods.

  The flag `SC_ENUM` is set if the class that wrote the stream was an enum type. The receiver's corresponding class must also be an enum type. Data for constants of the enum type will be written and read as described in Section 1.12, "Serialization of Enum Constants".
