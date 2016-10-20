
////////////////////  panel  ////////////////////
void function (window, CMUI) {
	'use strict'

	// namespace
	var moduleName = 'panel'
	var module = CMUI[moduleName] = CMUI[moduleName] || {}

	// const
	var CLS = 'cm-panel'

	var _stack = []
	var actions = {
		'cm-panel-show': function () {
			var elem = this
			var options = _getOptionsFromAttr(elem)
			if (!options.target) return false
			CMUI.panel.show(options.target, options)
		},
		'cm-panel-hide': function () {
			var elem = this
			var options = _getOptionsFromAttr(elem)
			CMUI.panel.hide(options)
		},
		'cm-panel-switch-to': function () {
			var elem = this
			var options = _getOptionsFromAttr(elem)
			if (!options.target) return false
			CMUI.panel.switchTo(options.target, options)
		},
		'cm-panel-switch-back': function () {
			var elem = this
			var options = _getOptionsFromAttr(elem)
			CMUI.panel.switchBack(options)
		},
	}

	// util
	function _getOptionsFromAttr(elem) {
		var $elem = $(elem)
		var target = $elem.data('target') || elem.hash || ''
		var height = $elem.data('height')
		var duration = $elem.data('duration')
		return {
			target: target,
			height: height,
			duration: duration,
		}
	}

	// api
	function _init() {
		gearbox.action.add(actions)
	}
	function show(elem, options) {
		// options
		// - height: '123px' or '45%' (default '200px')
		// - duration: 345 (ms) (default 200)
		// - callback: fn
		var $elem = $(elem).first()	// only allow to show one panel
		if (!$elem.hasClass(CLS)) return false
		// TODO: what if show a panel when another panel already shown?

		// move to root of body
		// if (!$elem.parent().is('body')) $elem.appendTo(gearbox.dom.$body)

		if (!_.isObject(options)) options = {}
		var duration = options.duration || 200
		var height = options.height || '200px'
		var callback = options.callback
		if (_.isNumber(height)) height += 'px'
		var transform = 'translateY(101%)'
		$elem.css({
			'display': 'block',
			'transform': transform,
			'-webkit-transform': transform,
			'height': height,
		})
		$elem.animate({
			'translateY': '0%',
		}, duration, 'ease-out', callback)

		_stack.push($elem)
		CMUI.mask.fadeIn()
	}
	function hide(options) {
		if (!_stack.length) return false
		// options
		// - duration: 345 (ms) (default 200)
		// - callback: fn
		if (!_.isObject(options)) options = {}
		var duration = options.duration || 200
		var callback = options.callback

		var $elem = _.last(_stack)
		$elem.animate({
			'translateY': '101%',
		}, duration, 'ease-out', function () {
			$elem.css('display', 'none')
			if (_.isFunction(callback)) callback()
		})

		_stack.length = 0
		CMUI.mask.fadeOut()
	}

	function switchTo(elem, options) {
		// options
		// - callback: fn
		var $elem = $(elem).first()	// only allow to show one panel
		if (!_stack.length) return false
		if (!$elem.hasClass(CLS)) return false
		if (!_.isObject(options)) options = {}

		var $lastElem = _.last(_stack)

		var height = $lastElem.css('height')
		// var duration = options.duration || 200
		var callback = options.callback

		$lastElem.css({
			'display': 'none',
		})
		var transform = 'translateX(0%)'
		$elem.css({
			'display': 'block',
			'transform': transform,
			'-webkit-transform': transform,
			'height': height,
		})
		if (_.isFunction(callback)) callback()

		_stack.push($elem)
	}
	function switchBack(options) {
		if (_stack.length < 2) return false
		if (!_.isObject(options)) options = {}

		var $lastElem = _stack[_stack.length - 2]
		var $elem = _.last(_stack)

		var height = $lastElem.css('height')
		// var duration = options.duration || 200
		var callback = options.callback

		$elem.css({
			'display': 'none',
		})

		var transform = 'translateX(0%)'
		$lastElem.css({
			'display': 'block',
			'transform': transform,
			'-webkit-transform': transform,
			'height': height,
		})
		if (_.isFunction(callback)) callback()

		_stack.pop()
	}

	//exports
	module._init = _init
	module.show = show
	module.hide = hide
	module.switchTo = switchTo
	module.switchBack = switchBack

	//init
	CMUI._initModule(moduleName)

}(window, CMUI)
