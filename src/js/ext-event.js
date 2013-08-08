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
