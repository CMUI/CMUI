'use strict'

const path = require('path')
const gulp = require('gulp')
const stylint = require('gulp-stylint')
const gulpfiles = require('gulpfiles')

const PATH_SRC_CSS = './src/css/'
const FILES_SRC_CSS = path.join(PATH_SRC_CSS, '**/*.styl')
const ENTRY_SRC_CSS = path.join(PATH_SRC_CSS, '_wrapper/cmui.styl')
const PATH_DEST = './dist/'
const FILES_DEST = path.join(PATH_DEST, '**/*')

const scripts = {
	'cmui.js': [
		'./src/js/adapter-trad/_intro.js',
		'./src/js/adapter-trad/_var.js',
		'./src/js/core.js',
		'./src/js/dom.js',
		'./src/js/btn.js',
		'./src/js/form.js',
		'./src/js/msg-box.js',
		'./src/js/overlay-mask.js',
		'./src/js/overlay-loading.js',
		'./src/js/panel.js',
		'./src/js/adapter-trad/_outro.js',
	]
}
const modules = {
	'zero.styl': [
		'./node_modules/cmui-zero/src/zero.styl',
	],
	'normalize.styl': [
		'./node_modules/normalize.css/normalize.css',
	],
}

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
gulp.task('prepare-module', gulpfiles.concat({
	rules: modules,
	dest: './src/css/vendor/',
}))

gulp.task('css', gulpfiles.stylus({
	src: ENTRY_SRC_CSS,
	dest: PATH_DEST,
	config: {nib: true},
}))

gulp.task('js', gulpfiles.concat({
	rules: scripts,
	dest: PATH_DEST,
}))

gulp.task('default', gulp.series([
	'lint-css',
	'clean',
	'prepare-module',
	gulp.parallel([
		'js',
		'css',
	]),
]))
