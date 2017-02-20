////////////////////  dialog  ////////////////////
/**
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
		'<div class="cm-dialog">',
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
								'data-cm-dialog-btn-hide-dialog="<%= 1 %>"',
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
								'data-cm-dialog-btn-hide-dialog="<%= 1 %>"',
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
	var _isWindowResizeReady = false
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
		_prepareWindowResize()
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
	function _prepareWindowResize() {
		if (_isWindowResizeReady) return
		_isWindowResizeReady = true
		gearbox.dom.$win.on('resize', function () {
			// console.log('resize')
			if (!_stack.length) return
			var dialog = _.last(_stack)
			dialog.adjust()
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

			// to get its actual size, show it at first
			$elem.css({
				visibility: 'hidden',
				left: '-101%',
				top: 0,
			}).show()
			this._pos()
			$elem.css({ visibility: 'visible' })

			if (!_stack.length) CMUI.mask.fadeIn()
			_stack.push(this)
		},
		hide: function () {
			this.$elem.hide()
			this.destroy()
			if (_stack.length === 1) CMUI.mask.fadeOut()
			_stack.pop()

			// restore previous dialog
			if (_stack.length) {
				var dialogLast = _.last(_stack)
				dialogLast.$elem.show()
			}
		},
		destroy: function () {
			this._destroyAutoHide()
			delete this.$elem
			delete this.elem
		},
		_pos: function (onlyX) {
			var $elem = this.$elem
			var elem = $elem[0]

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
		adjust: function () {
			this._pos(true)
		},
	})

	//exports
	module.show = show
	module.hide = hide
	module.create = create

	module._stack = _stack

	//init
	CMUI._initModule(moduleName)

}(window, CMUI)
