/*global _, $, DPL */
/*jshint bitwise:true, eqeqeq:true, forin:true, immed:true, latedef:true, newcap:true, undef:true,
	trailing:true, smarttabs:true, sub:true, browser:true, devel:true, maxlen:150 */
////////////////////  demo  ////////////////////
DPL.demo = {
	ini: function () {
		this._getElem();
		this._bind();
	},
	_getElem: function () {
		this.jBtn = $('.cmBtn[href="#none"], .cmBtn:not(a)').not('.cmBtnSwitch *');
		//this.jBtn = $('.cmBtn');
		this.jListItemInner = $('.cmList:not(.cmListWithAction) > li > a:first-child');
	},
	_bind: function () {
		_.event.onTap(this.jBtn, function (e) {
			e.preventDefault();
			alert('Thanks for clicking btn: ' + (this.href || '#' + this.tagName).split('#')[1] + '!');
		});
		_.event.onTap(this.jListItemInner, function (e) {
			e.preventDefault();
			var jThis = _.$(this);
			if (!jThis.is('[data-action-list] a')) alert('Thanks for clicking list-item!');
		});
		$('.cmBtnSwitch .cmBtn').on('select', function () {
			_.log(this);
			_.log('selected');
		});
	}
};

DPL.config.labelBtnDelete = '删除';
DPL.demo.list = {
	ini: function () {
		this._simSwipeEvent();
		this._bind();
	},
	_simSwipeEvent: function () {
		$(function () {
			_.dom.jBody.on('dblclick', DPL.list.selDeletableItem, function () {
				var j = _.$(this);
				j.trigger('toBeDeleted');
			});
		});
	},
	_bind: function () {
		var jItemSyncDelete = $('.cmList.cmDeletable li:first-child, .cmList li.cmDeletable:first-child');
		var jItemAsyncDelete = $('.cmList.cmDeletable li:last-child, .cmList li.cmDeletable:last-child');
		jItemSyncDelete.on('delete', function () {
			_.$(this).trigger('deleted');
		});
		jItemAsyncDelete.on('delete', function () {
			var jThis = _.$(this);
			DPL.list.setBtnDeleteLoading();
			_.delay(function () {
				jThis.trigger('deleted');
			}, 1000);
		});
	}
};

DPL.demo.page = {
	ini: function () {
		this._setAction();
	},
	_setAction: function () {
		var _ns = this;
		_.action.extend({
			'slide-to-sub-page': function () {
				_ns._prepareSubPage();
				_.delay(function () {
					DPL.page.slideTo(_ns.subPage);
				}, 500);
			}
		});
	},
	_prepareSubPage: function () {
		this.subPage = DPL.page.createSubPage(_.str.repeat('<p>测试</p>', 50, '\n'), 'test', {
			btnBack: {label: 'BackBackBack'},
			btnRight: {label: 'ActionActionAction', action: '#action'},
			//btnLeft: {label: 'CancelCancelCancel', action: '#cancel'},
			title: '测试测试测试测试测试'
		});
		DPL.page.updateSlide();
		DPL.page.iniPageScroll();
	}
};

DPL.demo.notice = {
	ini: function () {
		this._setAction();
		this._getElem();
	},
	_getElem: function () {
		this.jTipBox = $('section.tip-box .cmTipBox');
	},
	switchArrowDir: function () {
		var aClass = ['cmUpArrow', 'cmRightArrow', 'cmDownArrow', 'cmLeftArrow'];
		var currentClass = _.str.trim(this.jTipBox.attr('class').replace('cmTipBox', ''));
		var index = _.indexOf(aClass, currentClass);
		var newIndex = index === 3 ? 0 : index + 1;
		this.jTipBox.removeClass(currentClass).addClass(aClass[newIndex]);
	},
	_setAction: function () {
		var _ns = this;
		_.action.extend({
			'show-notice': function () {
				DPL.siteNotice.show({
					wrapper: 'section.demo',
					html: '欢迎浏览 CMUI 演示网站！（全新的 v0.10 正在开发中，体积更小巧、功能更强大、性能更出色，敬请期待！）',
					//html: '测试 <a href="###">link</a>',
					//actionClose: '#xxx',
					//hideCloseBtn: true,
					//type: 'info',
					id: 'test'
				});
			},
			'hide-notice': function () {
				DPL.siteNotice.hide();
			},
			'switch-arrow-dir': function () {
				_ns.switchArrowDir();
			},
			'mod-qty': function () {
				DPL.actionList.switchStatus(2);
				DPL.actionList.isWaiting = true;
			},
			'mod-qty-ok': function () {
				DPL.actionList.isWaiting = false;
				DPL.actionList.hide();
			}
		});
	}
};

DPL.demo.overlay = {
	ini: function () {
		this._getElem();
		this._extAction();
	},
	_extAction: function () {
		var _ns = this;
		_.action.extend({
			'mask-show': function () {
				DPL.mask.show();
			},
			'mask-hide': function () {
				DPL.mask.hide();
			},
			'mask-fade-in': function () {
				DPL.mask.fadeIn();
			},
			'mask-fade-out': function () {
				DPL.mask.fadeOut();
			},
			'toggle-content': function () {
				_ns.jPlaceholderToChangePageHeight.toggle();
			},
			'loading-show': function () {
				DPL.loading.show();
			},
			'loading-hide': function () {
				DPL.loading.hide();
			},
			'loading-fade-in': function () {
				DPL.loading.fadeIn();
			},
			'loading-fade-out': function () {
				DPL.loading.fadeOut();
			},
			'loading-set-text': function () {
				DPL.loading.updateText('测试文字');
			},
			'loading-set-text-long': function () {
				DPL.loading.updateText('测试文字测试文字测试文字测试文字测试文字测试文字测试文字测试文字测试文字测试文字测试文字测试文字测试文字测试文字测试文字测试文字测试文字');
			},
			'loading-del-text': function () {
				DPL.loading.updateText('');
			}
		});
	},
	_getElem: function () {
		this.jPlaceholderToChangePageHeight = $('section.mask .content');
	},
	_bindMask: function () {
		var _ns = this;
		DPL.mask.j.on('click', function () {
			if (_ns.isMaskOpenedByBtn) {
				DPL.mask.hide();
			}
			_ns.isMaskOpenedByBtn = false;
		});
	}
};


////////////////////  ini  ////////////////////
$(function () {
	DPL.demo.ini();
});
