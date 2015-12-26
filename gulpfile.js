'use strict'

var path = require('path')
var gulp = require('gulp')
var del = require('del')
var nib = require('nib')
var stylus = require('gulp-stylus')
var stylint = require('gulp-stylint')
var rename = require('gulp-rename')

var PATH_SRC_CSS = './src/css/'
var PATH_DEST = './dist/'

gulp.task('default', ['clean', 'lint-css'], function () {
	gulp.start('css')
})

gulp.task('clean', function (callback) {
	del(path.join(PATH_DEST, '*.*'), callback)
})

gulp.task('lint-css', function () {
	return gulp.src([
		path.join(PATH_SRC_CSS, '**/*.styl'),
		'!' + path.join(PATH_SRC_CSS, 'vendor/*.*'),
	])
		.pipe(stylint())
		.pipe(stylint.reporter())
		.pipe(stylint.reporter('fail'))
})

gulp.task('css', function() {
	return gulp.src(path.join(PATH_SRC_CSS, 'theme/baixing/index.styl'))
		.pipe(stylus({
			use: [nib()],
			linenos: false,
			compress: false,
			errors: true
		}))
		.pipe(rename('cmui.css'))
		.pipe(gulp.dest(PATH_DEST))
})
