// lib/constants.js
// From https://docs.oracle.com/javase/7/docs/platform/serialization/spec/protocol.html#8299

const Constants = {
  // Magic number that is written to the stream header.
  STREAM_MAGIC: 0xACED, // 44269,
  // Version number that is written to the stream header.
  STREAM_VERSION: 0x0005, // 5,
  // ==========================================================================
  // Tags
  // ==========================================================================
  // Each item in the stream is preceded by a tag
  // Null Object -- nullReferece 'p'
  TC_NULL: 0x70, // 112,
  // Reference to an object previously written
  // -- prevObject 'q'
  TC_REFERENCE: 0x71, // 113,
  // New Class Descriptor
  // -- newClassDesc 'r'
  TC_CLASSDESC: 0x72, // 114,
  // New Object
  // -- newObject 's'
  TC_OBJECT: 0x73, // 115,
  // String; immediately followed by a byte value indicating the length of the string in bytes
  // -- newString 't'
  TC_STRING: 0x74, // 116,
  // Array  -- newArray 'u'
  TC_ARRAY: 0x75, // 117,
  // Class Reference -- newClass 'v'
  TC_CLASS: 0x76, // 118,
  // Block of optional data; immediately followed by a byte value indicating the length of the block in bytes
  // -- blockdata 'w'
  TC_BLOCKDATA: 0x77, // 119,
  // End of optional block data blocks for an object
  // -- endBlockData  'x'
  TC_ENDBLOCKDATA: 0x78, // 120,
  // Reset stream context. All handles written into stream are reset.
  // -- reset 'y'
  TC_RESET: 0x79, // 121,
  // Block of optional data; immediately followed by a 64-bit(long) value indicating the length of the block in bytes
  // -- blockdata 'z'
  TC_BLOCKDATALONG: 0x7A, // 122,
  // Exception during write
  // -- exception '{'
  TC_EXCEPTION: 0x7B, // 123,
  // String; immediately followed by a 64-bit(long) value indicating the length of the string in bytes
  // -- newString '|'
  TC_LONGSTRING: 0x7C, // 124,
  // New Proxy Class Description
  // -- newClassDesc '}'
  TC_PROXYCLASSDESC: 0x7D, // 125,
  // Last Tag; immediately followed by a non-null byte value indicating the byte length of the name of the enum
  // -- newEnum '~'
  TC_ENUM: 0x7E, // 126,
  // First wire handle to be assigned.
  baseWireHandle: 0x007E0000, // 8257536,

  // ==========================================================================
  // Bit Flags
  // ==========================================================================
  // Bit masks for ObjectStreamClass flag.
  // Indicates a Serializable class defines its own writeObject method
  SC_WRITE_METHOD: 0x01,
  // Indicates class is Serializable
  SC_SERIALIZABLE: 0x02,
  // Indicated class is Externalizable
  SC_EXTERNALIZABLE: 0x04,
  // Indicates Externalizable data written in Block Data mode
  SC_BLOCK_DATA: 0x08,
  // Indicates class is an enum type
  SC_ENUM: 0x10,

  // ==========================================================================
  // Basie Data Types
  // ==========================================================================
  // Byte value (unsigned) 'B'
  DATATYPE_BYTE: 0x42, // 66,
  DATATYPE_BYTE_SIZE: 1,
  // Short (16-bit) Int (unsigned) 'C'
  DATATYPE_USHORT: 0x43, // 67,
  DATATYPE_USHORT_SIZE: 2,
  // Double precision floating-point 'D'
  DATATYPE_DOUBLE: 0x44, // 68,
  DATATYPE_DOUBLE_SIZE: 8,
  // Single-precision floating-point 'F'
  DATATYPE_FLOAT: 0x46, // 70,
  DATATYPE_FLOAT_SIZE: 4,
  // (32-bit) Int (signed) 'I'
  DATATYPE_INT: 0x49, // 73,
  DATATYPE_INT_SIZE: 4,
  // Long (64-bit) Int (signed) 'J'
  DATATYPE_LONG: 0x4A, // 74,
  DATATYPE_LONG_SIZE: 8,
  // Object 'L'
  DATATYPE_OBJECT: 0x4C, // 76,
  // Short (16-bit) INT (signed) 'S'
  DATATYPE_SHORT: 0x53, // 83,
  DATATYPE_SHORT_SIZE: 2,
  // Boolean 'Z'
  DATATYPE_BOOLEAN: 0x5A, // 90,
  DATATYPE_BOOLEAN_SIZE: 1,
  // Array '['
  DATATYPE_ARRAY: 0x5B, // 91,

  // ==========================================================================
  // Protocol Versions
  // ==========================================================================
  PROTOCOL_VERSION_1: 1,
  PROTOCOL_VERSION_2: 2
};

Constants.primitives = {
  [Constants.DATATYPE_BYTE]: { size: Constants.DATATYPE_BYTE_SIZE, type: 'byte' },
  [Constants.DATATYPE_USHORT]: { size: Constants.DATATYPE_USHORT_SIZE, type: 'ushort' },
  [Constants.DATATYPE_DOUBLE]: { size: Constants.DATATYPE_DOUBLE_SIZE, type: 'double' },
  [Constants.DATATYPE_FLOAT]: { size: Constants.DATATYPE_FLOAT_SIZE, type: 'float' },
  [Constants.DATATYPE_INT]: { size: Constants.DATATYPE_INT_SIZE, type: 'int' },
  [Constants.DATATYPE_LONG]: { size: Constants.DATATYPE_LONG_SIZE, type: 'long' },
  [Constants.DATATYPE_SHORT]: { size: Constants.DATATYPE_SHORT_SIZE, type: 'short' },
  [Constants.DATATYPE_BOOLEAN]: { size: Constants.DATATYPE_BOOLEAN_SIZE, type: 'boolean' },
  [Constants.DATATYPE_OBJECT]: { size: 0, type: 'object' },
  [Constants.DATATYPE_ARRAY]: { size: 0, type: 'array' },
  [Constants.TC_STRING]: { size: 0, type: 'string' },
  [Constants.TC_LONGSTRING]: { size: 0, type: 'string' },
};

module.exports = Constants;
