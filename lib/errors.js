// lib/errors.js

module.exports = {
  BUFFER_REQUIRED:             'The read method must be passed a buffer',
  BUFFER_EOF:                  'Cannot read past the end of buffer',
  STREAM_HEADER_BAD_MAGIC:     'The magic value in the stream header was bad',
  STREAM_HEADER_BAD_VERSION:   'The version in the stream header was bad',
}
