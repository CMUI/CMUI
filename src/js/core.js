
////////////////////  core  ////////////////////

//namespace
/** DEBUG_INFO_START **/
if (window.CMUI) console.warn('CMUI: The namespace CMUI already exist.')
/** DEBUG_INFO_END **/
var CMUI = window.CMUI = window.CMUI || {}

void function (window, CMUI) {
	'use strict'

	var _config = {
		modulesToInit: []
	}
	var VERSION = ''

	//api
	function init() {
		_.each(_config.modulesToInit, function (moduleName) {
			var module = CMUI[moduleName]
			if (module && _.isFunction(module._init)) module._init()
		})
	}
	function _initModule(moduleName) {
		if (moduleName) _config.modulesToInit.push(moduleName)
	}

	//exports
	//CMUI.config = config
	CMUI.VERSION = VERSION
	CMUI.init = init
	CMUI._initModule = _initModule

}(window, CMUI)
