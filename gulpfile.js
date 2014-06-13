var gulp;
var preprocess;
var version;
var jshint;
var uglify;

gulp = require('gulp');
preprocess = require('gulp-preprocess');
version = require('./package.json').version;
jshint = require('gulp-jshint');
uglify = require('gulp-uglifyjs');

gulp.task('lint', function() {
    return gulp.src(['./src/Helpers.js'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('build', function() {
    return gulp.src(['./src/Helpers.js'])
        .pipe(preprocess({context: {VERSION: version}}))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('minify', function() {
    return gulp.src(['./src/Helpers.js'])
        .pipe(preprocess({context: {VERSION: version}}))
        .pipe(uglify('Helpers.min.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('default', function() {

});