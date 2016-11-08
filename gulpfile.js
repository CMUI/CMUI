'use strict'

var path = require('path')
var gulp = require('gulp')
var nib = require('nib')
var stylus = require('gulp-stylus')
var stylint = require('gulp-stylint')
var rename = require('gulp-rename')
var gulpfiles = require('gulpfiles')

var PATH_SRC_CSS = './src/css/'
var FILES_SRC_CSS = path.join(PATH_SRC_CSS, '**/*.styl')
var ENTRY_SRC_CSS = path.join(PATH_SRC_CSS, '_wrapper/cmui.styl')
var PATH_DEST = './dist/'
var FILES_DEST = path.join(PATH_DEST, '**/*')

gulp.task('clean', gulpfiles.del({
	glob: FILES_DEST,
}))

gulp.task('lint-css', function () {
	return gulp.src([
		FILES_SRC_CSS,
		'!' + path.join(PATH_SRC_CSS, 'vendor/*.*'),
		'!' + path.join(PATH_SRC_CSS, 'helper/lib.styl'),
	])
		.pipe(stylint())
		.pipe(stylint.reporter())
		.pipe(stylint.reporter('fail'))
})

gulp.task('css', gulpfiles.stylus({
	src: ENTRY_SRC_CSS,
	dest: PATH_DEST,
}))

gulp.task('default', gulp.series([
	gulp.parallel([
		'clean',
		'lint-css',
	]),
	gulp.parallel([
		'css',
	]),
]))
