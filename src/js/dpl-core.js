/*global _, $ */
/*jshint bitwise:true, eqeqeq:true, forin:true, immed:true, latedef:true, newcap:true, undef:true,
	trailing:true, smarttabs:true, sub:true, browser:true, devel:true, maxlen:150 */
////////////////////  fn  ////////////////////
var DPL = DPL || {};

DPL.config = {
	//selBtn: '',
	//selBtnWrapper: ''
};

//dom
DPL.dom = {
	ini: function () {
		this.iniHtmlClass();
	},
	iniHtmlClass: function () {  //set css hook on html element.
		var aClass = [
			'js dpl',
			_.ua.isWebKit ? 'webkit' : '',
			_.ua.isSafari ? 'safari' : '',
			_.ua.isChrome ? 'chrome' : '',
			_.ua.isMoz ? 'moz' : '',
			_.ua.isIOS ? 'ios' : '',
			_.ua.isAndroid ? 'android android-' + (_.str.toFloat(_.ua.version) >= 4 ? 'high' : 'low') : '',
			_.ua.isTouchDevice ? 'touch' : 'mouse',
			_.ua.mobileDeviceType || 'desktop'  //or 'phone', 'pad'
		];
		_.dom.jDoc.removeClass('no-js').addClass(aClass.join(' '));
	}
};

//blurLink
DPL.blurLink = {
	ini: function () {
		$(function () {
			_.dom.jBody.on('click', 'a[href], input[type=button], input[type=submit], button', function () {
				this.blur();
			});
		});
	}
};


//output
DPL.ini = function (oConfig) {
	var result = false;
	if (!window.$) {
		_.log('[Error] $ not found!');
	} else if (!window._) {
		_.log('[Error] _ not found!');
	} else if (!window._.str) {
		_.log('[Error] _.str not found!');
	} else if (!window.iScroll) {
		_.log('[Error] iScroll not found!');
	} else {
		if (_.isObject(oConfig)) {
			_.extend(this.config, oConfig);
		}
		DPL.IScroll = window.iScroll;
		DPL.dom.ini();
		DPL.blurLink.ini();
		DPL.btn.ini();
		DPL.list.ini();
		DPL.page.ini();
		DPL.loading.ini();
		DPL.smoothJump.ini();
		DPL.actionList.ini();
		result = true;
	}
	return result;
};
