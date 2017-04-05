
////////////////////  overlay - mask  ////////////////////
void function (window, CMUI) {
	'use strict'

	// namespace
	var moduleName = 'mask'
	var module = CMUI[moduleName] = CMUI[moduleName] || {}

	//class name
	var CLS = 'cm-mask'
	var CLS_HIDDEN = 'hidden'
	var CLS_FADE_IN = 'fade-in'
	var CLS_FADE_OUT = 'fade-out'
	var HTML = '<div class="' + CLS + ' ' + CLS_HIDDEN + '"></div>'

	//flag
	var $elem
	var isVisible = false

	//util
	var _prepare = _.once(function () {
		$elem = $(HTML).appendTo(gearbox.dom.$body)
		gearbox.dom.$win.on('resize', function () {
			if (isVisible) _pos()
		})
	})
	function _pos() {
		// first, shrink
		$elem.css('height', '100%')
		// then, reset its height.
		$elem.css({
			height: document.documentElement.scrollHeight + 'px'
		})
	}

	//api
	function get$Element() {
		_prepare()
		return $elem
	}
	function adjust() {
		_pos()
	}
	function show() {
		if (isVisible) return false
		_prepare()
		_pos()
		var classNames = [CLS]
		$elem.attr('class', classNames.join(' '))
		isVisible = true
	}
	function fadeIn() {
		if (isVisible) return false
		_prepare()
		_pos()
		var classNames = [CLS, CLS_FADE_IN]
		$elem.attr('class', classNames.join(' '))
		isVisible = true
	}
	function hide() {
		if (!isVisible) return false
		var classNames = [CLS, CLS_HIDDEN]
		$elem.attr('class', classNames.join(' '))
		isVisible = false
	}
	function fadeOut() {
		if (!isVisible) return false
		var classNames = [CLS, CLS_FADE_OUT]
		$elem.attr('class', classNames.join(' '))
		isVisible = false
	}

	// exports
	module.get$Element = get$Element
	module.adjust = adjust
	module.show = show
	module.hide = hide
	module.fadeIn = fadeIn
	module.fadeOut = fadeOut

	// init
	CMUI._initModule(moduleName)

}(window, CMUI)
