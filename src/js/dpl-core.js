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
		this._iniHtmlClass();
	},
	_iniHtmlClass: function () {  //set css hook on html element.
		var ua = _.ua;
		var aClass = [
			'js dpl',
			ua.isWebKit ? 'webkit' : '',
			ua.isSafari ? 'safari' : '',
			ua.isChrome ? 'chrome' : '',
			ua.isMoz ? 'moz' : '',
			ua.isIOS ? 'ios' : '',
			ua.isAndroid ? 'android android-' + (_.str.toFloat(ua.version) >= 4 ? 'high' : 'low') : '',
			ua.isTouchDevice ? 'touch' : 'mouse',
			ua.isMobileDevice ? 'mobile ' + ua.mobileDeviceType : 'desktop'  //or 'phone', 'pad'
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
		if (_.ua && !_.ua.isTouchDevice) DPL.blurLink.ini();
		DPL.btn.ini();
		DPL.list.ini();
		DPL.page.ini();
		DPL.smoothJump.ini();
		DPL.actionList.ini();
		result = true;
	}
	return result;
};
