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
