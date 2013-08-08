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
