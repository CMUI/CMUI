
////////////////////  dom  ////////////////////
void function (window, CMUI) {
	'use strict'

	//namespace
	var moduleName = 'dom'
	var module = CMUI[moduleName] = CMUI[moduleName] || {}

	//api
	function _init() {
		var ua = gearbox.ua

		//segment legacy os
		var version = gearbox.str.toFloat(ua.osVersion)
		var isLegacy =
				(ua.isIOS && version < 6) ||	//below ios 6
				(ua.isAndroid && version < 4)	//below android 4

		//set css hook on `html` element
		var classNames = [
			'js cmui',
			ua.isIOS ? 'ios' : '',
			ua.isAndroid ? 'android' : '',
			isLegacy ? 'legacy' : '',
			ua.isSafari ? 'safari' : '',
			ua.isChrome ? 'chrome' : '',
			// @DEPRECATED 'mouse' means mouse-only, use `no-touch` instead
			ua.isTouchDevice ? 'touch' : 'no-touch mouse',
			ua.isMobileDevice ? 'mobile' : 'desktop'
		]
		gearbox.dom.$root.removeClass('no-js').addClass(classNames.join(' '))

		//to enable `:active` style on ios and android 4+
		if (ua.isIOS || (ua.isAndroid && !isLegacy)) {
			$(function () {
				gearbox.dom.$body.on('touchstart', function () {})
			})
		}
	}

	//exports
	module._init = _init

	//init
	CMUI._initModule(moduleName)

}(window, CMUI)
