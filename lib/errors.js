// lib/errors.js

module.exports = {
  BUFFER_REQUIRED: 'The read method must be passed a buffer.',
  BUFFER_EOF: 'Cannot read past the end of buffer.',
  STREAM_HEADER_BAD_MAGIC: 'The magic value in the stream header was bad.',
  STREAM_HEADER_BAD_VERSION: 'The version in the stream header was bad.',
  STREAM_INVALID_BLOCK_TYPE: 'The block type provided (%) is invalid.',
  STREAM_BAD_BLOCK_DATA: 'The block type provided (%) is bad.',
  STREAM_BAD_TYPE_DATA: 'The data type provided (%) is bad.',
  STREAM_BAD_OBJECT_TYPE: 'The object type (\'%\') is unknown.',
  STREAM_UNKNOWN_CLASS: 'The class (\'%\') is not defined.',
  STREAM_UNKNOWN_HANDLE: 'The object handle (%) is not defined.',
  STREAM_BAD_CLASS_REFERENCE: 'The reference provided is type (\'%\') and not an object of type Class.',
  FILTER_NOT_ARRAY: 'The data filter must be an array.'
};
