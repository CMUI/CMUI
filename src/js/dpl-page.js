/*global _, $ */
/*jshint bitwise:true, eqeqeq:true, forin:true, immed:true, latedef:true, newcap:true, undef:true,
	trailing:true, smarttabs:true, sub:true, browser:true, devel:true, maxlen:150 */
////////////////////  fn  ////////////////////
var DPL = DPL || {};

//page
DPL.page = {
	ini: function () {
		this._setup();
		this._bind();
		this._iniSlide();
	},
	_setup: function () {
		this.slideQ = [];
		this.scrReadyFrames = [];
		this.classLongText = 'cmLongText';
	},
	_bind: function () {
		var _ns = this;
		_.dom.jWin.on('resize orientationchange', function () {  /** fight with iscroll, input:focus, scroll & resize event **/
			var jPageSlideCurrent = _.last(_ns.slideQ);
			if (jPageSlideCurrent && !jPageSlideCurrent.hasClass('cmPageBase')) {
				_ns.refreshPageScroll(jPageSlideCurrent);
			}
		});
		_.task.on('resize', function () {  /** fight with iscroll, input:focus, scroll & resize event **/
			var jPageSlideCurrent = _.last(_ns.slideQ);
			if (jPageSlideCurrent && jPageSlideCurrent.is('.cmPageScroll') && !$(':focus').length) _ns.scrollToTop();
		});
		//todo: handle pc scroll when jPageSlideBase is free scroll.
		//todo: optimize: seems no need to refresh all pages when resize.
	},
	_iniSlide: function () {
		this.jPages = $('.cmPage');
		if (this.jPages.length > 1) {
			this._setAction();
			//find base page
			this.jPageSlideBase = this.jPageSlideBase || this.jPages.filter('.cmPageBase').first();
			if (!this.jPageSlideBase[0]) {this.jPageSlideBase = this.jPages.first().addClass('cmPageBase'); }
			//ini class
			this.jPageSlideBase.addClass('cmPageSlideIn');
			this.jPages.not('.cmPageBase').addClass('cmPageSlideReady');
			//ini slide queue
			if (!this.slideQ.length) {
				this.slideQ.push(this.jPageSlideBase);
			}
		}
	},
	updateSlide: function () {
		this._iniSlide();
	},
	_setAction: function () {
		_.action.extend({
			'dpl-page-slide-back': function () {
				DPL.page.slideBack();
			},
			'dpl-page-slide-to': function () {
				var id = _.url.getHashFromLink(this);
				if (_.str.isHash(id)) {
					DPL.page.slideTo(id);
				} else {
					return false;
				}
			}
		});
	},
	slideTo: function (s) {
		var j = _.$(s);
		//var len = this.slideQ.length;
		if (j.is('.cmPageSlideReady')) {
			var jPageSlideCurrent = _.last(this.slideQ);
			//handle base page
			var isPageBase = jPageSlideCurrent.hasClass('cmPageBase');
			if (isPageBase) {
				//store base page's scroll position
				jPageSlideCurrent[0].scrPosition = _.dom.rootScrollingElem.scrollTop;
				this.scrollToTop();
				//fit base page to viewport
				jPageSlideCurrent.css('height', window.innerHeight + 'px');
			} else {
				this.scrollToTop();
			}
			//do slide
			this.refreshPageScroll(j.find('.cmPageContentFrame'));
			var classNameSlideOutChange = ['cmPageSlideIn', 'cmPageSlideOut'];
			var classNameSlideInChange = ['cmPageSlideReady', 'cmPageSlideIn'];
			jPageSlideCurrent.removeClass(classNameSlideOutChange[0]).addClass(classNameSlideOutChange[1]);
			j.removeClass(classNameSlideInChange[0]).addClass(classNameSlideInChange[1]);
			this.slideQ.push(j);
		} else {
			return false;
		}
	},
	slideBack: function () {
		var len = this.slideQ.length;
		if (len > 1) {
			var classNameSlideOutChange = ['cmPageSlideIn', 'cmPageSlideReady'];
			var classNameSlideInChange = ['cmPageSlideOut', 'cmPageSlideIn'];
			var jPageSlideCurrent = _.last(this.slideQ);
			var jPageSlidePrev = this.slideQ[len - 2];
			jPageSlideCurrent.removeClass(classNameSlideOutChange[0]).addClass(classNameSlideOutChange[1]);
			jPageSlidePrev.removeClass(classNameSlideInChange[0]).addClass(classNameSlideInChange[1]);
			this.slideQ.pop();
			//handle base page
			var isPageBase = jPageSlidePrev.hasClass('cmPageBase');
			if (isPageBase) {
				//restore base page's height
				jPageSlidePrev.css('height', 'auto');
				//restore base page's scroll position
				_.delay(function () {
					window.scrollTo(0, jPageSlidePrev[0].scrPosition);
					//_.dom.jWin.trigger('scroll');
					jPageSlidePrev[0].scrPosition = null;
				}, 350);
			}
		} else {
			return false;
		}
	},
	_adjustFrameHeight: function (eFrame) {
		var iHeightNavBar = eFrame.jNavBar ? eFrame.jNavBar.height() : 0;
		eFrame.style.height = window.innerHeight - iHeightNavBar + 'px';
	},
	iniPageScroll: function (s, bHasForm) {
		if (DPL.IScroll) {
			var selPages = s || '.cmPageScroll';
			var jPages = _.$(selPages);
			jPages.find('.cmPageContentFrame').each(function () {
				var jFrame = $(this);
				var eFrame = this;
				eFrame.jNavBar = jFrame.siblings('.cmPageNavBar');
				if (_.ua.isTouchDevice) {
					eFrame.jNavBar.on(_.event.dragEventName, function (e) {
						e.preventDefault();
					});
				}
				setTimeout(function () {
					if (!eFrame.objScroll) {
						var a = DPL.page.scrReadyFrames;
						a.push(eFrame);
						eFrame.id = eFrame.id || 'dpl-scroll-' + (a.length + 1);
						DPL.page._adjustFrameHeight(eFrame);
						var settings = {hScroll: false};
						if (bHasForm) _.extend(settings, {
							useTransform: _.ua.isTouchDevice,
							onBeforeScrollStart: function (e) {
								var target = e.target;
								while (target.nodeType !== 1) target = target.parentNode;
								var tag = target.tagName.toLowerCase();
								if (!_.include(['select', 'input', 'textarea'], tag)) e.preventDefault();
							}
						});
						eFrame.objScroll = new DPL.IScroll(eFrame.id, settings);
					}
				}, 0);
			});
		} else {
			_.log('[Error] iScroll missing.');
		}
	},
	refreshPageScroll: function (sel) {
		if (DPL.IScroll) {
			var jPageSlideCurrent = _.last(this.slideQ);
			if (jPageSlideCurrent.hasClass('cmPageScroll')) {
				this.scrollToTop();
			}
			var jFrames = sel ? _.toArray($(sel)) : this.scrReadyFrames;
			_.each(jFrames, function (n) {
				DPL.page._adjustFrameHeight(n);
				if (n.objScroll) n.objScroll.refresh();
			});
		} else {
			_.log('[Error] iScroll missing.');
		}
	},
	destroyPageScroll: function (sel) {
		if (!DPL.IScroll) {
			_.log('[Error] iScroll missing.');
			return false;
		} else if (!sel) {
			return false;
		} else {
			var aFrames;
			var j = $(sel);
			j = j.is('.cmPageContentFrame') ? j : j.find('.cmPageContentFrame');
			aFrames = _.toArray(j);
			_.each(aFrames, function (n) {
				if (n.objScroll) {
					n.objScroll.destroy();
					n.objScroll = null;
				}
			});
		}
	},
	hideAddrBar: function () {
		if (_.dom.rootScrollingElem.scrollTop < 1) {  //if page scrolled, dont do this.
			window.scrollTo(0, 0);
			_.dom.jWin.trigger('scroll');
		}
	},
	scrollToTop: function () {
		window.scrollTo(0, 0);  //to be changed to anim fx
		_.dom.jWin.trigger('scroll');
	},
	scrollToBottom: function () {
		window.scrollTo(0, _.dom.rootScrollingElem.scrollHeight - window.innerHeight);  //to be changed to anim fx
		_.dom.jWin.trigger('scroll');
	},

	//create sub page
	_cfgSubPageDefault: {
		//id: '',
		title: 'Page Title',
		//btnRight: {label: 'Action', action: '#'}
		//btnLeft: {label: 'Cancel', action: '#'}
		btnBack: {label: 'Back', action: '#dpl-page-slide-back'}
	},
	_setTemplateSubPage: function () {
		if (this.isTemplateReady) return;
		//_.template.add('dpl-page-sub-page');  //src code in [~/element/page.html]
		_.template.add('dpl-page-sub-page', [
			'<article class="cmPage cmPageScroll cmPageSlideReady" id="<%= data.id %>">',
				'<header class="cmPageNavBar">',
					'<h1<%= _.str.fullWidthLength(data.title) > 6 ? \' class="cmLongText"\' : \'\' %>><%= data.title %></h1>',
				'<% if (_.isPlainObject(data.btnLeft)) { %>',
					'<div class="cmBtnWrapper cmLeft<%= _.str.fullWidthLength(data.btnLeft.label) > 4 ? \' cmLongText\' : \'\' %>">',
						'<a class="cmBtn" href="#" data-action="<%= data.btnLeft.action || \'\' %>">',
							'<b><%= data.btnLeft.label || \'Action\' %></b>',
						'</a>',
					'</div>',
				'<% } else if (_.isPlainObject(data.btnBack)) { %>',
					'<div class="cmBtnWrapper cmLeft<%= _.str.fullWidthLength(data.btnBack.label) > 4 ? \' cmLongText\' : \'\' %>">',
						'<a class="cmBtn cmBack" href="#" data-action="<%= data.btnBack.action || \'#dpl-page-slide-back\' %>">',
							'<b><%= data.btnBack.label || \'Back\' %></b>',
						'</a>',
					'</div>',
				'<% } %>',
				'<% if (_.isPlainObject(data.btnRight)) { %>',
					'<div class="cmBtnWrapper cmRight<%= _.str.fullWidthLength(data.btnRight.label) > 4 ? \' cmLongText\' : \'\' %>">',
						'<a class="cmBtn" href="#" data-action="<%= data.btnRight.action || \'\' %>">',
							'<b><%= data.btnRight.label || \'Cancel\' %></b>',
						'</a>',
					'</div>',
				'<% } %>',
				'</header>',
				'<div class="cmPageContentFrame">',
					'<div class="inner"><%= data.html %></div>',
				'</div>',
			'</article>'
		].join('\n'));
		this.isTemplateReady = true;
	},
	createSubPage: function (html, id, cfg) {
		this._setTemplateSubPage();
		cfg = cfg || {};
		var jSubPage, eSubPage;
		if (_.isString(html) && _.isObject(cfg)) {
			cfg.html = html;
			cfg.id = _.str.stripHash(id || '');
			cfg = _.defaults(cfg, this._cfgSubPageDefault);
			var htmlSubPage = _.template.render('dpl-page-sub-page', cfg);
			jSubPage = $(htmlSubPage).appendTo(_.dom.jBody);
			eSubPage = jSubPage[0];
			eSubPage.j = jSubPage;  //cache
		}
		return eSubPage || false;
	},
	setSubPageTitleText: function (e, title) {  //test
		var j = _.$(e);
		var sel = '.cmPageNavBar h1';
		var jTitle = j.is(sel) ? j : j.find(sel);
		if (jTitle.length) {
			if (_.str.fullWidthLength(title) > 6) {
				jTitle.addClass(this.classLongText);
			} else {
				jTitle.removeClass(this.classLongText);
			}
		}
	},
	setSubPageBtnBackLabel: function (e, label) {  //test
		var j = _.$(e);
		var sel = '.cmPageNavBar .cmBack';
		var jTitle = j.is(sel) ? j : j.find(sel);
		if (jTitle.length) {
			if (_.str.fullWidthLength(label) > 4) {
				jTitle.addClass(this.classLongText);
			} else {
				jTitle.removeClass(this.classLongText);
			}
		}
	},
	updateSubPage: function (/** e, cfgSwitch **/) {
		//todo
	}
};
