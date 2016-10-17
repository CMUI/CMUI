
////////////////////  form  ////////////////////
void function (window, CMUI) {
	'use strict'

	//namespace
	var moduleName = 'form'
	var module = CMUI[moduleName] = CMUI[moduleName] || {}

	//const
	var CLS_FORM = 'cm-form'
	var CLS_PLACEHOLDER = 'cm-form-placeholder'
	var SEL_SELECT = '.' + CLS_FORM + ' ' + 'select'

	//util
	function _iniSelectPlaceholder() {
		var $wrapper = gearbox.dom.$body || gearbox.dom.$root
		$wrapper.on('change', SEL_SELECT, function () {
			var $elem = $(this)
			_updateSelect($elem)
		})
		_updateSelect()
	}

	function _updateSelect(elem) {
		var $elem = elem ? $(elem) : $(SEL_SELECT)
		if (!$elem.length) return false
		var select = $elem[0]
		var option = select.options[select.selectedIndex]
		var $option = $(option)
		if ($option.hasClass(CLS_PLACEHOLDER)) {
			$elem.addClass(CLS_PLACEHOLDER)
		} else {
			$elem.removeClass(CLS_PLACEHOLDER)
		}
	}

	//api
	function _init() {
		_iniSelectPlaceholder()
		_updateSelect()
	}

	//exports
	module._init = _init

	//init
	CMUI._initModule(moduleName)

}(window, CMUI)
