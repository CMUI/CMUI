////////////////////  scroll box  ////////////////////

void function (window, CMUI) {
	'use strict'

	// namespace
	var moduleName = 'scrollBox'
	var module = CMUI[moduleName] = CMUI[moduleName] || {}

	// const
	var CLS = 'cm-scroll-box'

	// Inspired by [ScrollFix](https://github.com/joelambert/ScrollFix)
	function _initWrapper($wrapper) {
		if (!$wrapper.length) return

		// Handle the start of interactions
		$wrapper.on('touchstart', function () {
			var elem = this
			var startTopScroll = elem.scrollTop

			if (startTopScroll <= 0) {
				elem.scrollTop = 1
			} else if (startTopScroll + elem.offsetHeight >= elem.scrollHeight) {
				elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1
			}
		})

		// auto align to boundary if edge offset less than 2px.
		$wrapper.on('click', function () {
			var elem = this
			var startTopScroll = elem.scrollTop

			if (startTopScroll && startTopScroll < 3) {
				elem.scrollTop = 0
			} else if (startTopScroll + elem.offsetHeight > elem.scrollHeight - 3) {
				elem.scrollTop = elem.scrollHeight - elem.offsetHeight
			}
		})

		// disable touchmove event when content is too short, restore when content is long enough
		$wrapper.on('touchstart', function () {
			var elem = this
			if (elem.offsetHeight >= elem.scrollHeight) {
				this.addEventListener('touchmove', disableEvent, false)
			} else {
				this.removeEventListener('touchmove', disableEvent, false)
			}

			function disableEvent(ev) {
				ev.preventDefault()
			}
		})

		// use this property to mark handled wrapper
		$wrapper[0].scrollBoxReady = true
	}

	function refresh() {
		var $wrappers = $('.' + CLS)
		$wrappers.each(function () {
			if (!this.scrollBoxReady) {
				var $wrapper = $(this)
				_initWrapper($wrapper)
			}
		})
	}

	function _init() {
		refresh()
	}

	//exports
	module._init = _init
	module.refresh = refresh

	//init
	CMUI._initModule(moduleName)

}(window, CMUI)
