
////////////////////  dialog  ////////////////////
void function (window, CMUI) {
	'use strict'

	// namespace
	var moduleName = 'dialog'
	var module = CMUI[moduleName] = CMUI[moduleName] || {}

	// const
	var CLS = 'cm-dialog'

	var _stack = []

	// api
	function show(elem, options) {
		// options
		// - autoCloseDelay: 345 (ms) (default 0, falsy value means never auto close)
		// - callback: fn
		var $elem = $(elem).first()	// only allow to show one panel
		if (!$elem.hasClass(CLS)) return false

		// move to root of body
		// it is unnecessary, because of fixed position.
		// if (!$elem.parent().is('body')) $elem.appendTo(gearbox.dom.$body)

		if (!_.isObject(options)) options = {}

		_stack.push($elem)
		CMUI.mask.fadeIn()
	}
	function hide() {
		if (!_stack.length) return false
		// options
		// - duration: 345 (ms) (default 200)
		// - callback: fn

		var $elem = _.last(_stack)
		$elem.hide()

		_stack.pop()
		CMUI.mask.fadeOut()
	}

	function create(config) {

	}
	//exports
	// module._init = _init
	module.show = show
	module.hide = hide
	module.create = create

	//init
	CMUI._initModule(moduleName)

}(window, CMUI)
