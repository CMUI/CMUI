
////////////////////  msg box  ////////////////////
void function (window, CMUI) {
	'use strict'

	//namespace
	var moduleName = 'msg-box'
	var module = CMUI[moduleName] = CMUI[moduleName] || {}

	var CLS_MSG_BOX = 'cmMsgBox'
	var CLS_CLOSE_BTN = 'cm-msg-box-close-btn'
	var SELECTOR = '.' + CLS_MSG_BOX + ' ' + '.' + CLS_CLOSE_BTN

	function _init() {
		var $wrapper = _.dom.$body || _.dom.$root
		$wrapper.on('click', SELECTOR, function (ev) {
			ev.preventDefault()
			var $msgBox = $(this).closest('.' + CLS_MSG_BOX)
			$msgBox.remove()
		})
	}

	//exports
	module._init = _init

	//init
	CMUI._initModule(moduleName)

}(window, CMUI)
