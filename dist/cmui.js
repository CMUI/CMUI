/*! CMUI | MIT License | http://cmui.net */

void function (window, undefined) {
	'use strict'

;

////////////////////  var  ////////////////////
var _ = window._
var $ = window.Zepto || window.jQuery || window.$
var gearbox = window.gearbox
var document = window.document

//check dependency
if (!_ || !$ || !gearbox) return false

;

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

;

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
				(ua.isIOS && version < 7) ||	//below ios 7
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

;

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
		var $wrapper = gearbox.dom.$body || gearbox.dom.$root
		$wrapper.on('click', function (ev) {
			var $target = gearbox.$(ev.target)
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

;

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

;

////////////////////  msg box  ////////////////////
void function (window, CMUI) {
	'use strict'

	//namespace
	var moduleName = 'msg-box'
	var module = CMUI[moduleName] = CMUI[moduleName] || {}

	var CLS_MSG_BOX = 'cm-msg-box'
	var CLS_CLOSE_BTN = 'cm-msg-box-close-btn'
	var SELECTOR = '.' + CLS_MSG_BOX + ' ' + '.' + CLS_CLOSE_BTN

	function _init() {
		var $wrapper = gearbox.dom.$body || gearbox.dom.$root
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

;

////////////////////  overlay - mask  ////////////////////
void function (window, CMUI) {
	'use strict'

	CMUI.mask = {
		//class name
		CLS: 'cm-mask',
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
				this.$elem = $('<div class="cm-mask hidden"></div>').appendTo(gearbox.dom.$body)
				gearbox.dom.$win.on('resize', function () {
					if (_ns.isVisible) _ns._pos()
				})
				this.isReady = true
			}
		},
		_pos: function () {
			// first, shrink
			this.$elem.css('height', '100%')
			// then, reset its height.
			this.$elem.css({
				height: document.documentElement.scrollHeight + 'px'
			})
		},

		//api
		get$Element: function () {
			this._prepare()
			return this.$elem
		},
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

;

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



;
////////////////////  dialog  ////////////////////
/**
 * Demo: http://cmui.net/demo/v2/theme/baixing/dialog.php
 * API Doc: CMUI/doc#3
 */

void function (window, CMUI) {
	'use strict'

	// namespace
	var moduleName = 'dialog'
	var module = CMUI[moduleName] = CMUI[moduleName] || {}

	// const
	var CLS = 'cm-dialog'
	var TMPL = [
		'<div class="cm-dialog"',
			'<% if (data.id) { %>',
			'id="<%= data.id %>"',
			'<% } %>',
		'>',
			'<% if (data.img) { %>',
			'<div class="cm-dialog-img">',
				'<img src="<%= data.img %>">',
			'</div>',
			'<% } %>',
			'<% if (!data.img || data.title) { %>',
			'<header class="cm-dialog-header">',
				'<h2 class="cm-dialog-header-title"><%- data.title || \'提示\' %></h2>',
			'</header>',
			'<% } %>',
			'<% if (data.content) { %>',
			'<main class="cm-dialog-content"><%- data.content %></main>',
			'<% } %>',
			'<% if (_.isObject(data.btn)) { %>',
			'<%',
				'var btn = data.btn',
				'var primary = btn.primary',
				'var minor = btn.minor',
			'%>',
			'<footer class="cm-dialog-footer">',
				'<% if (_.isObject(primary)) { %>',
					'<%',
						'var btnLabel = primary.html || \'确定\'',
						'var btnClass = _.isArray(primary.className) ?',
							'primary.className.join(\' \') :',
							'(_.isString(primary.className) ?',
								'primary.className :',
								'\'cm-btn cm-btn-primary\')',
					'%>',
					'<% if (!primary.tag || primary.tag === \'button\') { %>',
						'<button',
							'class="<%= btnClass %>"',
							'<% if (primary.action) { %>',
								'data-action="<%= primary.action %>"',
							'<% } %>',
							'<% if (primary.hideDialog) { %>',
								'data-cm-dialog-btn-hide-dialog="<%= 1 %>"',
							'<% } %>',
						'><%- btnLabel %></button>',
					'<% } else if (primary.tag === \'a\') { %>',
						'<a',
							'class="<%= btnClass %>"',
							'href="<%= primary.link || \'#\' %>"',
							'<% if (primary.action) { %>',
								'data-action="<%= primary.action %>"',
							'<% } %>',
							'<% if (primary.hideDialog) { %>',
								'data-cm-dialog-btn-hide-dialog="<%= 1 %>"',
							'<% } %>',
						'><%- btnLabel %></a>',
					'<% } else if (primary.tag === \'input\') { %>',
						'<input',
							'class="<%= btnClass %>"',
							'<% if (primary.action) { %>',
								'data-action="<%= primary.action %>"',
							'<% } %>',
							'<% if (primary.hideDialog) { %>',
								'data-cm-dialog-btn-hide-dialog="<%= 1 %>"',
							'<% } %>',
							'value="<%= btnLabel %>"',
						'>',
					'<% } %>',
				'<% } %>',
				'<% if (_.isObject(minor)) { %>',
					'<%',
						'var btnLabel = minor.html || \'取消\'',
						'var btnClass = _.isArray(minor.className) ?',
							'minor.className.join(\' \') :',
							'(_.isString(minor.className) ?',
								'minor.className :',
								'\'cm-btn cm-btn-primary cm-btn-bordered\'',
							')',
					'%>',
					'<% if (!minor.tag || minor.tag === \'button\') { %>',
						'<button',
							'class="<%= btnClass %> cm-btn-minor"',
							'<% if (minor.action) { %>',
								'data-action="<%= minor.action %>"',
							'<% } %>',
							'<% if (minor.hideDialog) { %>',
								'data-cm-dialog-btn-hide-dialog',
							'<% } %>',
						'><%- btnLabel %></button>',
					'<% } else if (minor.tag === \'a\') { %>',
						'<a',
							'class="<%= btnClass %> cm-btn-minor"',
							'href="<%= minor.link || \'#\' %>"',
							'<% if (minor.action) { %>',
								'data-action="<%= minor.action %>"',
							'<% } %>',
							'<% if (minor.hideDialog) { %>',
								'data-cm-dialog-btn-hide-dialog="<%= 1 %>"',
							'<% } %>',
						'><%- btnLabel %></a>',
					'<% } else if (minor.tag === \'input\') { %>',
						'<input',
							'class="<%= btnClass %> cm-btn-minor"',
							'<% if (minor.action) { %>',
								'data-action="<%= minor.action %>"',
							'<% } %>',
							'<% if (minor.hideDialog) { %>',
								'data-cm-dialog-btn-hide-dialog',
							'<% } %>',
							'value="<%= btnLabel %>"',
						'>',
					'<% } %>',
				'<% } %>',
			'</footer>',
			'<% } %>',
		'</div>'
	].join('\n')

	var _stack = []
	var _isEventReady = false
	var _isTemplateReady = false

	var _root = document.documentElement
	var _body = document.body

	// action
	gearbox.action.add({
		'cm-dialog-hide': function () {
			var $this = $(this)
			// means current action is triggered by user click, not by js
			if (this !== window) {
				var $dialog = $this.closest('.' + CLS)
				if (_.last(_stack).elem === $dialog[0]) {
					CMUI.dialog.hide()
				} else {
					return false
				}
			} else {
				CMUI.dialog.hide()
			}
		},
	})

	// api
	function show(elem, options) {
		_prepareEvent()
		var $elem = $(elem).first()	// only allow to show one dialog
		if (!$elem.hasClass(CLS)) return false
		var dialog = new Dialog($elem, options)
		dialog.show()
	}
	function hide() {
		if (!_stack.length) return false
		var dialog = _.last(_stack)
		dialog.hide()
	}
	function create(config) {
		_prepareTemplate()
		if (!_.isObject(config)) config = {}
		var html = gearbox.template.render('cm-dialog', config)
		var $dialog = $(html).appendTo(gearbox.dom.$body)
		return $dialog[0]
	}

	// util
	function _prepareEvent() {
		if (_isEventReady) return
		_isEventReady = true
		gearbox.dom.$win.on('resize', function () {
			// console.log('resize')
			if (!_stack.length) return
			var dialog = _.last(_stack)
			dialog.adjust()
		})
		gearbox.dom.$body.on('click', '[data-cm-dialog-btn-hide-dialog]', function () {
			gearbox.action.trigger('cm-dialog-hide', this)
		})
	}
	function _prepareTemplate() {
		if (_isTemplateReady) return
		_isTemplateReady = true
		gearbox.template.add('cm-dialog', TMPL)
	}

	// class
	function Dialog($elem, options) {
		this.$elem = $elem
		this.elem = $elem[0]
		this._init(options)
	}
	_.extend(Dialog.prototype, {
		_init: function (options) {
			var $elem = this.$elem
			// move to root of body
			if (!$elem.parent().is('body')) $elem.appendTo(gearbox.dom.$body)

			// handle options
			if (!_.isObject(options)) options = {}
			var autoHideDelay = gearbox.str.toFloat(options.autoHideDelay)
			if (autoHideDelay > 0) {
				// convert ms to a integer in seconds
				this.autoHideDelay = Math.ceil(autoHideDelay / 1000)
			}
		},
		_prepareAutoHide: function () {
			var $elem = this.$elem
			// structure
			var html = [
				'<div class="cm-dialog-auto-hide">',
					'<span class="cm-dialog-auto-hide-countdown">',
						this.autoHideDelay,
					'</span>',
					' 秒后自动关闭……',
				'</div>',
			].join('')
			this.$autoHide = $(html)
			this.$autoHideCountdown = this.$autoHide.find('.cm-dialog-auto-hide-countdown')
			$elem.append(this.$autoHide)

			// timer
			var _this = this
			this.autoHideRemain = this.autoHideDelay
			this.timer = setInterval(function () {
				_this.autoHideRemain--
				if (_this.autoHideRemain > 0) {
					_this.$autoHideCountdown.html(_this.autoHideRemain)
				} else {
					// if it is visible, hide it
					if (_this === _.last(_stack)) _this.hide()
					_this._destroyAutoHide()
				}
			}, 1000)
		},
		_destroyAutoHide: function () {
			if (this.timer) clearInterval(this.timer)
			if (this.$autoHide) this.$autoHide.remove()
			delete this.$autoHide
			delete this.$autoHideCountdown
			delete this.autoHideDelay
			delete this.autoHideRemain
			delete this.timer
		},
		_prepareCloseBtn: function () {
			var $elem = this.$elem
			if ($elem.find('.cm-dialog-close-btn[data-action]').length) return
			var html = '<a class="cm-dialog-close-btn" href="#" data-action="cm-dialog-hide"></a>'
			this.$elem.prepend(html)
		},
		_pos: function (onlyX) {
			var $elem = this.$elem
			var elem = $elem[0]

			// if its not current dialog, show it to get its actual size
			if ($elem.css('display') === 'none') {
				$elem.css({
					visibility: 'hidden',
					left: '-101%',
					top: 0,
				}).show()
			}

			var l = Math.round((_root.clientWidth - elem.offsetWidth) / 2)
			var t
			if (!onlyX) {
				// on ios, `doc.clientHeight` never change even when scrolling causes addr bar hidden,
				// so use `window.innerHeight` instead.
				var absT = Math.round((window.innerHeight * 0.95 - elem.offsetHeight) / 2)
				absT = absT < 5 ? 5 : absT
				t = absT + (_root.scrollTop || _body.scrollTop)
				// console.log('absT: ' + absT)
				// console.log('scrollTop: ' + (_root.scrollTop || _body.scrollTop))
				// console.log('t: ' + t)
			}

			var css = {left: l + 'px'}
			if (!onlyX) css.top = t + 'px'

			$elem.css(css)
		},
		show: function () {
			var $elem = this.$elem
			this._prepareCloseBtn()
			if (this.autoHideDelay) {
				this._prepareAutoHide()
			}

			// hide last dialog
			if (_stack.length) {
				var dialogLast = _.last(_stack)
				dialogLast.$elem.hide()
			}

			this._pos()
			$elem.css({ visibility: 'visible' }).show()

			if (!_stack.length) CMUI.mask.fadeIn()
			_stack.push(this)
		},
		hide: function () {
			_stack.pop()
			this.$elem.hide()
			this.destroy()

			// restore previous dialog
			if (_stack.length) {
				var dialogLast = _.last(_stack)
				dialogLast._pos()
				dialogLast.$elem.css({ visibility: 'visible' }).show()
			} else {
				CMUI.mask.fadeOut()
			}
		},
		destroy: function () {
			this._destroyAutoHide()
			delete this.$elem
			delete this.elem
		},
		adjust: function () {
			this._pos(true)
		},
	})

	// exports
	module.show = show
	module.hide = hide
	module.create = create

	module._stack = _stack

	// init
	CMUI._initModule(moduleName)

}(window, CMUI)

;

////////////////////  panel  ////////////////////
void function (window, CMUI) {
	'use strict'

	// namespace
	var moduleName = 'panel'
	var module = CMUI[moduleName] = CMUI[moduleName] || {}

	// const
	var CLS = 'cm-panel'

	var _stack = []
	/*
	var actions = {
		'cm-panel-show': function () {
			var elem = this
			var options = _getOptionsFromAttr(elem)
			if (!options.target) return false
			CMUI.panel.show(options.target, options)
		},
		'cm-panel-hide': function () {
			var elem = this
			var options = _getOptionsFromAttr(elem)
			CMUI.panel.hide(options)
		},
		'cm-panel-switch-to': function () {
			var elem = this
			var options = _getOptionsFromAttr(elem)
			if (!options.target) return false
			CMUI.panel.switchTo(options.target, options)
		},
		'cm-panel-switch-back': function () {
			var elem = this
			var options = _getOptionsFromAttr(elem)
			CMUI.panel.switchBack(options)
		},
	}

	// util
	function _getOptionsFromAttr(elem) {
		var $elem = $(elem)
		var target = $elem.data('target') || elem.hash || ''
		var height = $elem.data('height')
		var duration = $elem.data('duration')
		return {
			target: target,
			height: height,
			duration: duration,
		}
	}

	function _init() {
		gearbox.action.add(actions)
	}
	*/

	// api
	function show(elem, options) {
		// options
		// - height: '123px' or '45%' (default '200px')
		// - duration: 345 (ms) (default 200)
		// - callback: fn
		var $elem = $(elem).first()	// only allow to show one panel
		if (!$elem.hasClass(CLS)) return false
		// TODO: what if show a panel when another panel already shown?

		// move to root of body
		// it is unnecessary, because of fixed position.
		// if (!$elem.parent().is('body')) $elem.appendTo(gearbox.dom.$body)

		if (!_.isObject(options)) options = {}
		var duration = options.duration || 200
		var height = options.height || '200px'
		var callback = options.callback
		if (_.isNumber(height)) height += 'px'
		var transform = 'translateY(101%)'
		$elem.css({
			'display': 'block',
			'transform': transform,
			'-webkit-transform': transform,
			'height': height,
		})
		$elem.animate({
			'translateY': '0%',
		}, duration, 'ease-out', callback)

		_stack.push($elem)
		CMUI.mask.fadeIn()
	}
	function hide(options) {
		if (!_stack.length) return false
		// options
		// - duration: 345 (ms) (default 200)
		// - callback: fn
		if (!_.isObject(options)) options = {}
		var duration = options.duration || 200
		var callback = options.callback

		var $elem = _.last(_stack)
		$elem.animate({
			'translateY': '101%',
		}, duration, 'ease-out', function () {
			$elem.css('display', 'none')
			if (_.isFunction(callback)) callback()
		})

		_stack.length = 0
		CMUI.mask.fadeOut()
	}

	function switchTo(elem, options) {
		// options
		// - callback: fn
		var $elem = $(elem).first()	// only allow to show one panel
		if (!_stack.length) return false
		if (!$elem.hasClass(CLS)) return false
		if (!_.isObject(options)) options = {}

		var $lastElem = _.last(_stack)

		var height = $lastElem.css('height')
		// var duration = options.duration || 200
		var callback = options.callback

		$lastElem.css({
			'display': 'none',
		})
		var transform = 'translateX(0%)'
		$elem.css({
			'display': 'block',
			'transform': transform,
			'-webkit-transform': transform,
			'height': height,
		})
		if (_.isFunction(callback)) callback()

		_stack.push($elem)
	}
	function switchBack(options) {
		if (_stack.length < 2) return false
		if (!_.isObject(options)) options = {}

		var $lastElem = _stack[_stack.length - 2]
		var $elem = _.last(_stack)

		var height = $lastElem.css('height')
		// var duration = options.duration || 200
		var callback = options.callback

		$elem.css({
			'display': 'none',
		})

		var transform = 'translateX(0%)'
		$lastElem.css({
			'display': 'block',
			'transform': transform,
			'-webkit-transform': transform,
			'height': height,
		})
		if (_.isFunction(callback)) callback()

		_stack.pop()
	}

	// exports
	// module._init = _init
	module.show = show
	module.hide = hide
	module.switchTo = switchTo
	module.switchBack = switchBack

	// init
	CMUI._initModule(moduleName)

}(window, CMUI)

;
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

;

}(this)

//init
CMUI.init();
