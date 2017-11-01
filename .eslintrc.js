let config = {
	extends: 'cmui',
	root: true,
	globals: {
		'jQuery': false,
		'Zepto': false,
		'$': false,
		'_': false,
		'gearbox': false,
		'CMUI': false,
	},
	env: {
		'browser': true,
		'node': true,
		'mocha': true,
		'es6': true,
	},
}

module.exports = config
