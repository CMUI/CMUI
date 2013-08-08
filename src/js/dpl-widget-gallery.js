/*global _, $ */
/*jshint bitwise:true, eqeqeq:true, forin:true, immed:true, latedef:true, newcap:true, undef:true,
	trailing:true, smarttabs:true, sub:true, browser:true, devel:true, maxlen:150 */
////////////////////  fn  ////////////////////
var DPL = DPL || {};

//gallery
DPL.gallery = {
	sel: '.cmGallery',
	ini: function () {
		this.j = $(this.sel);
		this.j.each(function () {
			this.objGallery = new DPL.gallery.Class(this);
		});
	},
	update: function (sel, html) {
		if (sel && _.isString(html)) {
			var jWrapper = $(sel);
			var j = jWrapper.is(this.sel) ? jWrapper : jWrapper.find(this.sel);
			if (j[0]) {
				j[0].objGallery.updateContent(html);
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
};
DPL.gallery.Class = function (e) {
	this.j = $(e);
	this.ini();
};
DPL.gallery.Class.prototype = {
	ini: function () {
		this._getElem();
		this._setFrame();
		this._setIndicator();
		this._setArrow();
		this._iniScroll();
	},
	updateContent: function (html) {
		this.j.removeClass('ready');
		this.objScroll.scrollToPage(0, 0, 0);
		this.jList.html(html);
		this._refreshContent();
		this.j.addClass('ready');
	},
	_refreshContent: function () {
		this._getItem();
		this._setFrame();
		this._setIndicator();
		this._setArrow();
		this.objScroll.refresh();
	},
	_getElem: function () {
		this.jFrame = this.j.find('.cmGalleryFrame');
		this.jList = this.jFrame.children('ul');
		this.jIndicatorWrapper = this.j.find('.cmGalleryIndicator');
		this.jArrowWrapper = this.j.find('.cmGalleryArrow');
		this._getItem();
	},
	_getItem: function () {
		this.jItem = this.jList.children('li');
	},
	_setFrame: function () {
		this.width = this.jFrame.width();
		this.length = this.jItem.length;
		this.jItem.width(this.width);
		this.jList.width(this.width * this.jItem.length);
	},
	_setIndicator: function () {
		var len = this.length;
		if (len && this.jIndicatorWrapper[0]) {
			var html = '<ol>' + _.str.repeat('<li>o</li>', len) + '</ol>';
			this.jIndicatorWrapper.html(html);
			this.jIndicatorWrapper.find('li:first-child:not(:only-child)').addClass('on');
		}
	},
	_setArrow: function () {
		if (this.jArrowWrapper[0]) {
			var len = this.length;
			//create
			var html = [
				'<a href="#gallery-prev" class="prev">&lt;</a>',
				'<a href="#gallery-next" class="next">&gt;</a>'
			].join('');
			if (!this.jArrowWrapper.html()) {this.jArrowWrapper.html(html); }
			this.jArrow = this.jArrow || this.jArrowWrapper.find('a');
			this.jArrowPrev = this.jArrowPrev || this.jArrowWrapper.find('a.prev');
			this.jArrowNext = this.jArrowNext || this.jArrowWrapper.find('a.next');
			//set status
			this.jArrow.removeClass('off');  //reset to default
			if (len > 1) {
				this.jArrowPrev.addClass('off');
			} else {
				this.jArrow.addClass('off');
			}
		}
	},
	_bindArrow: function () {
		var _ns = this;
		var objScroll = this.objScroll;
		_.event.onTap(this.jArrowPrev, function (e) {
			e.preventDefault();
			if (_ns.length) {objScroll.scrollToPage('prev', 0); }
		});
		_.event.onTap(this.jArrowNext, function (e) {
			e.preventDefault();
			if (_ns.length) {objScroll.scrollToPage('next', 0); }
		});
	},
	_iniScroll: function () {
		var _this = this;
		var eFrame = this.jFrame[0];
		if (eFrame) {
			eFrame.id = eFrame.id || _.uniqueId('dpl-scroll-');
			if (DPL.IScroll) {
				setTimeout(function () {
					_this.objScroll = new DPL.IScroll(eFrame.id, {
						vScroll: false,
						hScrollbar: false,
						snap: true,
						momentum: false,
						lockDirection: true,
						onBeforeScrollStart: function () {},
						onScrollEnd: function () {
							_this._updateIndicator(this.currPageX + 1);
							_this._updateArrow(this.currPageX + 1);
						}
					});
					_this._bindArrow();
					_this.j.addClass('ready');
				}, 0);
			} else {
				_.log('[Error] iScroll missing.');
			}
		}
	},
	_updateIndicator: function (i) {
		if (this.jIndicatorWrapper[0]) {
			this.jIndicatorWrapper.find('li.on').removeClass('on');
			this.jIndicatorWrapper.find('li:nth-child(' + i + '):not(:only-child)').addClass('on');
		}
	},
	_updateArrow: function (i) {
		if (this.jArrowWrapper[0] && this.length > 1) {
			if (i === 1) {
				this.jArrowPrev.addClass('off');
				this.jArrowNext.removeClass('off');
			} else if (i === this.length) {
				this.jArrowPrev.removeClass('off');
				this.jArrowNext.addClass('off');
			} else {
				this.jArrow.removeClass('off');
			}
		}
	}
};