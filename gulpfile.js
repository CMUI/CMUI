'use strict'

const path = require('path')
const gulp = require('gulp')
const stylint = require('gulp-stylint')
const gulpfiles = require('gulpfiles')

const PATH_SRC_CSS = './src/css/'
const FILES_SRC_CSS = path.join(PATH_SRC_CSS, '**/*.styl')
const ENTRY_SRC_CSS = path.join(PATH_SRC_CSS, '_wrapper/cmui.styl')
const PATH_DEST = './dist/'
const PATH_SRC_CSS_VENDOR = path.join(PATH_SRC_CSS, 'vendor')

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
		'./src/js/overlay-dialog.js',
		'./src/js/panel.js',
		'./src/js/scroll-box.js',
		'./src/js/adapter-trad/_outro.js',
	]
}

gulp.task('clean', gulpfiles.del({
	glob: [
		path.join(PATH_DEST, '*.@(js|css)'),
		PATH_SRC_CSS_VENDOR,
	],
}))

gulp.task('lint-css', function () {
	return gulp.src([
		FILES_SRC_CSS,
		'!' + path.join(PATH_SRC_CSS, 'vendor/**/*.*'),
	])
		.pipe(stylint())
		.pipe(stylint.reporter())
		.pipe(stylint.reporter('fail'))
})

gulp.task('prepare-module', gulp.parallel([
	gulpfiles.copy({
		src: './node_modules/cmui-zero/src/zero.styl',
		dest: PATH_SRC_CSS_VENDOR,
	}),
	gulpfiles.copy({
		src: './node_modules/normalize.css/normalize.css',
		dest: PATH_SRC_CSS_VENDOR,
		config: {
			rename: 'normalize.styl',
		}
	}),
	gulpfiles.copy({
		src: './node_modules/cmui-brush/**/*.styl',
		dest: path.join(PATH_SRC_CSS_VENDOR, 'brush'),
	}),
]))

gulp.task('css', gulpfiles.stylus({
	src: ENTRY_SRC_CSS,
	dest: PATH_DEST,
	config: {
		nib: true,
		brush: true,
	},
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
