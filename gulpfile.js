var gulp;
var preprocess;
var version;
var jshint;
var uglify;
var showTasks;
var file;

gulp = require('gulp');
preprocess = require('gulp-preprocess');
version = require('./package.json').version;
jshint = require('gulp-jshint');
uglify = require('gulp-uglifyjs');
showTasks = require('gulp-task-listing');
file = './src/Helpers.js';

gulp.task('help', showTasks);

gulp.task('lint', function() {
    return gulp.src([file])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('build', function() {
    return gulp.src([file])
        .pipe(preprocess({context: {VERSION: version}}))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('minify', function() {
    return gulp.src([file])
        .pipe(preprocess({context: {VERSION: version}}))
        .pipe(uglify('Helpers.min.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['lint', 'build', 'minify'], function () {
    gulp.watch([file, './package.json'], ['lint', 'build', 'minify']);
});