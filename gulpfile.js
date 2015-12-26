'use strict'

var path = require('path')
var gulp = require('gulp')
var stylint = require('gulp-stylint')

var PATH_SRC = './src/'

gulp.task('lint-css', function () {
	return gulp.src(path.join(PATH_SRC, 'css/**/*.styl'))
		.pipe(stylint())
		.pipe(stylint.reporter())
		.pipe(stylint.reporter('fail'))
})
