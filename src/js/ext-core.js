/*global _ */
/*jshint bitwise:true, eqeqeq:true, forin:true, immed:true, latedef:true, newcap:true, undef:true,
	trailing:true, smarttabs:true, sub:true, browser:true, devel:true, maxlen:150 */
////////////////////  fn  ////////////////////
(function (root) {
//----------------------------------------
var _ext = {};

//config
_ext.config = {
	debug: _.str.include(location.href, 'debug=1') || _.str.include(location.hash, 'debug=1'),
	selAction: ''
};
_ext.config._ini = function () {
	//todo: window.onhashchange to update _.config.debug
	this.get = function (key) {
		return _.isString(key) && key ? sessionStorage.getItem(key) || localStorage.getItem(key) || '' : false;  //to be improved
	};
	this.set = function (key, value, bSession) {
		if (_.isString(key)) {
			(bSession ? sessionStorage : localStorage).setItem(key, '' + value);
		} else {
			return false;
		}
	};
	this.del = function (key) {
		if (_.isString(key) && key) {
			sessionStorage.removeItem(key);
			localStorage.removeItem(key);
		} else {
			return false;
		}
	};
};

//root
_ext.root = {
	$: function (input) {
		var result;
		if (_.isElement(input)) {
			result = input.__j__ = input.__j__ || root.$(input);
		} else if (_.dom.isJQuery(input) || _.dom.isZepto(input)) {
			result = input;
		} else {
			result = root.$(input);
		}
		return result;
	},
	log: function (input) {
		if (!_ext.config || !_ext.config.debug) return false;
		if (root.console) console.log(input);
	},
	isPlainObject: root.$.isPlainObject,
	includeKey: function (o, key) {  //key: '' or []
		var result = false;
		if (_.isObject(o)) {
			result = true;
			var dataKeys = _.keys(o);
			if (_.isArray(key)) {
				_.each(key, function (n) {
					if (!_.include(dataKeys, '' + n)) {result = false; return false; }
				});
			} else if (_.isNumber(key) || _.isString(key)) {
				if (!_.include(dataKeys, '' + key)) {result = false; }
			}
		}
		return result;
	}
};

//ua
_ext.ua = {};
_ext.ua._ini = function () {
	var $ = root.$;
	var str = navigator.userAgent;
	_.extend(this, {
		str: str,
		isWebKit: document.documentElement.style.webkitTransform !== undefined,
		isMoz: document.documentElement.style.MozTransform !== undefined,
		isIE: /*@cc_on ! @*/ false,
		isSafari: _.str.include(navigator.vendor.toLowerCase(), 'apple'),
		isChrome: _.str.include(str.toLowerCase(), 'chrome'),
		isTouchDevice: document.createTouch !== undefined
	});
	_.extend(this, {
		isIOS: $.os.ios,  //by ua str
		isAndroid: $.os.android,  //by ua str
		version: $.os.version,  //by ua str
		isIPhone: $.os.iphone,  //by ua str, including ipod
		isIPad: $.os.ipad  //by ua str
	});
	//check web view or shell-browser on ios
	if (this.isIOS) {
		var browser;
		if (!/safari/i.test(str) || !_.str.include(navigator.vendor.toLowerCase(), 'apple')) browser = '(Unknown)';
		if (/MicroMessenger/i.test(str)) {
			browser = 'WeChat';
		} else if (/weibo/i.test(str)) {
			browser = 'Weibo';
		} else if (/MQQBrowser/i.test(str)) {
			browser = 'QQ-Browser';
		} else if (/CriOS/i.test(str)) {
			browser = 'Chrome';
		} else if (/UCBrowser/i.test(str) || /UCWEB/i.test(str)) {
			browser = 'UC';
		} else if (/FlyFlow/i.test(str)) {
			browser = 'Baidu';
		} else if (/Mercury/i.test(str)) {
			browser = 'Mercury';
		} else if (/SogouMobileBrowser/i.test(str)) {
			browser = 'Sogou';
		} else if (/Opera/i.test(str)) {
			browser = 'Opera';
		} else if (/baiduboxapp/i.test(str)) {
			browser = 'BaiduBox';
		} else if (/hao123/i.test(str)) {
			browser = 'Hao123';
		}
		if (browser) this.webView = browser;
	}
	//fix zepto: detect ipod from _.ua.isIPhone
	if (this.isIPhone && this.str.match(/\(ipod;/i)) {
		this.isIPhone = false;
		this.isIPod = true;
	}
	//screen
	var scr = {};
	var PIXEL_RATIO = root.devicePixelRatio || 1;
	var fnGetOrientation = function () {
		var s = '';
		if (_.isNumber(root.orientation)) {
			s = root.orientation % 180 ? 'landscape' : 'portrait';
		} else {
			s = screen.width > screen.height ? 'landscape' : 'portrait';
		}
		return s;
	};
	scr = {
		pixelRatio: PIXEL_RATIO,
		getOrientation: fnGetOrientation
	};
	//on android 2: [window.outer~] equals actual pixel excluding status bar; [screen] means viewport, and changes when scrolling
	//on android 4: [window.outer~] is the same as above; [screen] means actual pixel, not logical pixel
	//on ios: [screen] means logical pixel
	var ver = _.str.toFloat(this.version);
	if (this.isAndroid) {
		if (ver < 4) {
			scr.getWidth = function () {return _.str.toNumber((root.outerWidth || 1) / PIXEL_RATIO, 1);};
			scr.getHeight = function () {return _.str.toNumber((root.outerHeight || 1) / PIXEL_RATIO, 1);};
		} else {
			scr.getWidth = function () {return _.str.toNumber((screen.width || 1) / PIXEL_RATIO, 1);};
			scr.getHeight = function () {return _.str.toNumber((screen.height || 1) / PIXEL_RATIO, 1);};
		}
	} else if (this.isIOS) {
		scr.getWidth = function () {return window.innerWidth || 1;};
		scr.getHeight = function () {return window.innerWidth === screen.width ? (screen.height || 1) : (screen.width || 1);};
	} else {
		scr.getWidth = function () {return screen.width || 1;};
		scr.getHeight = function () {return screen.height || 1;};
	}
	var size = [scr.getWidth(), scr.getHeight()];
	var longerSide = _.max(size);
	var shorterSide = _.min(size);
	var ASPECT_RATIO = longerSide / shorterSide;
	scr.aspectRatio = ASPECT_RATIO;
	this.screen = scr;
	//detect type
	this.isMobileDevice = this.isIOS || this.isAndroid;
	this.mobileDeviceType = this.isMobileDevice ? ((longerSide > 640) ? 'pad' : 'phone') : null;
	//detect os
	if (this.isAndroid) {
		this.os = 'Android';
	} else if (this.isIOS) {
		this.os = 'iOS';
		//detect apple device
		var sPrd = 'Unknown iOS Device';
		if (this.isIPad) {
			sPrd = 'iPad';
		} else if (this.isIPhone) {
			sPrd = 'iPhone';
		} else if (this.isIPod) {
			sPrd = 'iPod';
		}
		var sModel = PIXEL_RATIO > 1 ? '(HD)' : '';
		if (!this.isIPad && PIXEL_RATIO > 1 && ASPECT_RATIO > 1.7) sModel = '(HD+)';  //16:9
		this.appleDevice = sModel ? sPrd + ' ' + sModel : sPrd;
	}
	//support
	var stylePositionFixed = !this.isTouchDevice || (this.isIOS && ver >= 5) || (this.isAndroid && ver >= 4);
	_.extend(this, {
		support: {
			classList: !!document.documentElement.classList,
			dataset: !!document.documentElement.dataset,
			stylePositionFixed: stylePositionFixed
		}
	});
};

//dom
_ext.dom = {};
_ext.dom._ini = function () {
	var $ = root.$;
	this.jWin = $(root);
	this.jDoc = $(document.documentElement);
	var _ns = this;
	$(function () {  //document.body maybe not ready when this js running.
		_ns.rootElem = document.compatMode && document.compatMode === 'CSS1Compat' ? document.documentElement : document.body;
		_ns.rootScrollingElem = (_.ua.isWebKit) ? document.body : _ns.rootElem;
		_ns.jBody = $(document.body);
	});
	this.isJQuery = function (o) {
		var J = root.jQuery;
		return !!J && o instanceof J;
	};
	this.isZepto = function (o) {
		var J = root.Zepto;
		return !!J && _.isObject(o) && (_.isString(o.selector) || _.isArray(o.selector)) && _.isNumber(o.length);
	};
	this.data = function (elem, sKey, sValue) {
		if (!_.isElement(elem) || _.isEmpty(sKey) || !_.isString(sKey)) return false;
		sKey = _.str.trim(sKey.replace(/\W/g, ' '));  //clean sKey
		var sDataKey = _.str.camelize(sKey);
		var sAttrKey = 'data-' + _.str.dasherize(sKey);
		var isSupported = _.ua.support.dataset;
		if (arguments.length > 2) {  //setter
			if (isSupported) {
				elem.dataset[sDataKey] = sValue;
			} else {
				elem.setAttribute(sAttrKey, sValue);
			}
		} else if (arguments.length === 2) {  //getter
			return isSupported ? elem.dataset[sDataKey] : elem.getAttribute(sAttrKey);
		} else {
			return false;
		}
	};
	this.hasClass = function (elem, sClass) {
		if (!_.isElement(elem) || _.isEmpty(sClass) || !_.isString(sClass)) return false;
		return _.str.include(_.str.surround(elem.className, ' '), _.str.surround(sClass, ' '));
	};
};

//system
_ext.exports = function (key) {  //key: '...' or [...]
	var _ns = this;
	key = _.isArray(key) ? _.compact(key) : _.str.trim(key);
	//console.log(key);
	function fnCheckKey(key) {
		if (_[key]) {
			_ns.root.log('[Warning] _ already has key: ' + key);
			return false;
		} else {
			return true;
		}
	}
	function fnExportModule(key) {
		if (_.isArray(key)) {
			_.each(key, function (n) {fnExportModule(n); });
		} else if (_.isString(key)) {
			if (key === 'root') {
				_.each(_ns.root, function (n, i) {
					fnCheckKey(i);
					_[i] = n;
				});
			} else if (key === 'template') {
				_.extend(_.template, _ns.template);
			} else {
				fnCheckKey(key);
				_[key] = _ns[key];
			}
			if (_[key] && _.isFunction(_[key]._ini)) _[key]._ini();
		}
	}
	if (_ns.root.includeKey(_ns, key)) {
		fnExportModule(key);
	} else {
		_ns.root.log('[Error] Invalid key(s) to export: ' + key);
		return false;
	}
};
_ext.ini = function (oConfig) {
	var result = false;
	if (!root.$) {
		_.log('[Error] $ not found!');
	} else if (!root._) {
		_.log('[Error] _ not found!');
	} else if (!root._.str) {
		_.log('[Error] _.str not found!');
	} else {
		//get config info from gm script
		if (root._extConfigData) {
			_.extend(this.config, root._extConfigData);
			delete root._extConfigData;
		}
		//get config info from arguments
		if (_.isObject(oConfig)) {
			_.extend(this.config, oConfig);
		}
		//bind to _ and ini
		this.exports(this.config.module || [
			'config', 'ua', 'dom',  //[core]
			'url',  //[url]
			'event', 'task', 'action',  //[event]
			'ga', 'sns', 'ajax', 'template', 'system'  //[misc]
		]);
		result = true;
	}
	return result;
};

//output
if (root._) {
	_.ext = _.ext || {};
	_.extend(_.ext, _ext);
	_ext.exports('root');  //in order to get _.log ready asap
}

//----------------------------------------
}(window));
