
////////////////////  overlay - mask  ////////////////////
void function (window, CMUI) {
	'use strict'

	CMUI.mask = {
		//class name
		CLS: 'cmMask',
		CLS_HIDDEN: 'hidden',
		CLS_FADE_IN: 'fade-in',
		CLS_FADE_OUT: 'fade-out',

		//flag
		isReady: false,
		isVisible: false,

		//util
		_prepare: function () {
			var _ns = this
			if (!this.isReady) {
				this.$elem = $('<div class="cmMask hidden"></div>').appendTo(_.dom.$body)
				_.dom.$win.on('resize', function () {
					if (_ns.isVisible) _ns._pos()
				})
				this.isReady = true
			}
		},
		_pos: function () {
			this.$elem.css({
				height: document.documentElement.scrollHeight + 'px'
			})
		},

		//api
		adjust: function () {
			this._pos()
		},
		show: function () {
			if (this.isVisible) return false
			this._prepare()
			this._pos()
			var classNames = [this.CLS]
			this.$elem.attr('class', classNames.join(' '))
			this.isVisible = true
		},
		fadeIn: function () {
			if (this.isVisible) return false
			this._prepare()
			this._pos()
			var classNames = [this.CLS, this.CLS_FADE_IN]
			this.$elem.attr('class', classNames.join(' '))
			this.isVisible = true
		},
		hide: function () {
			if (!this.isVisible) return false
			var classNames = [this.CLS, this.CLS_HIDDEN]
			this.$elem.attr('class', classNames.join(' '))
			this.isVisible = false
		},
		fadeOut: function () {
			if (!this.isVisible) return false
			var classNames = [this.CLS, this.CLS_FADE_OUT]
			this.$elem.attr('class', classNames.join(' '))
			this.isVisible = false
		}
	}

}(window, CMUI)
