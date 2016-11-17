const gulp = require('gulp');
const path = require('path');
const concat = require("gulp-concat");
const gutil = require('gulp-util');
const babel = require('gulp-babel');
const less = require('gulp-less');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");
let livereload = require('gulp-livereload');
const browserify = require('gulp-browserify');

function get_babel_params() {
    return {
        //        compact: false,
        presets: ['es2015'],
        //        plugins: ["transform-runtime"],
        //        optional: ['runtime'],
    }
}
gulp.task('js', function () {
    var babel_pipe = babel(get_babel_params());
    babel_pipe.on('error', function (ee) {
        gutil.log(ee);
        babel_pipe.end();
    });

    return gulp.src(['js/*.js'])
        .pipe(babel_pipe)
        .pipe(browserify({
            insertGlobals: false,
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
        .pipe(babel_pipe)
        .pipe(gulp.dest('js/package'))
        .pipe(livereload())

});



livereload.listen();
gulp.task('default', function () {
    gulp.start(["top",'js']);
});
gulp.watch('js/index.js', ['js']);