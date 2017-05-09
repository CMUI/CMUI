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
		'<<%= data.tag %> class="cm-dialog"',
			'<% if (data.id) { %>',
				'id="<%= data.id %>"',
			'<% } %>',
		'>',
			'<% if (data.img) { %>',
				'<div class="cm-dialog-img">',
					'<% if (data.img.useBg) { %>',
						'<div class="cm-dialog-img-content" style="<%= data.img.cssText %>"></div>',
					'<% } else { %>',
						'<img src="<%= data.img.url %>"',
							'<% if (data.img.width) { %>',
								'style="width: <%= data.img.width %>px;"',
							'<% } %>',
						'>',
					'<% } %>',
				'</div>',
			'<% } %>',
			'<% if (data.title) { %>',
				'<header class="cm-dialog-header">',
					'<h2 class="cm-dialog-header-title"><%- data.title %></h2>',
				'</header>',
			'<% } %>',
			'<% if (data.content) { %>',
				'<main class="cm-dialog-content"><%- data.content %></main>',
			'<% } %>',
			'<% if (_.isArray(data.btn) && data.btn.length) { %>',
				'<footer class="cm-dialog-footer">',
					'<% _.each(data.btn, function (btn) { %>',
						'<<%= btn.tag %>',
							'class="<%= btn.className %>"',
							'<% if (btn.link) { %>',
								'href="<%= btn.link %>"',
							'<% } %>',
							'<% if (btn.action) { %>',
								'data-action="<%= btn.action %>"',
							'<% } %>',
							'<% if (btn.hideDialog) { %>',
								'data-cm-dialog-btn-hide-dialog="<%= 1 %>"',
							'<% } %>',
						'><%- btn.innerHTML %></<%= btn.tag %>>',
					'<% }) %>',
				'</footer>',
			'<% } %>',
		'</<%= data.tag %>>',
	].join('\n')

	var _stack = []

	// shortcuts
	var _root = document.documentElement
	var _body = document.body

	// action
	var actions = {
		'cm-dialog-hide': function () {
			// means current action is triggered by user click, not by js
			if (this !== window) {
				var $dialog = $(this).closest('.' + CLS)
				if (_.last(_stack).elem === $dialog[0]) {
					CMUI.dialog.hide()
				} else {
					return false
				}
			} else {
				CMUI.dialog.hide()
			}
		},
	}

	// api
	function show(elem, options) {
		_prepareEvent()
		var $elem = $(elem).first()	// only allow to show one dialog
		if (!$elem.hasClass(CLS)) return false
		// do nothing if this dialog is already shown
		if (_.last(_stack) && _.last(_stack).elem === $elem[0]) return false
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
		var templateData = _formatConfig(config)
		var html = gearbox.template.render('cm-dialog', templateData)
		var $dialog = $(html).appendTo(gearbox.dom.$body)
		return $dialog[0]
	}

	// util
	function _formatConfig(config) {
		if (!_.isObject(config)) config = {}
		// tag
		config.tag = gearbox.str.trim(config.tag).toLowerCase() || 'div'

		// id
		config.id = gearbox.str.stripHash(config.id)

		// img
		var img = config.img
		var imgStyleRules = []
		if (_.isString(img) && img) {
			config.img = { url: img }
		} else if (_.isObject(img) && img.url) {
			img.width = gearbox.str.toFloat(img.width)	// 123 or '123px'
			img.height = gearbox.str.toFloat(img.height)	// 123 or '123px'
			// if height given, use bg img to achieve lazy loading
			if (img.height) {
				img.useBg = true
				if (img.width) imgStyleRules.push('width: ' + img.width + 'px')
				imgStyleRules.push('height: ' + img.height + 'px')
				imgStyleRules.push('background-image: url(' + img.url + ')')
				img.cssText = imgStyleRules.join('; ')
			}
		} else {
			config.img = null
		}

		// title
		// if no img and no title given, use default title
		if (!img) {
			config.title = config.title || '提示'
		}

		// btn
		var buttons = []
		function _formatClassName(cls) {
			if (_.isString(cls)) {
				return cls
			} else if (_.isArray(cls)) {
				return cls.join(' ')
			}
			return ''
		}
		function _formatBtn(btn, defaultInnerHTML, defaultCls) {
			if (!_.isObject(btn)) return
			btn.tag = gearbox.str.trim(btn.tag).toLowerCase()
			if (btn.tag !== 'a') btn.tag = 'button'
			btn.innerHTML = btn.innerHTML || defaultInnerHTML
			btn.link = (btn.tag === 'button') ? '' : (btn.link || '#')
			btn.className = _formatClassName(btn.className) || defaultCls
			// output
			buttons.push(btn)
		}
		if (_.isObject(config.btn)) {
			_formatBtn(config.btn.primary, '确定', 'cm-btn cm-btn-primary')
			_formatBtn(config.btn.minor, '取消', 'cm-btn cm-btn-primary cm-btn-bordered')
		}
		config.btn = buttons

		return config
	}

	var _prepareEvent = _.once(function () {
		gearbox.dom.$win.on('resize', function () {
			// console.log('resize')
			if (!_stack.length) return
			var dialog = _.last(_stack)
			dialog.adjust()
		})

		gearbox.action.add(actions)
		gearbox.dom.$body.on('click', '[data-cm-dialog-btn-hide-dialog]', function () {
			gearbox.action.trigger('cm-dialog-hide', this)
		})
	})

	var _prepareTemplate = _.once(function () {
		gearbox.template.add('cm-dialog', TMPL)
	})

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
