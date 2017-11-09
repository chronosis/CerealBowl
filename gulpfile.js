const gulp = require('gulp');
// ES6 JS/JSX Lineter -- Check for syntax errors
const eslint = require('gulp-eslint');
// Test Framework
const mocha = require('gulp-mocha');
const config = require('./build.config');

const devFolder = config.devFolder;
// const configFolder = config.configFolder;
// const docsFolder = config.docsFolder;

// Lint JS Files
gulp.task('lint', () => {
  return gulp.src(`${devFolder}/**/*.js`)
    .pipe(eslint({ configFile: '.eslintrc.json' }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('test', ['lint'], () => {
  return gulp.src('test.js', { read: false })
    .pipe(mocha())
    .once('error', () => {
      process.exit(1);
    });
});

gulp.task('lintfix', () => {
  return gulp.src(`${devFolder}/**/*.js`)
    .pipe(eslint({ configFile: '.eslintrc.json', fix: true }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('default', ['test']);
