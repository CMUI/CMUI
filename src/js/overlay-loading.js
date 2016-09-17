
////////////////////  overlay - loading  ////////////////////
void function (window, CMUI) {
	'use strict'

	CMUI.loading = {
		//class name
		CLS: 'cm-loading',
		CLS_TEXT: 'cm-text',
		CLS_HIDDEN: 'hidden',
		CLS_FADE_IN: 'fade-in',
		CLS_FADE_OUT: 'fade-out',

		//flag
		isReady: false,
		isVisible: false,

		//element
		basicClassNames: [],
		html: [
			'<div class="cm-loading">',
				'<i class="cm-icon cm-icon-x50-loading-black-bg">Loading</i>',
			'</div>'
		].join(''),

		//util
		_prepare: function () {
			var _ns = this
			if (!this.isReady) {
				this.$elem = $(this.html).appendTo(gearbox.dom.$body)
				this.isReady = true
				var elem = this.$elem[0]
				this.offsetParent = document.documentElement
				gearbox.dom.$win.on('resize', function () {
					if (_ns.isVisible) _ns._pos()
				})
			}
		},
		_pos: function () {
			var elem = this.$elem[0]
			//to avoid `updateText()` expand this element out of viewport and
			//cause wrong `this.offsetParent.clientWidth`,
			//we have to move it into viewport
			this.$elem.css({'visibility': 'hidden', left: 0, top: 0})

			//body may be a page wrapper, and may have {position: relative}.
			var l = (this.offsetParent.clientWidth - elem.offsetWidth)/2
			//on ios, `doc.clientHeight` never change even when scrolling causes addr bar hidden.
			var t = (window.innerHeight * 0.95 - elem.offsetHeight)/2

			this.$elem.css({
				left: l + 'px',
				top: t + 'px'
			})
			this.$elem.css({'visibility': 'visible'})
		},
		_setText: function (str) {
			this._prepareText()
			//accept:
			//- any non-empty string
			//- any number (including `0`)
			//- any object which can be auto-converted to non-empty string
			if (str || _.isNumber(str)) {
				this.$elem.addClass(this.CLS_TEXT)
				this.basicClassNames = [this.CLS, this.CLS_TEXT]
				this.$text.html(str)
			} else {
				this.$elem.removeClass(this.CLS_TEXT)
				this.basicClassNames = [this.CLS]
			}
		},
		_prepareText: function () {
			if (!this.$text) {
				this.$text = $('<p></p>').appendTo(this.$elem)
			}
		},

		//api
		show: function (str) {
			if (this.isVisible) return false
			this._prepare()
			this._setText(str)
			this._pos()
			var classNames = this.basicClassNames
			this.$elem.attr('class', classNames.join(' '))
			this.isVisible = true
		},
		fadeIn: function (str) {
			if (this.isVisible) return false
			this._prepare()
			this._setText(str)
			this._pos()
			var classNames = _.union(this.basicClassNames, [this.CLS_FADE_IN])
			this.$elem.attr('class', classNames.join(' '))
			this.isVisible = true
		},
		hide: function () {
			if (!this.isVisible) return false
			var classNames = _.union(this.basicClassNames, [this.CLS_HIDDEN])
			this.$elem.attr('class', classNames.join(' '))
			this.isVisible = false
		},
		fadeOut: function () {
			if (!this.isVisible) return false
			var classNames = _.union(this.basicClassNames, [this.CLS_FADE_OUT])
			this.$elem.attr('class', classNames.join(' '))
			this.isVisible = false
		},

		//api - text
		updateText: function (str) {
			this._setText(str)
			this._pos()
		}
	}

}(window, CMUI)


