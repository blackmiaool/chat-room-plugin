const gulp = require('gulp');
const path = require('path');
const concat = require("gulp-concat");
const gutil = require('gulp-util');
const babel = require('gulp-babel');
const less = require('gulp-less');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");
const livereload = require('gulp-livereload');
const browserify = require('gulp-browserify');
const cached=require('gulp-cached');

function get_babel_params() {
    return {
        //        compact: false,
        presets: ['es2015'],
        //        plugins: ["transform-runtime"],
        //        optional: ['runtime'],
    }
}
gulp.task('js',['top'], function () {
    var babel_pipe = babel(get_babel_params());
    babel_pipe.on('error', function (ee) {
        gutil.log(ee);
        babel_pipe.end();
    });

    return gulp.src(['js/index.js'])
        .pipe(babel_pipe)
        .pipe(browserify({
//            insertGlobals: true,
        noParse:['jquery.js']
        }))
        .pipe(gulp.dest('res/'))
        .pipe(livereload())

});
gulp.task('top', function () {
    var babel_pipe = babel(get_babel_params());
    babel_pipe.on('error', function (ee) {
        gutil.log(ee);
        babel_pipe.end();
    });

    return gulp.src(['../**/*.js','!../env/**/*.js','!../node_modules/**/*.js'])
        .pipe(cached('html'))
        .pipe(babel_pipe)
        .pipe(gulp.dest('js/package'))


});
gulp.task('reload', function () {
    gulp.src("").pipe(livereload());
});


livereload.listen();
gulp.task('default', function () {
    gulp.start(["top",'js']);
});
gulp.watch('js/index.js', ['js']);
gulp.watch('../commands/*.js', ['top','js']);