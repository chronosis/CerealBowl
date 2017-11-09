const gulp = require('gulp');
const notify = require('gulp-notify');        // Provide Gulp with a way to create push notifications
const plumber = require('gulp-plumber');      // Handle Errors without breaking
const eslint = require('gulp-eslint');        // ES6 JS/JSX Lineter -- Check for syntax errors
const mocha = require('gulp-mocha');          // Test Framework
const config = require('./build.config');

const devFolder = config.devFolder;
const configFolder = config.configFolder;
const docsFolder = config.docsFolder;

// Route Errors to the Notificication Tray
const onError = (err) => {
  notify.onError({
    title:    'Error',
    message:  '<%= error %>',
  })(err);
  this.emit('end');
};

const plumberOptions = {
  errorHandler: onError
};

// Lint JS Files
gulp.task('lint', () => {
  return gulp.src(devFolder + '/**/*.js')
    .pipe(eslint({ configFile: '.eslintrc.json' }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('test', ['lint'], () => {
  return gulp.src('test.js', { read: false })
    .pipe(mocha())
    .once('error', function() {
      process.exit(1);
    });
});

gulp.task('lintfix', () => {
  return gulp.src(devFolder + '/**/*.js')
    .pipe(eslint({ configFile: '.eslintrc.json', fix: true }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('default', ['test']);
