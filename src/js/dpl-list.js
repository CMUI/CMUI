/*global _, $ */
/*jshint bitwise:true, eqeqeq:true, forin:true, immed:true, latedef:true, newcap:true, undef:true,
	trailing:true, smarttabs:true, sub:true, browser:true, devel:true, maxlen:150 */
////////////////////  fn  ////////////////////
var DPL = DPL || {};

//list
DPL.list = {
	isDeleting: false,  //deleting status
	ini: function () {
		this.selDeletableItem = '.cmList.cmDeletable li, .cmList li.cmDeletable';
		this.htmlBtnDelete = '<div class="cmBtnWrapper delete"><a class="cmBtn cmDangerous" href="#dpl-list-delete-item" data-action></a></div>';
		this.defaultLabelBtnDelete = 'Delete';
		this.BtnDeleteLoading = '<i class="cmIcon cmX20 loading-black-bg"></i>';
		//this._bind();
		//this._setAction();
	},
	_setAction: function () {
		_.action.extend({
			'dpl-list-delete-item': function () {
				DPL.list.deleteItemByBtn(this);
			}
		});
	},
	_bind: function () {
		var _ns = this;
		$(function () {
			var sEventToStartDelete = 'swipeLeft swipeRight';
			sEventToStartDelete += ' toBeDeleted';  //debug
			_.dom.jBody.on(sEventToStartDelete, _ns.selDeletableItem, function () {
				if (!_ns.isDeleting) _ns._prepareDelete(this);
			});
			var sEventToDoDelete = 'deleted';
			_.dom.jBody.on(sEventToDoDelete, _ns.selDeletableItem, function () {
				_ns.destroyItem(this);
			});
		});
	},
	_prepareDelete: function (elem) {
		this._prepareBtnDelete();
		this._hideBtnDelete();
		var jItem = _.$(elem);
		this.jBtnWrapperDelete.appendTo(jItem);
		jItem.addClass('ready-to-delete');
	},
	_prepareBtnDelete: function () {
		if (this.jBtnDelete && this.jBtnDelete[0]) {
			this.unsetBtnDeleteLoading();
		} else {
			this.jBtnWrapperDelete = $(this.htmlBtnDelete);
			this.jBtnDelete = this.jBtnWrapperDelete.find('.cmBtn');
			this.jBtnDelete.text(DPL.config.labelBtnDelete || this.defaultLabelBtnDelete);
			this._iniAutoHideBtnDelete();
		}
	},
	_hideBtnDelete: function (bDetachFromDom) {
		this.jBtnDelete.closest(this.selDeletableItem).removeClass('ready-to-delete');
		if (bDetachFromDom) this.jBtnWrapperDelete.remove();
	},
	_iniAutoHideBtnDelete: function () {
		var _ns = this;
		_.dom.jDoc.on(_.event.tapEventName, function (e) {
			var target = e.target;
			if (!_ns.isDeleting && target !== _ns.jBtnWrapperDelete[0] && target !== _ns.jBtnDelete[0]) {
				_ns._hideBtnDelete();
			}
		});
	},
	deleteItemByBtn: function (elem) {
		var jBtn = _.$(elem);
		//_.log(jBtn.closest(this.selDeletableItem));
		this.isDeleting = true;
		jBtn.closest(this.selDeletableItem).trigger('delete');
	},
	destroyItem: function (elem) {
		var _ns = this;
		var jItem = _.$(elem);
		jItem.removeClass('ready-to-delete').addClass('deleted');  //animated
		_.delay(function () {
			_ns._hideBtnDelete(true);
			jItem.empty().remove();
			_ns.isDeleting = false;
		}, 250);
	},
	setBtnDeleteLoading: function () {
		DPL.btn.setDisabled(this.jBtnDelete);
		this.jBtnDelete.html(this.BtnDeleteLoading);
	},
	unsetBtnDeleteLoading: function () {
		this.jBtnDelete.text(DPL.config.labelBtnDelete || this.defaultLabelBtnDelete);
		DPL.btn.unsetDisabled(this.jBtnDelete);
	}
};

