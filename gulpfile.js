var gulp;
var preprocess;
var version;
var jshint;
var uglify;
var showTasks;
var file;
var banner;
var insert;

gulp = require('gulp');
preprocess = require('gulp-preprocess');
version = require('./package.json').version;
jshint = require('gulp-jshint');
uglify = require('gulp-uglifyjs');
showTasks = require('gulp-task-listing');
file = './src/Helpers.js';
insert = require('gulp-insert');
banner = [
    '/**',
    ' * Version ' + version + ', get uncompressed https://github.com/tytskiy/Helpers.js',
    ' * Warning! Fix the prefix.',
    ' * !function(...}("T0"); becomes !function(...}("T23");',
    ' */\n'
].join('\n');

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
        .pipe(insert.prepend(banner))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['lint', 'build', 'minify'], function () {
    gulp.watch([file], ['lint', 'build', 'minify']);
});