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
