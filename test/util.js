void function () {
	'use strict'

	// util
	function isDialogShown(dialog) {
		return $(dialog).css('display') !== 'none'
	}
	function isMaskShown() {
		const $mask = CMUI.mask.get$Element()
		return !($mask.hasClass('hidden') || $mask.hasClass('fade-out'))
	}

	// exports
	assert._util = {
		isDialogShown,
		isMaskShown,
	}

}()
