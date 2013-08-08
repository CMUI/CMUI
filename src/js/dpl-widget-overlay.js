/*global _, $ */
/*jshint bitwise:true, eqeqeq:true, forin:true, immed:true, latedef:true, newcap:true,
undef:true, trailing:true, smarttabs:true, sub:true, browser:true, devel:true, maxlen:150 */
////////////////////  fn  ////////////////////
var DPL = DPL || {};

//mask
DPL.mask = {
	isReady: false,
	isVisible: false,
	_prepare: function () {
		var _ns = this;
		if (!this.isReady) {
			this.j = $('<div class="cmMask hidden"></div>');
			this.j.appendTo(_.dom.jBody);
			_.task.on('resize', function () {
				if (_ns.isVisible) _ns._pos();
			});
			this.isReady = true;
		}
	},
	_pos: function () {
		this.j.css({
			height: _.dom.rootElem.scrollHeight + 'px'
		});
	},
	adjust: function () {
		this._pos();
	},
	show: function () {
		if (this.isVisible) return false;
		this._prepare();
		this._pos();
		this.j.attr('class', 'cmMask');
		this.isVisible = true;
	},
	fadeIn: function () {
		if (this.isVisible) return false;
		this._prepare();
		this._pos();
		this.j.attr('class', 'cmMask fade-in');
		this.isVisible = true;
	},
	hide: function () {
		if (!this.isVisible) return false;
		this.j.attr('class', 'cmMask hidden');
		this.isVisible = false;
	},
	fadeOut: function () {
		if (!this.isVisible) return false;
		this.j.attr('class', 'cmMask fade-out');
		this.isVisible = false;
	}
};

//loading
DPL.loading = {
	isReady: false,
	isVisible: false,
	origClass: 'cmLoading',
	textClass: 'cmLoading cmText',
	dbIcon: {
		'x40-black-bg': '<i class="cmIcon cmX40 loading-black-bg">Loading</i>',
		'x40-white-bg': '<i class="cmIcon cmX40 loading-white-bg">Loading</i>',
		'x50-black-bg': '<i class="cmIcon cmX50 loading-black-bg">Loading</i>',
		'x50-white-bg': '<i class="cmIcon cmX50 loading-white-bg">Loading</i>'
	},
	ini: function () {
		this._preload();
	},
	_preload: function () {  //todo: remove this, after `loading` icon vectorized by css3
		var html = [
			'<div class="cmPreloadContainer" hidden>',
				_.values(this.dbIcon).join(''),
			'</div>'
		].join('');
		_.task.on('load', function () {
			_.dom.jBody.append(html);
		});
	},
	_prepare: function () {
		var _ns = this;
		if (!this.isReady) {
			this.j = $('<div class="cmLoading">' + this.dbIcon['x50-black-bg'] + '</div>');
			this.j.appendTo(_.dom.jBody);
			this.isReady = true;
			var elem = this.j[0];
			if (_.ua.support.stylePositionFixed) {
				this.offsetParent = document.documentElement;
				this.j.css('position', 'fixed');
			} else {
				this.offsetParent = elem.offsetParent;
				_.task.on('scroll', function (){
					if (_ns.isVisible) _ns._pos();
				});
			}
			_.task.on('resize', function (){
				if (_ns.isVisible) _ns._pos();
			});
		}
	},
	_pos: function () {
		var elem = this.j[0];
		//to avoid updateText expand this element out of viewport and get wrong `this.offsetParent.clientWidth`
		this.j.css({'visibility': 'hidden', left: 0, top: 0});
		var offsetX = _.ua.support.stylePositionFixed ? 0 : _.dom.rootScrollingElem.scrollLeft;
		var offsetY = _.ua.support.stylePositionFixed ? 0 : _.dom.rootScrollingElem.scrollTop;
		var l = (this.offsetParent.clientWidth - elem.offsetWidth)/2;  //body may be a page wrapper, and may have {position: relative}.
		var t = (window.innerHeight * 0.95 - elem.offsetHeight)/2;  //on ios, doc.clientHeight never change even when scrolling causes addr bar hiden.
		this.j.css({
			left: l + offsetX + 'px',
			top: t + offsetY + 'px'
		});
		this.j.css({'visibility': 'visible'});
	},
	show: function (s) {
		if (this.isVisible) return false;
		this._prepare();
		this._setText(s);
		this._pos();
		this.j.attr('class', this.basicClass);
		this.isVisible = true;
	},
	fadeIn: function (s) {
		if (this.isVisible) return false;
		this._prepare();
		this._setText(s);
		this._pos();
		this.j.attr('class', this.basicClass + ' fade-in');
		this.isVisible = true;
	},
	hide: function () {
		if (!this.isVisible) return false;
		this.j.attr('class', this.basicClass + ' hidden');
		this.isVisible = false;
	},
	fadeOut: function () {
		if (!this.isVisible) return false;
		this.j.attr('class', this.basicClass + ' fade-out');
		this.isVisible = false;
	},
	//text
	updateText: function (s) {
		this._setText(s);
		this._pos();
	},
	_setText: function (s) {
		this._prepareText();
		if (s) {
			this.j.addClass('cmText');
			this.basicClass = this.textClass;
			this.jText.html(s);
		} else {
			this.j.removeClass('cmText');
			this.basicClass = this.origClass;
		}
	},
	_prepareText: function () {
		if (!this.jText) {
			this.jText = $('<p></p>').appendTo(this.j);
		}
	}
};

//smoothJump
DPL.smoothJump = {
	isReady: false,
	isBound: false,
	isVisible: false,
	ini: function () {
		if (this.isReady) return false;
		var _ns = this;
		var isTapEventAvailable = /** _.ua.isTouchDevice && window.Zepto **/ false;
		if (isTapEventAvailable) {
			_.dom.jWin.on('tap click', '.cmSmoothJump', function (e) {
				//alert(e.type);
				DPL.smoothJump.show();
				_ns.trigger = this;
				var sEvent = e.type;
				var sLastEvent = _.dom.data(this, 'smoothjump-event');
				if (!sLastEvent && sEvent === 'tap') $(this).trigger('click');
				_.dom.data(this, 'smoothjump-event', sEvent);
			});
		} else {
			_.dom.jWin.on('click', '.cmSmoothJump', function (e) {
				//alert('smoothJump');
				if (e.button > 0 || e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) return;
				var msg = _.dom.data(this, 'msg');
				DPL.smoothJump.show(msg);
			});
		}
		this.isReady = true;
	},
	_refresh: function () {
		if (this.trigger) {
			_.dom.data(this.trigger, 'smoothjump-event', '');
		}
	},
	_bind: function () {
		if (this.isBound) return false;
		var _ns = this;
		_.dom.jWin.on('pageshow', function () {
			if (_ns.isVisible) {
				_ns.hide();
				_ns._refresh();
			}
		});
		this.isBound = true;
	},
	show: function (s) {
		if (this.isVisible) return false;
		this._bind();
		DPL.mask.fadeIn();
		DPL.loading.fadeIn(s);
		this.isVisible = true;
		if (_.ua.webView || /MicroMessenger/i.test(_.ua.str)) {
			var _ns = this;
			_.delay(function () {
				_ns.hide();
			}, 5000);
		}
	},
	hide: function () {
		if (!this.isVisible) return false;
		DPL.mask.fadeOut();
		DPL.loading.hide();
		this.isVisible = false;
	}
};

//popup
DPL.popup = {
	ini: function () {
		//
	},
	//api
	open: function (/** cfg **/) {
		//
	},
	close: function () {
		//
	}
};

//alert
