
////////////////////  dom  ////////////////////
void function (window, CMUI) {
	'use strict'

	//namespace
	var moduleName = 'dom'
	var module = CMUI[moduleName] = CMUI[moduleName] || {}

	//api
	function _init() {
		var ua = _.ua

		//segment legacy os
		var version = _.str.toFloat(ua.osVersion)
		var isLegacy =
				(ua.isIOS && version < 6) ||	//below ios 6
				(ua.isAndroid && version < 4)	//below android 4

		//set css hook on `html` element
		var classNames = [
			'js cmui',
			ua.isIOS ? 'ios' : '',
			ua.isAndroid ? 'android' : '',
			isLegacy ? 'legacy' : '',
			ua.isWebKit ? 'webkit' : '',
			ua.isSafari ? 'safari' : '',
			ua.isChrome ? 'chrome' : '',
			ua.isMoz ? 'moz' : '',
			ua.isTouchDevice ? 'touch' : 'mouse',
			ua.isMobileDevice ? 'mobile' : 'desktop'
		]
		_.dom.$root.removeClass('no-js').addClass(classNames.join(' '))

		//to enable `:active` style on ios and android 4+
		if (ua.isIOS || (ua.isAndroid && !isLegacy)) {
			$(function () {
				_.dom.$body.on('touchstart', function () {})
			})
		}
	}

	//exports
	module._init = _init

	//init
	CMUI._initModule(moduleName)

}(window, CMUI)
