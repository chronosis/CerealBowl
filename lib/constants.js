// lib/constants.js
// From https://docs.oracle.com/javase/7/docs/platform/serialization/spec/protocol.html#8299

module.exports = {
  // Magic number that is written to the stream header.
  STREAM_MAGIC: 0xaced,

  // Version number that is written to the stream header.
  STREAM_VERSION: 0x0005,

  // ==========================================================================
  // Tags
  // ==========================================================================
  // Each item in the stream is preceded by a tag

  // First Tag
  TC_BASE: 0x70,

  // Null Object
  TC_NULL: 0x70,

  // Reference to an object previously written
  TC_REFERENCE: 0x71,

  // New Class Descriptor
  TC_CLASSDESC: 0x72,

  // New Object
  TC_OBJECT: 0x73,

  // String; immediately followed by a byte value indicating the length of the string in bytes
  TC_STRING: 0x74,

  // Array
  TC_ARRAY: 0x75,

  // Class Reference
  TC_CLASS: 0x76,

  // Block of optional data; immediately followed by a byte value indicating the length of the block in bytes
  TC_BLOCKDATA: 0x77,

  // End of optional block data blocks for an object
  TC_ENDBLOCKDATA: 0x78,

  // Reset stream context. All handles written into stream are reset.
  TC_RESET: 0x79,

   // Block of optional data; immediately followed by a 16-bit/32-bit(long) value indicating the length of the block in bytes
  TC_BLOCKDATALONG: 0x7A,

  // Exception during write
  TC_EXCEPTION: 0x7B,

  // String; immediately followed by a 16-bit/32-bit(long) value indicating the length of the string in bytes
  TC_LONGSTRING: 0x7C,

  // New Proxy Class Description
  TC_PROXYCLASSDESC: 0x7D,

  // Last Tag; immediately followed by a non-null byte value indicating the byte length of the name of the enum
  TC_ENUM: 0x7E,

  // Last Tag; immediately followed by a null byte value indicating that this is a final tag
  TC_MAX: 0x7E,

  // First wire handle to be assigned.
  baseWireHandle: 0x7e0000,

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
  DATATYPE_BYTE: 0x42,
  DATATYPE_BYTE_SIZE: 1,

  // Short (16-bit) Int (unsigned) 'C'
  DATATYPE_USHORT: 0x43,
  DATATYPE_USHORT_SIZE: 2,

  // Double precision floating-point 'D'
  DATATYPE_DOUBLE: 0x44,
  DATATYPE_DOUBLE_SIZE: 8,

  // Single-precision floating-point 'F'
  DATATYPE_FLOAT: 0x46,
  DATATYPE_FLOAT_SIZE: 4,

  // (32-bit) Int (signed) 'I'
  DATATYPE_INT: 0x49,
  DATATYPE_INT_SIZE: 4,

  // Long (64-bit) Int (signed) 'J'
  DATATYPE_LONG: 0x4A,
  DATATYPE_LONG_SIZE: 8,

  // Object 'L'
  DATATYPE_OBJECT: 0x4C,

  // Short (16-bit) INT (signed) 'S'
  DATATYPE_SHORT: 0x53,
  DATATYPE_SHORT_SIZE: 2,

  // Boolean 'Z'
  DATATYPE_BOOLEAN: 0x5A,
  DATATYPE_BOOLEAN_SIZE: 1,

  // Array '['
  DATATYPE_ARRAY: 0x5B,

  // ==========================================================================
  // Protocol Versions
  // ==========================================================================
  PROTOCOL_VERSION_1: 0x01,
  PROTOCOL_VERSION_2: 0x02,
};
