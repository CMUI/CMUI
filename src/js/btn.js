
////////////////////  btn  ////////////////////
void function (window, CMUI) {
	'use strict'

	//namespace
	var moduleName = 'btn'
	var module = CMUI[moduleName] = CMUI[moduleName] || {}

	//const
	var BTN_ELEM_TAGS = ['a', 'input', 'button']
	var CLS_BTN = 'cm-btn'
	var CLS_BTN_DISABLED = 'disabled'
	var CLS_BTN_WRAPPER = 'cm-btn-wrapper'
//	var CLS_BTN_SWITCH = 'cm-btn-switch'
//	var CLS_BTN_SWITCH_ITEM = 'cm-btn-item'

	//util
	/**
	 * if click on a btn wrapper, trigger `click` event on the btn inside of the wrapper
	 * @private
	 */
	function _iniBtnWrapper() {
		var $wrapper = _.dom.$body || _.dom.$root
		$wrapper.on('click', function (ev) {
			var $target = _.$(ev.target)
			if ($target.hasClass(CLS_BTN_WRAPPER) && !$target.hasClass(CLS_BTN_DISABLED)) {
				var $btnWrapper = $target
				var selBtn = ([].concat('.' + CLS_BTN, BTN_ELEM_TAGS)).join(', ')
				var $btn = $btnWrapper.find(selBtn).first()
				if (!$btn.hasClass(CLS_BTN_DISABLED)) {
					$btn.trigger('click')
				}
			}
		})
	}

	//api
	function _init() {
		_iniBtnWrapper()
	}
	//todo: use `disabled` property for form btn, when relevant style is ready
	//function disable(elem) {}
	//function enable(elem) {}

	//todo: btn switch fn

	//exports
	module._init = _init

	//init
	CMUI._initModule(moduleName)

}(window, CMUI)
