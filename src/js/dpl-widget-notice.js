/*global _, $ */
/*jshint bitwise:true, eqeqeq:true, forin:true, immed:true, latedef:true, newcap:true, undef:true,
	trailing:true, smarttabs:true, sub:true, browser:true, devel:true, maxlen:150 */
////////////////////  fn  ////////////////////
var DPL = DPL || {};

//siteNotice
DPL.siteNotice = {
	isReady: false,
	isShown: false,
	selWrapper: 'body',
	_ini: function () {
		if (!this.isReady) {
			this._buildFrame();
			this.isReady = true;
		}
	},
	_buildFrame: function () {
		var _ns = this;
		var html = [
			'<div class="cmSiteNoticeWrapper">',
				'<div class="cmSiteNotice">',
					'<div class="act"><a href="#" class="cmAction"><i class="cmIcon cmX20 close">X</i></a></div>',
					'<div class="icon"><i class="cmIcon cmX20"><b></b><b></b><b></b></i></div>',
					'<div class="content"></div>',
				'</div>',
			'</div>'
		].join('\n');
		this.j = $(html).hide();
		this.jBtnClose = this.j.find('.act a').hide();
		this.jContent = this.j.find('div.content');
		this.jIcon = this.j.find('.icon .cmIcon');
		this.jBtnClose.on('click', function () {
			_ns.hide();
		});
	},
	show: function (o) {  //{html: '<.../>', actionClose: '#xxx', showCloseBtn: b, id: '', type: ''}
		if (!this.isShown && _.isObject(o) && _.isString(o.html)) {
			this._ini();
			this.jContent.html(o.html);
			//apply options - actionClose
			if (_.isString(o.actionClose)) {
				if (!_.str.isHash(o.actionClose)) {o.actionClose = '#' + o.actionClose; }
				this.jBtnClose.attr('href', o.actionClose);
			}
			//apply options - hideCloseBtn
			if (!o.hideCloseBtn) {
				this.jBtnClose.show();
			}
			//apply options - id
			if (o.id && _.isString(o.id)) {
				this.j.attr('id', _.str.stripHash(o.id));
			}
			//apply options - type
			if (o.type && _.isString(o.type)) {
				this.j.addClass(o.type);
				this.jIcon.addClass(o.type);
			} else {
				this.jIcon.addClass('info');
			}
			//wrapper
			var jWrapper = $(o.wrapper || this.selWrapper).first();
			this.j.prependTo(jWrapper);
			//show
			this.j.show();
			this.isShown = true;
		} else {
			return false;
		}
	},
	hide: function () {
		if (this.isShown) {
			this.j.hide();
			this.isShown = false;
		} else {
			return false;
		}
	}
};

//list with action
DPL.actionList = {
	ini: function () {
		this.j = [];
		this.currentItem = null;
		this.isWaiting = false;  //flag to indicate if action is running
		this._iniAutoHide();
		this._bind();
	},
	_iniAutoHide: function () {
		var _ns = this;
		_.dom.jDoc.on(/** _.event.tapEventName **/ 'click tap', function (e) {
			var isClickOutside;
			var target = e.target;
			if (target === document.documentElement || target === document.body) {
				isClickOutside = true;
			} else {
				var jTarget = _.$(target);
				isClickOutside = !jTarget.closest('.cmList[data-action-list]').length;
			}
			if (isClickOutside && !_ns.isWaiting) _ns.hide();
		});
	},
	hide: function () {
		var jActionList = this.j;
		if (!jActionList.length) return false;
		this._fadeOut();
		jActionList.parent('li').removeClass('current');
		this.currentItem = null;
		this.isWaiting = false;
	},
	bind: function (list, actionList) {
		if (!list || !actionList) return false;
		var eList = _.$(list)[0];
		var jActionList = _.$(actionList).first();
		if (eList && jActionList.length) {
			eList.jActionList = jActionList;
		} else {
			return false;
		}
	},
	_bind: function () {
		var _ns = this;
		_.event.onTap('.cmList[data-action-list] > li', function (e) {
			if (_ns.isWaiting) return false;
			var sClass = 'current';
			var jListItem = _.$(this);
			var jTarget = _.$(e.target);
			var jList = jListItem.parent('.cmList');
			var eList = jList[0];
			var jPrevActionList = _ns.j;
			var jActionList = eList.jActionList = eList.jActionList || $(jList.data('action-list')).first();
			//get case
			var isToShowAnotherActionList = jPrevActionList[0] !== jActionList[0];
			var isListContentClicked = jTarget.closest('.cmList > li > a:first-child').length;
			var isDetailBtnClicked = jTarget.is('.cmList > li > a:nth-child(2)');
			var isActionListClicked = jTarget.closest('.cmActionList').length;
			//handle event
			if (isListContentClicked) e.preventDefault();
			if (isActionListClicked) {
				//do nothing
			} else if (jListItem.hasClass(sClass)) {  //item is on
				jListItem.removeClass(sClass);
				_ns.currentItem = null;
				_ns._fadeOut();
			} else {  //item is off
				if (!jPrevActionList[0]) {  //first time to show a action list
					_ns.j = jActionList;
				} else {
					jPrevActionList.parent('li').removeClass(sClass);
					_ns.currentItem = null;
					if (isToShowAnotherActionList) {
						_ns._fadeOut();
						_ns.j = jActionList;
					} else {
						_ns._hide();
					}
				}
				if (!isDetailBtnClicked) {
					jActionList.appendTo(jListItem);
					jListItem.addClass(sClass).trigger('showActionList');
					_ns.currentItem = jListItem[0];
					_.delay(function () {  //seems anim won't happen after immediate dom changing
						_ns._fadeIn();
					}, 20);
				}
			}
		});
	},
	_getBasicClass: function () {
		var jActionList = this.j;
		var basicClass = jActionList.data('basic-class');
		if (!basicClass) {
			basicClass = _.str.clean(jActionList.attr('class').replace('hidden', ''));
			jActionList.data('basic-class', basicClass);
		}
		return basicClass;
	},
	_hide: function () {
		this.j.attr('class', this._getBasicClass() + ' hidden');
	},
	_show: function () {
		this._resetStatus();
		this.j.attr('class', this._getBasicClass());
	},
	_fadeIn: function () {
		this._resetStatus();
		this.j.attr('class', this._getBasicClass() + ' fade-in');
	},
	_fadeOut: function () {
		this.j.attr('class', this._getBasicClass() + ' fade-out');
	},
	switchStatus: function (s) {
		var jActionList = this.j;
		if (!jActionList.length || !s) return false;
		if (_.str.toNumber(s)) {
			jActionList.find('.cmTipBoxInner').hide().filter('[data-status="' + s + '"]').show();
		} else {
			jActionList.find('.cmTipBoxInner').hide().filter('.' + s).show();
		}
		this.isWaiting = true;
	},
	_resetStatus: function () {
		var jActionList = this.j;
		jActionList.find('.cmTipBoxInner').hide().first().show();
		jActionList.trigger('reset');  //hook to invoke custom reset action
	},
	getCurrentItem: function () {
		return this.currentItem;
	}
};
