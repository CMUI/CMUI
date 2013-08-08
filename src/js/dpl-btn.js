/*global _, $ */
/*jshint bitwise:true, eqeqeq:true, forin:true, immed:true, latedef:true, newcap:true, undef:true,
	trailing:true, smarttabs:true, sub:true, browser:true, devel:true, maxlen:150 */
////////////////////  fn  ////////////////////
var DPL = DPL || {};

//btn
DPL.btn = {
	ini: function () {
		var config = DPL.config;
		this.selBtn = config.selBtn || '.cmBtn';
		this.selBtnItem = config.selBtnItem || '.cmBtnItem';
		this.selBtnWrapper = config.selBtnWrapper || '.cmBtnWrapper';
		this.selBtnSwitch = config.selBtnWrapper || '.cmBtnSwitch';
		this._iniBtnWrapper();
		this._iniBtnSwitch();
	},
	_iniBtnWrapper: function () {
		_.dom.jDoc.on(_.event.tapEventName, function (e) {
			var target = e.target;
			if (_.dom.hasClass(target, 'cmBtnWrapper')) {
				var jBtnWrapper = _.$(target);
				var jBtn = jBtnWrapper.find('.cmBtn, a, input[type=button], button').first();
				if (!jBtn.hasClass('disabled') && !jBtnWrapper.hasClass('disabled')) {
					jBtn.trigger(_.event.tapEventName);
					if (_.event.tapEventName !== 'click') jBtn.trigger('click');  //in case `jBtn` is a normal link or button
				}
			}
		});
	},
	_iniBtnSwitch: function () {
		var _ns = this;
		_.event.onTap(this.selBtnItem, function (e) {
			e.preventDefault();
			var j = _.$(this);
			var sClass = 'current';
			var jBtnSwitch = j.parent();
			if (!jBtnSwitch.is('.cmBtnSwitch')) {
				jBtnSwitch = jBtnSwitch.parent();
				if (!jBtnSwitch.is('.cmBtnSwitch')) {
					jBtnSwitch = [];
				}
			}
			if (jBtnSwitch.length && !j.hasClass(sClass)) {
				var jBtns = jBtnSwitch.find(_ns.selBtn);
				DPL.btn._switchClass(jBtns, sClass, false);
				DPL.btn._switchClass(j, sClass, true);
				j.trigger('select');
			}
		});
	},
	resetBtnSwitch: function (sel) {  //reset all item (remove current status)
		if (!sel) return false;
		var _ns = this;
		var j = _.$(sel);
		var jBtnSwitch = j.is(this.selBtnSwitch) ? j : j.find(this.selBtnSwitch);
		jBtnSwitch.each(function () {
			var j = _.$(this);
			j.find(_ns.selBtnWrapper + ',' + _ns.selBtn).removeClass('current');
		}).trigger('clear');
	},
	setDisabled: function (sel) {
		this._switchClass(sel, 'disabled', true);
	},
	unsetDisabled: function (sel) {
		this._switchClass(sel, 'disabled', false);
	},
	_switchClass: function (sel, sClass, bType) {
		if (sel && sClass && _.isString(sClass)) {
			var _ns = this;
			var jAll = $(sel);
			jAll.each(function () {
				var j = this.j = this.j || $(this);
				var jBtn, btn;
				if (j.is(_ns.selBtn)) {
					jBtn = j;
					btn = this;
					btn.jBtnWrapper = btn.jBtnWrapper || j.parent(_ns.selBtnWrapper);
				} else if (j.is(_ns.selBtnWrapper)) {
					jBtn = j.find(_ns.selBtn).first();
					btn = jBtn[0] || {};
					btn.jBtnWrapper = btn.jBtnWrapper || j;
				}
				if (jBtn) {
					var act = bType ? 'addClass' : 'removeClass';
					jBtn[act](sClass);
					btn.jBtnWrapper[act](sClass);
				}
			});
		} else {
			return false;
		}
	}
};
