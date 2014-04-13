/*global _ */
/*jshint bitwise:true, eqeqeq:true, forin:true, immed:true, latedef:true, newcap:true, undef:true,
	trailing:true, smarttabs:true, sub:true, browser:true, devel:true, maxlen:150 */
////////////////////  fn  ////////////////////
(function () {
//----------------------------------------
var _str = {};

//price
_str.CNY = _str.RMB = '\xA5';  //'\xA5' means CNY(RMB) symbol
_str.FULL_WIDTH_CNY = _str.FULL_WIDTH_RMB = '\uffe5';  //'\uffe5' means CNY(RMB) symbol in full-width chinese char
_str.priceToNumber = function (s) {  //formats '[cny] 12,345.60' to 12345.6
	return s ? parseFloat(s.replace(this.FULL_WIDTH_CNY, '').replace(this.CNY, '').replace(/\,/g, '').replace(/\-\s+/, '-')) : 0;
};
_str.numberToPrice = function (n, configIfRound) {  //formats 12345.6789 to '12,345.68', -1234.567 to '-1,234.57'
	//configIfRound: 1 or true: round to int, 0 or false or missing (default): keep two decimal places, -1: auto trim decimals only if int
	n = parseFloat(n);
	var bRoundToInteger = configIfRound > 0;
	var s = (n < 0 ? '-' : '') + (Math.abs(n).toFixed(bRoundToInteger ? 0 : 2) + (bRoundToInteger ? '.--' : '')).replace(_.str.rePrice, '$1,');
		//this regexp formats '1234.56' to '1,234.56', decimal point is necessary in source string
	s = configIfRound < 0 ? s.replace('.00', '') : s;
	return s.replace('.--', '');
};
_str.numberToFullPrice = function (n, b) {  //formats 12345.6789 to '[cny] 12,345.68', -1234.567 to '- [cny] 1,234.57'
	n = parseFloat(n);
	return (n < 0 ? '- ' : '') + this.CNY + ' ' + _.str.numberToPrice(Math.abs(n), b);
};
_str.numberToFullPriceHTML = function (n, b) {  //formats 12345.6789 to '<samp>[cny]<\/samp> <span>12,345.68<\/span>'
	n = parseFloat(n);
	return [
		(n < 0 ? '- ' : ''),
		'<samp>',
			this.CNY,
		'<\/samp> <span>',
			_.str.numberToPrice(Math.abs(n), b),
		'<\/span>'
	].join('');
};

//url tool - cloned to _.url
_str.isHash = function (s) {return _.str.include(s, '#'); };
_str.stripHash = function (s) {return _.str.isHash(s) ? _.str.ltrim(s, '#') : s; };
_str.isFullUrl = function (s) {return _.str.startsWith(s, 'http:\/\/') || _.str.startsWith(s, 'https:\/\/') || _.str.startsWith(s, '\/\/'); };
_str.isAbsolutePath = function (s) {return _.str.isFullUrl(s) || _.str.startsWith(s, '\/'); };

//data
_str.parseJSON = function (input) {
	function fnParseData(s) {
		if (!s) return false;
		var o = null;
		try {
			o = JSON.parse(s);
		} catch (error) {
			_.log('[Error] JSON wrong format: ' + input);
		}
		return o;
	}
	var output = null;
	if (_.str.isHash(input)) {
		var e = document.getElementById(input.slice(1));
		if (e) {
			output = fnParseData(e.innerHTML);
		} else {
			_.log('[Error] No such element: ' + input);
		}
	} else if (input && _.isString(input)) {
		output = fnParseData(input);
	} else if (_.isPlainObject(input) || _.isArray(input)) {
		output = input;
	}
	return output || false;
};

//common tool
_str.uniq = function (a) {
	var r, v = true;
	if (!_.isArray(a)) {
		v = false;
	} else {
		var o = {};
		_.each(a, function (n) {
			if (_.isString(n) || _.isNumber(n)) {
				n = n + '';
				if (n) {o[n] = null;}
			}
		});
		r = _.keys(o);
	}
	return v && r;
};
_str.each = function (s, iterator, context) {
	if (!(_.isString(s) || _.isArray(s)) || !_.isFunction(iterator)) return false;
	for (var i = 0, l = s.length; i < l; ++i) {
		iterator.call(context, s[i], i, s);
	}
};

//improve _.str.toNumber
_str.toFloat = function (s) {return parseFloat(s + '');};
_str.toInt = function (s) {return parseInt(s + '', 10);};
_str.toFixed = function (s, i) {return _.str.toFloat(_.str.toFloat(s).toFixed(i || 0));};

//regexp
_str.reEmail = /^(?:[a-z\d]+[_\-\+\.]?)*[a-z\d]+@(?:([a-z\d]+\-?)*[a-z\d]+\.)+([a-z]{2,})+$/i;
_str.reMobile = /^1[358]\d{9}$/;
_str.rePostCode = /^\d{6}$/;
_str.rePrice = /(\d)(?=(\d{3})+\.)/g;

//email
_str.encodeEmail = function (s) {return (s + '').replace('@', '[[[at]]]');};
_str.decodeEmail = function (s) {return (s + '').replace('[[[at]]]', '@');};

//chinese
_str.fullWidthLength = function (s) {
	if (_.isEmpty(s) || _.str.isBlank(s)) return 0;
	s = _.str.clean(s);
	var len = s.length;
	var count = 0;
	for (var i = 0, charCode; i < len; ++i) {
		charCode = s.charCodeAt(i);
		if (charCode < 27 || charCode > 126) count++;  //full width char
	}
	return (len + count) / 2;
};

//output
if (window._ && _.str) {
	_.extend(_.str, _str);
}

//----------------------------------------
}());
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
/*global _, $ */
/*jshint bitwise:true, eqeqeq:true, forin:true, immed:true, latedef:true, newcap:true, undef:true,
	trailing:true, smarttabs:true, sub:true, browser:true, devel:true, maxlen:150 */
////////////////////  fn  ////////////////////
(function (root) {
//----------------------------------------
var _ext = {};

//url
_ext.url = {};
_ext.url._ini = function () {
	//page type
	this.isInFrame = window.self !== window.top;

	//basic info
	this.str = location.href;
	this.host = location.hostname.toLowerCase();  //without port number
	this.path = location.pathname;
	this.query = location.search.slice(1).replace(/&+$/, '');

	//url param processing
	this._param = null;
	this.parseQuery = function(sQuery) {
		var data = {};
		if (sQuery && _.isString(sQuery)) {
			var aQ = sQuery.split('&'), aP, sN, sV;
			_.each(aQ, function(n) {
				aP = n.split('=');
				sN = aP[0];
				sV = aP[1] || '';
				if (sN /** && sV **/) {  //add this comment to keep empty key
					data[decodeURIComponent(sN).toLowerCase()] = decodeURIComponent(sV);
				}
			});
		}
		return data;
	};
	this.getParam = function (s) {  //API: var sCode = UE.url.getParam('prdcode');
		if (!this._param) {
			this._param = this.parseQuery(this.query);
		}
		return _.isString(s) ? this._param[s.toLowerCase()] : false;
	};
	this.appendParam = function (url, param) {  //append param to (sUrl || current url)
		var s = '';
		url = _.isString(url) ? url : '';
		url = _.url.removeHashFromUrl(url);
		if (_.isObject(param)) {
			param = $.param(param);
		} else if (_.isString(param)) {
			//fix param string
			if (_.str.startsWith(param, '&') || _.str.startsWith(param, '?')) {param = param.slice(1); }
		} else {
			param = null;
		}
		//append
		s = param ? url + (_.str.include(url, '?') ? '&' : '?') + param : s;
		return s || false;
	};
	this.appendParamAsPath = function (url, param) {
		var s = '';
		url = _.isString(url) ? url : '';
		url = _.url.removeHashFromUrl(url);
		if (_.isObject(param)) {  //{a:b} -> 'a/b/'
			var temp = '';
			_.each(param, function (n, i) {
				temp += (i + '/' + n + '/');
			});
			param = temp;
		} else if (_.isString(param)) {
			//fix param string: '/a/b', '/a/b/' -> 'a/b/'
			_.log(param);
			if (_.str.startsWith(param, '/')) {param = param.slice(1); }
			_.log(param);
			param = _.str.rtrim(param, '/');
			_.log(param);
			param += '/';
			_.log(param);
			if (_.str.count(param, '/') % 2) {param = null; }  //check amount of '/', it should be even
			_.log(param);
		} else {
			param = null;
		}
		//append
		if (param) {
			url += _.str.endsWith(url, '/') ? '' : '/';
			s = url + param;
		}
		return s || false;
	};

	//parse url
	var _cacheParsedUrl = {};
	var _urlParts = ['protocol', 'host', 'hostname', 'port', 'pathname', 'search', 'hash'];
	this.parseUrl = function (s, sPart) {
		if (!_.isString(s) || !_.str.isFullUrl(s)) return false;
		if (sPart && (!_.isString(sPart) || !_.include(_urlParts, sPart))) return false;
		var url = _.str.trim(s);
		var result = _cacheParsedUrl[url];
		if (!result) {
			//ini
			result = {};
			_.each(_urlParts, function (n) {
				result[n] = '';
			});
			//hash
			var iHashPos = url.indexOf('#');
			if (iHashPos > -1) {
				result.hash = url.slice(iHashPos);
				url = url.slice(0, iHashPos);
			}
			//search
			var iQuestionPos = url.indexOf('?');
			if (iQuestionPos > -1) {
				result.search = url.slice(iQuestionPos);
				url = url.slice(0, iQuestionPos);
			}
			//protocol
			var iDblSlashPos = url.indexOf('//');
			if (iDblSlashPos > -1) {
				result.protocol = url.slice(0, iDblSlashPos).replace(':', '');
				url = url.slice(iDblSlashPos + 2);
			}
			//pathname
			var iSlashPos = url.indexOf('/');
			if (iSlashPos > -1) {
				result.pathname = url.slice(iSlashPos);
				url = url.slice(0, iSlashPos);
			} else {
				result.pathname = '/';
			}
			//host & port
			var iColonPos = url.indexOf(':');
			if (iColonPos > -1) {
				result.port = url.slice(iColonPos + 1);
				result.host = url.slice(0, iColonPos);
			} else {
				result.host = url;
			}
			//clone host
			result.hostname = result.host;
			//cache
			_cacheParsedUrl[url] = result;
		}
		return sPart ? result[sPart] : result;
	};
	this.composeUrl = function (o) {
		if (!_.isPlainObject(o)) return false;
		var host = o.host || o.hostname;
		var fnCheckValue = function (sKey) {return _.isString(sKey) && _.str.trim(sKey);};
		if (!fnCheckValue(host)) return false;
		var result = [];
		result.push(fnCheckValue(o.protocol) ? _.str.trim(o.protocol) + '://' : '//');
		result.push(_.str.trim(host));
		//port
		var port = _.str.toNumber(o.port);
		result.push(port ? ':' + port : '');
		//pathname
		result.push(fnCheckValue(o.pathname) ? _.str.trim(o.pathname) : '/');
		//search
		var search = _.str.trim(o.search);
		if (fnCheckValue(search) || _.isNumber(search)) {
			search = _.str.startsWith(search, '?') ? search : '?' + search;
		} else if (_.isPlainObject(search)) {
			search = '?' + $.param(search);
		} else {
			search = '';
		}
		result.push(search);
		//hash
		var hash = _.str.trim(o.hash);
		if (hash && _.isString(hash)) {
			hash = _.str.startsWith(hash, '#') ? hash : '#' + hash;
		} else if (_.isPlainObject(hash)) {
			hash = '#' + $.param(hash);
		} else {
			hash = '';
		}
		result.push(hash);
		//output
		return result.join('');
	};

	//hash processing
	this.removeHashFromUrl = function (s) {
		return _.isString(s) && s.split('#')[0];
	};
	this.getHashFromUrl = function (s) {
		return _.url.parseUrl(s, 'hash');
	};
	this.getHashFromHref = function (s) {
		var result = false;
		if (_.isString(s)) {
			var iHashPos = s.indexOf('#');
			result = (iHashPos > -1) ? s.slice(iHashPos + 1) : '';
		}
		return result;
	};
	this.getHashFromLink = function (e) {
		var result = false;
		if (_.isElement(e) && e.tagName.toLowerCase() === 'a') {
			result = e.getAttribute('href', 2);
			result = _.str.isHash(result) ? result : this.getHashFromHref(result);
		}
		return result;
	};

	//resource loading
	this.open = function (s) {return _.isString(s) ? window.open(s) : false;};
	this.go = function (s) {return _.isString(s) ? (location.href = s) : false;};
	this.refresh = this.reload = function () {location.reload();};
	this.preloadImg = function (s) {
		var img = _.isString(s) ? new Image() : false;
		if (img) {
			var id = _.uniqueId('preloadImg');
			img.src = s;
			window[id] = img;  //avoid gc
			//todo: remove id from global
		}
		return img;
	};
	this.preload = function (/** s, fn **/) {  //to be done
		//...
	};

	//check url
	this.isHash = _.str.isHash;
	this.stripHash = _.str.stripHash;
	this.isFullUrl = _.str.isFullUrl;
	this.isAbsolutePath = _.str.isAbsolutePath;
	this.toFullUrl = function (s) {  //obviously incomplete
		s = _.isString(s) ? s : '';
		return s || false;
	};
};

//output
if (root._) {
	_.ext = _.ext || {};
	_.extend(_.ext, _ext);
}

//----------------------------------------
}(window));
/*global _, $ */
/*jshint bitwise:true, eqeqeq:true, forin:true, immed:true, latedef:true, newcap:true, undef:true,
	trailing:true, smarttabs:true, sub:true, browser:true, devel:true, maxlen:150 */
////////////////////  fn  ////////////////////
(function (root) {
//----------------------------------------
var _ext = {};

//event
_ext.event = {};
_ext.event._ini = function () {
	_.extend(this, {
		tapEventName: /** _.ua.isTouchDevice ? 'tap' : **/ 'click',  //'tap' event is still buggy in zepto 1.0rc
		dragEventName: _.ua.isTouchDevice ? 'touchmove' : 'mousemove',
		disableClick: function (sel) {
			if (sel) {
				var bindType = _.isString(sel) ? 'live' : 'on';
				$(sel)[bindType]('click', function (e) {
					e.preventDefault();
				});
			} else {
				return false;
			}
		},
		disableClickOnTouchDevice: function (sel) {  //out of date
			if (this.tapEventName !== 'click' && sel && _.ua.isTouchDevice) {
				this.disableClick(sel);
			} else {
				return false;
			}
		},
		onTap: function (sel, fn) {
			if (sel && _.isFunction(fn)) {
				var bindType = _.isString(sel) ? 'live' : 'on';
				$(sel)[bindType](this.tapEventName, fn);
				//this.disableClickOnTouchDevice(sel);  //out of date
			} else {
				return false;
			}
		},
		onShake: function (/** fn, duration **/) {
			//to be done.
		},
		iniViewportResizeEvent: function () {
			root.viewportHeight = root.innerHeight;
			var sEventNameSrc = _.ua.isIOS ? 'scroll resize orientationchange' : 'resize';
			var sEventNameOutput = 'viewportresize';
			function fnHandler() {
				var win = root;
				if (Math.abs(win.viewportHeight - win.innerHeight) > 1) {
					win.viewportHeight = win.innerHeight;
					_.defer(function (s) {
						_.dom.jWin.trigger(s);
					}, sEventNameOutput);
				}
			}
			_.dom.jWin.on(sEventNameSrc, fnHandler);
		}
	});
	this.iniViewportResizeEvent();
};

//action (and smooth jump)
_ext.action = {};
_ext.action._ini = function () {
	this._oActionList = {};
	this.ini = function () {
		var sel = _.config.selAction || 'a.cmAction, [data-action]';
		this._bind(sel);
	};
	this._bind = function (sel) {
		var _ns = this;
		_.event.onTap(sel, function (e) {
			e.preventDefault();
			//get action
			var sV = _.dom.data(this, 'action') || this.rel || '';  //[this.rel] is deprecated.
			var s = _.str.isHash(sV) ? sV : _.url.getHashFromLink(this);
			//check action
			if (s === '#' || s === '###' || s === '#none') {
				_.log('[Hint] Empty action. Do nothing.');
			} else if (_.str.isHash(s)) {
				_ns._handle(_.str.ltrim(s, '!#'), this);
			} else {
				_.log('[Error] No action assigned to this link!');
			}
		});
	};
	this._handle = function (sAction, eBtn) {
		var fn = this._oActionList[sAction];
		if (_.isFunction(fn)) {
			_.log('[Hint] action: ' + sAction);
			fn.call(eBtn || window);
		} else {
			_.log('[Error] Not found this action: ' + sAction);
		}
	};
	this.extend = function (o) {
		if (_.isObject(o)) {
			_.extend(this._oActionList, o);
		}
	};
	this.trigger = function (s, context) {
		if (_.isString(s)) {
			this._handle(s, context);
		}
	};
	this.ini();
};

//task
//_.task.on('load', fn);  //fn runs once, instantly or appended to queue.
//_.task.on('scroll', fn);  //fn runs when event triggers.
//_.task.on('resize', fn);  //fn runs when event triggers.
_ext.task = {};
_ext.task._ini = function () {
	var _ns = this;
	this._list = {
		load: [],
		scroll: [],
		resize: []
	};
	this.on = function (sEvent, fn) {
		if (!sEvent || !_.isString(sEvent) || !_.isFunction(fn)) return false;
		sEvent = _.str.clean(sEvent);
		if (_.str.include(sEvent, ' ')) {
			var aEvent = sEvent.split(' ');
			var _ns = this;
			_.each(aEvent, function (n) {
				_ns._ini(n, fn);
			});
		} else {
			this._ini(sEvent, fn);
		}
	};
	this._ini = function (sEvent, fn) {
		switch (sEvent) {
			case 'load':
				this._handleOnloadList(fn);
				break;
			case 'scroll':
				this._list[sEvent].push(fn);
				break;
			case 'resize':
				this._list[sEvent].push(fn);
				break;
			default:
				return false;
		}
	};
	this._handleOnloadList = function (fn) {
		if (_ns.pageLoaded) {
			fn();
		} else {
			this._list.load.push(fn);  //fnOnload() will handle this queue.
		}
	};
	function fnExeList(sEvent) {
		var list = _ns._list[sEvent];
		//_.log(sEvent + ' list:');
		//_.log(list);
		_.each(list, function (n) {
			n();
		});
	}
	function fnOnload() {  //this fn just runs once.
		_ns.pageLoaded = true;
		_.dom.jWin.off('load', fnOnload);
		fnExeList('load');
		_ns._list.load = null;  //gc
	}
	function fnHandleOnscrollList() {
		fnExeList('scroll');
	}
	function fnHandleOnresizeList() {
		fnExeList('resize');
	}
	//bind
	if (document.readyState === 'complete') {
		fnOnload();
	} else {
		_.dom.jWin.on('load', fnOnload);
	}
	_.dom.jWin.on('scroll', fnHandleOnscrollList);
	_.dom.jWin.on('viewportresize', fnHandleOnresizeList);
	//old api
	this.push = this.on;
};

//output
if (root._) {
	_.ext = _.ext || {};
	_.extend(_.ext, _ext);
}

//----------------------------------------
}(window));
/*global _, $ */
/*jshint bitwise:true, eqeqeq:true, forin:true, immed:true, latedef:true, newcap:true, undef:true,
	trailing:true, smarttabs:true, sub:true, browser:true, devel:true, maxlen:150 */
////////////////////  fn  ////////////////////
(function (root) {
//----------------------------------------
var _ext = {};

//ga
_ext.ga = {};
_ext.ga._ini = function () {
	root._gaq = root._gaq || [];
	this.ini = function (b) {
		root._gaq.push(['_setAccount', _.url.gaAccount]);
		root._gaq.push(['_trackPageview']);
		if (b) this.load();
	};
	this.load = function () {
		var url = '//www.google-analytics.com/ga.js';
		if (root.$LAB) {
			$LAB.script(url);
		} else {
			var eScript = document.createElement('script');
			eScript.src = url;
			var eOldScript = document.getElementsByTagName('script')[0];
			eOldScript.parentNode.insertBefore(eScript, eOldScript);
		}
	}
	this.vpv = function (s) {
		if (_.isString(s)) {
			root._gaq.push(['_trackPageview', s]);
			if (!_.str.include(s, 'vpv')) {_.log('[Warning] URL without \'vpv\'!'); }
		} else {
			_.log('[Error] Empty URL!');
			return false;
		}
	};
	this.event = function (sCatagory, sAction, sLabel) {
		if (sCatagory && sAction && _.isString(sCatagory) && _.isString(sAction)) {
			root._gaq.push(['_trackEvent', sCatagory, sAction, (sLabel || '')]);
		} else {
			_.log('[Error] Empty arguments!');
			return false;
		}
	};
};

//sns
_ext.sns = {};
_ext.sns._ini = function () {
	this._link = {
		weibo: "http://service.weibo.com/share/share.php?url=%s&title=%s&pic=%s&appkey=2264487147",
		kaixin: "http://www.kaixin001.com/~repaste/repaste.php?rurl=%s&rtitle=%s",
		renren: "http://share.renren.com/share/buttonshare.do?link=%s&title=%s"
	};
	this.getShareLink = function (site, url, text, urlPic) {
		var link = '';
		if (_.isString(site) && _.str.isFullUrl(url)) {
			var template = this._link[site];
			if (template) {
				var data = {url: encodeURIComponent(url), text: encodeURIComponent(text || '')};
				urlPic = _.str.isAbsolutePath(urlPic) ? _.url.toFullUrl(urlPic) : '';
				data.pic = encodeURIComponent(urlPic);
				link = _.str.sprintf(template, data.url, data.text, data.pic);
			} else {
				_.log('[Error] missing template!');
			}
		} else {
			_.log('[Error] wrong or missing param!');
		}
		return link || false;
	};
};

//ajax
_ext.ajax = {};
_ext.ajax._ini = function () {
	this.wait = function (fnCondition, fnCallback) {  //when condition true, trigger fn()
		//var bSuccess = false;
		if (_.isFunction(fnCondition) && _.isFunction(fnCallback)) {
			this.wait._waitList.push([fnCondition, fnCallback]);
			if (this.wait._waitList.length === 1) {  //if list is empty (loop is idle) just now, act loop
				this.wait._waitLoop();
			}
		}
		//return bSuccess;
	};
	this.wait._waitDelay = 1000;  //unit: ms
	this.wait._waitList = [];
	this.wait._waitLoop = function () {
		_.log('[Hint] ajax wait loop - start');
		_.log(this._waitList);
		_.each(this._waitList, function (n, i, arr) {
			var fnCondition = n[0];
			var fnCallback = n[1];
			var bSuccess = fnCondition();
			if (bSuccess) {
				fnCallback();
				arr[i] = null;
			}
		});
		this._waitList = _.compact(this._waitList);
		if (this._waitList.length) {
			setTimeout(function () {
				_ext.ajax.wait._waitLoop();
			}, this._waitDelay);
		}
		_.log(this._waitList);
		_.log('[Hint] ajax wait loop - end');
	};
};

//template
_ext.template = {
	_ini: function () {
		_.extend(_.templateSettings, {variable: 'data'});
		this.prefix = 'template-';
		this.lib = {};  //old
		this.libSrc = {};
		this.libFn = {};
	},
	_toTemplateId: function (id) {
		return _.str.strRight(id, this.prefix);
	},
	_toElementId: function (id) {
		var prefix = this.prefix;
		return _.str.startsWith(id, prefix) ? id : prefix + id;
	},
	remove: function (/** id **/) {
		//todo: remove template from cache (both str and fn)
		//todo: remove dummy script element
	},
	add: function (id, sTemplate) {
		if (!id || !_.isString(id)) return false;
		id = _.str.stripHash(id);
		var result;
		if (sTemplate && _.isString(sTemplate)) {
			var idTemplate = this._toTemplateId(id);
			var lib = this.lib;
			if (lib[idTemplate]) {_.log('[Warning] Template lib already has id: ' + idTemplate); }
			result = lib[idTemplate] = _.template(sTemplate);  //todo: optmize with libSrc & libFn
		} else {
			result = this._addFromDom(id);
		}
		return !!result;
	},
	_addFromDom: function (id) {  //get template from id (of dummy script element in html), then add to lib
		if (!id || !_.isString(id)) return false;
		var result;
		var idElement = this._toElementId(id);
		var e = document.getElementById(idElement);
		if (!e) {
			_.log('[Error] Element #' + idElement + ' not found!');
		} else {
			var s = e.innerHTML;
			if (s) {
				result = this.add(id, s);
			} else {
				_.log('[Error] Element #' + idElement + ' is empty!');
			}
		}
		return result || false;
	},
	render: function (id, data) {
		var result;
		if (id && _.isString(id) && data !== undefined) {
			var idTemplate = this._toTemplateId(id);
			var fn = this.lib[idTemplate];
			if (_.isFunction(fn)) {
				result = fn(data);
			}
		}
		return result || '';
	}
};

//system
_ext.system = {};
_ext.system._ini = function () {
	this.setIcon = function (o) {
		if (_.isObject(o)) {
			var jHead = _.dom.jHead || $(document.head);
			var homeScreenIcon = _.str.trim(o.homeScreenIcon || '');
			var favicon = _.str.trim(o.favicon || '');
			if (homeScreenIcon) {
				var rel = 'apple-touch-icon' + (o.precomposed ? '-precomposed' : '');
				var eLinkHomeScreenIcon = document.createElement('link');
				eLinkHomeScreenIcon.setAttribute('rel', rel);
				eLinkHomeScreenIcon.setAttribute('href', homeScreenIcon);
				jHead.append(eLinkHomeScreenIcon);
			}
			if (favicon) {
				var eLinkFavicon = document.createElement('link');
				var type = '';
				if (_.str.include(favicon, '.ico')) {
					type = 'image/x-icon';
				} else if (_.str.include(favicon, '.png')) {
					type = 'image/png';
				} else if (_.str.include(favicon, '.gif')) {
					type = 'image/gif';
				}
				eLinkFavicon.setAttribute('type', type);
				eLinkFavicon.setAttribute('rel', 'shortcut icon');
				eLinkFavicon.setAttribute('href', favicon);
				jHead.append(eLinkFavicon);
			}
		} else {
			return false;
		}
	};
};

//output
if (root._) {
	_.ext = _.ext || {};
	_.extend(_.ext, _ext);
}

//----------------------------------------
}(window));
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
};/*global _, $ */
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
	html: [
		'<div class="cmLoading">',
			'<i class="cmIcon cmX50 loading-black-bg"><b></b><b></b>Loading</i>',
		'</div>'
	].join(''),
	_prepare: function () {
		var _ns = this;
		if (!this.isReady) {
			this.j = $(this.html);
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
