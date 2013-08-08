/*global _, $, DPL */
/*jshint bitwise:true, eqeqeq:true, forin:true, immed:true, latedef:true, newcap:true, undef:true,
	trailing:true, smarttabs:true, sub:true, browser:true, devel:true, maxlen:150 */
////////////////////  demo  ////////////////////
var DPL = DPL || {};

DPL.test = {
	ini: function () {
		this.clickEvent.ini();
		this.swipeEvent.ini();
		this.pinchEvent.ini();
		//this.shakeEvent.ini();
		this.acceleration.ini();
		this.viewportEvent.ini();
		this.viewport.ini();
	},
	recTimeToQ: function (sEvent, jResult) {
		var t = +new Date();
		jResult[0].timeQ.push([sEvent, t]);
	},
	printResult: function (jResult) {
		var a = jResult[0].timeQ;
		var jBtnPrint = jResult.closest('section').find('.print a');
		_.each(a, function (n, i) {
			var t = a[i][1];
			var tPrevEvent = (a[i - 1] || [])[1] || 0;
			var tFirstEvent = (a[0] || [])[1] || 0;
			var tDelayFromPrev = tPrevEvent ? t - tPrevEvent : 0;
			var tDelayFromFirst = tFirstEvent ? t - tFirstEvent : 0;
			jResult.append('<p>' + a[i][0] + ': +' + tDelayFromPrev + 'ms = ' + tDelayFromFirst + 'ms</p>');
		});
		jBtnPrint.addClass('disabled');
	},
	clearResult: function (jResult) {
		var jBtnPrint = jResult.closest('section').find('.print a');
		var jBtnClear = jResult.closest('section').find('.clear a');
		jResult[0].timeQ = [];
		jResult.empty();
		jBtnPrint.addClass('disabled');
		jBtnClear.addClass('disabled');
	}
};

DPL.test.clickEvent = {
	ini: function () {
		this.jWrapper = $('section.click');
		if (this.jWrapper.length) {
			this._getElem();
			this._bind();
		}
	},
	_getElem: function () {
		this.jBtnTest = this.jWrapper.find('.test a');
		this.jBtnPrint = this.jWrapper.find('.print a');
		this.jBtnClear = this.jWrapper.find('.clear a');
		this.jResult = this.jWrapper.find('.result');
	},
	_bind: function () {
		var _ns = this;
		this.jResult[0].timeQ = [];
		this.jBtnTest.bind('touchstart touchend tap longTap doubleTap click dblclick mousedown mouseup mouseover mouseout mouseenter mouseleave', function (e) {
			//e.preventDefault();
			var s = e.type;
			DPL.test.recTimeToQ(s, _ns.jResult);
			if (s === 'touchstart' || s === 'click') {
				_ns.jBtnPrint.removeClass('disabled');
				_ns.jBtnClear.removeClass('disabled');
			}
		});
		this.jBtnPrint.bind('click', function (e) {
			e.preventDefault();
			DPL.test.printResult(_ns.jResult);
		});
		this.jBtnClear.bind('click', function (e) {
			e.preventDefault();
			DPL.test.clearResult(_ns.jResult);
		});
	}
};

DPL.test.swipeEvent = {
	ini: function () {
		this.jWrapper = $('section.swipe');
		if (this.jWrapper.length) {
			this._getElem();
			this._bind();
		}
	},
	_getElem: function () {
		this.jTest = this.jWrapper.find('.test');
		this.jBtnPrint = this.jWrapper.find('.print a');
		this.jBtnClear = this.jWrapper.find('.clear a');
		this.jResult = this.jWrapper.find('.result');
	},
	_bind: function () {
		var _this = this;
		this.jResult[0].timeQ = [];
		this.jTest.on('mousedown mousemove mouseup click touchstart touchmove touchend swipe swipeLeft swipeRight swipeUp swipeDown', function (e) {
			//e.preventDefault();
			//var jThis = $(this);
			var s = e.type;
			DPL.test.recTimeToQ(s, _this.jResult);
			_this._printRealTimeResult();
			if (s === 'touchstart' || s === 'mousemove') {
				_this.jBtnClear.removeClass('disabled');
				_this.jBtnPrint.removeClass('disabled');
			}
		});
		this.jBtnPrint.bind('click', function (e) {
			e.preventDefault();
			DPL.test.printResult(_this.jResult);
		});
		this.jBtnClear.bind('click', function (e) {
			e.preventDefault();
			DPL.test.clearResult(_this.jResult);
			_this.jTest.empty();
		});
	},
	_printRealTimeResult: function () {
		var jTest = this.jTest;
		var a = this.jResult[0].timeQ;
		var len = a.length;
		var currentEventName = (a[len - 1] || [])[0] || 0;
		var lastEventName = (a[len - 2] || [])[0] || 0;
		if (currentEventName !== lastEventName) {
			var html = '';
			if ('swipe swipeLeft swipeRight swipeUp swipeDown click'.split(' ').indexOf(currentEventName) > -1) {
				html = '<b class="special">' + currentEventName + '</b><i> </i>';
			} else {
				html = '<b>' + currentEventName + '</b><i> </i>';
			}
			$(html).appendTo(jTest);
		}
	}
};

DPL.test.pinchEvent = {
	ini: function () {
		this.jWrapper = $('section.pinch');
		if (this.jWrapper.length) {
			this._getElem();
			this._bind();
		}
	},
	_getElem: function () {
		this.jTest = this.jWrapper.find('.test');
		this.jBtnPrint = this.jWrapper.find('.print a');
		this.jBtnClear = this.jWrapper.find('.clear a');
		this.jResult = this.jWrapper.find('.result');
	},
	_bind: function () {
		var _this = this;
		this.jResult[0].timeQ = [];
		this.jTest.on('touchstart touchmove touchend pinch pinchIn pinchOut', function (e) {
			//e.preventDefault();
			//var jThis = $(this);
			var s = e.type;
			DPL.test.recTimeToQ(s, _this.jResult);
			_this._printRealTimeResult();
			if (s === 'touchstart') {
				_this.jBtnClear.removeClass('disabled');
				_this.jBtnPrint.removeClass('disabled');
			}
		});
		this.jBtnPrint.bind('click', function (e) {
			e.preventDefault();
			DPL.test.printResult(_this.jResult);
		});
		this.jBtnClear.bind('click', function (e) {
			e.preventDefault();
			DPL.test.clearResult(_this.jResult);
			_this.jTest.empty();
		});
	},
	_printRealTimeResult: function () {
		var jTest = this.jTest;
		var a = this.jResult[0].timeQ;
		var len = a.length;
		var currentEventName = (a[len - 1] || [])[0] || 0;
		var lastEventName = (a[len - 2] || [])[0] || 0;
		if (currentEventName !== lastEventName || currentEventName !== 'touchmove') {  //need to log multi 'touchstart'
			var html = '';
			if ('pinch pinchIn pinchOut'.split(' ').indexOf(currentEventName) > -1) {
				html = '<b class="special">' + currentEventName + '</b><i> </i>';
			} else {
				html = '<b>' + currentEventName + '</b><i> </i>';
			}
			$(html).appendTo(jTest);
		}
	}
};

DPL.test.shakeEvent = {
	ini: function () {
		this.jWrapper = $('section.shake');
		if (this.jWrapper.length) {
			this._getElem();
			this._bind();
		}
	},
	_getElem: function () {
		this.jTest = this.jWrapper.find('.test');
		this.jBtnPrint = this.jWrapper.find('.print a');
		this.jBtnClear = this.jWrapper.find('.clear a');
		this.jResult = this.jWrapper.find('.result');
	},
	_bind: function () {
		var _this = this;
		this.jResult[0].timeQ = [];
		var paramShake = {
			interval: 0.5,
			threshold: 20
		};
		this.shake = new iPhoneShake();
		this.shake.onShake(function () {
			DPL.test.recTimeToQ('shake', _this.jResult);
			_this._printRealTimeResult();
			_this.jBtnClear.removeClass('disabled');
			_this.jBtnPrint.removeClass('disabled');
		}, paramShake);
		this.jBtnPrint.bind('click', function (e) {
			e.preventDefault();
			DPL.test.printResult(_this.jResult);
		});
		this.jBtnClear.bind('click', function (e) {
			e.preventDefault();
			DPL.test.clearResult(_this.jResult);
			_this.jTest.empty();
		});
	},
	_printRealTimeResult: function () {
		var jTest = this.jTest;
		var a = this.jResult[0].timeQ;
		var len = a.length;
		var currentEventName = (a[len - 1] || [])[0] || 0;
		//var lastEventName = (a[len - 2] || [])[0] || 0;
		var html = '<b class="special">' + currentEventName + '</b><i> </i>';
		$(html).appendTo(jTest);
	}
};

DPL.test.acceleration = {
	ini: function () {
		this.jWrapper = $('section.acceleration');
		if (this.jWrapper.length) {
			this._getElem();
			this._bind();
		}
	},
	_getElem: function () {
		this.jResult = this.jWrapper.find('.result');
		this.jResultX = this.jWrapper.find('.result .x span');
		this.jResultY = this.jWrapper.find('.result .y span');
		this.jResultZ = this.jWrapper.find('.result .z span');
	},
	_bind: function () {
		var _this = this;
		this._data = {};
		window.addEventListener('devicemotion', function (e) {
			_this._data.x = e.accelerationIncludingGravity.x;
			_this._data.y = e.accelerationIncludingGravity.y;
			_this._data.z = e.accelerationIncludingGravity.z;
			_this._printRealTimeResult();
		});
	},
	_printRealTimeResult: function () {
		var data = this._data;
		this.jResultX.text(data.x);
		this.jResultY.text(data.y);
		this.jResultZ.text(data.z);
	}
};

DPL.test.viewportEvent = {
	ini: function () {
		this.jWrapper = $('section.viewport-event');
		if (this.jWrapper.length) {
			this._getElem();
			this._bind();
			_.dom.jWin.trigger('resize');
		}
	},
	_getElem: function () {
		this.jTest = this.jWrapper.find('.test');
		this.jBtnClear = this.jWrapper.find('.clear a');
	},
	_bind: function () {
		var _this = this;
		this.jTest[0].timeQ = [];
		_.dom.jWin.on('resize orientationchange viewportresize', function (e) {
			//var jThis = $(this);
			var s = e.type;
			DPL.test.recTimeToQ(s, _this.jTest);
			_this._printRealTimeResult();
			if (s) {
				_this.jBtnClear.removeClass('disabled');
			}
		});
		this.jBtnClear.bind('click', function (e) {
			e.preventDefault();
			DPL.test.clearResult(_this.jTest);
			//_this.jTest.empty();
		});
	},
	_printRealTimeResult: function () {
		var w = _.ua.screen.getWidth();
		var h = _.ua.screen.getHeight();
		var o = _.ua.screen.getOrientation() === 'portrait' ? 'P' : 'L';
		var jTest = this.jTest;
		var a = this.jTest[0].timeQ;
		var len = a.length;
		var currentEventName = (a[len - 1] || [])[0] || 0;
		var html = [
			'<b class="special">',
				currentEventName + ': ' + w + 'x' + h + '(' + window.innerWidth + 'x' + window.innerHeight + ')@' + o,
				//currentEventName + ': ' + window.innerWidth + 'x' + window.innerHeight + ' @ ' + o,
			'</b><i> </i>'
		].join('');
		$(html).appendTo(jTest);
	}
};

DPL.test.viewport = {
	ini: function () {
		this.jWrapper = $('section.viewport');
		if (this.jWrapper.length) {
			this._getElem();
			this._bind();
		}
	},
	_getElem: function () {
		this.jBtnScroll = this.jWrapper.find('.scroll a');
		this.jBtnToggle = this.jWrapper.find('.toggle a');
		this.jBtnPrint = this.jWrapper.find('.print a');
		this.jResult = this.jWrapper.find('.result');
		this.jResultDocScrollTop = this.jResult.find('.doc.scrolltop span');
		this.jResultBodyScrollTop = this.jResult.find('.body.scrolltop span');
		this.jResultScreen = this.jResult.find('.screen span').eq(0);
		this.jResultScreenAvail = this.jResult.find('.screen.avail span');
		this.jResultWindowInner = this.jResult.find('.window.inner span');
		this.jResultWindowOuter = this.jResult.find('.window.outer span');
		this.jResultDocClient = this.jResult.find('.doc.client span');
		this.jResultDocOffset = this.jResult.find('.doc.offset span');
		this.jResultDocScroll = this.jResult.find('.doc.scroll span');
		this.jResultBodyClient = this.jResult.find('.body.client span');
		this.jResultBodyOffset = this.jResult.find('.body.offset span');
		this.jResultBodyScroll = this.jResult.find('.body.scroll span');
		//summary
		this.jResultOrientation = this.jResult.find('.orientation span');
		this.jResultWidth = this.jResult.find('.width span');
		this.jResultHeight = this.jResult.find('.height span');
	},
	_bind: function () {
		var _this = this;
		this.jBtnScroll.on('click', function () {
			DPL.page.scrollToTop();
			return false;
		});
		this.jBtnToggle.on('click', function () {
			_this.jResult.toggle();
			return false;
		});
		this.jBtnPrint.on('click', function () {
			_this.refreshData();
			return false;
		});
	},
	refreshData: function () {
		var doc = document.documentElement;
		var body = document.body;
		this.jResultDocScrollTop.text(doc.scrollTop);
		this.jResultBodyScrollTop.text(body.scrollTop);
		this.jResultScreen.text((screen.width || 0) + 'x' + (screen.height || 0));
		this.jResultScreenAvail.text((screen.availWidth || 0) + 'x' + (screen.availHeight || 0));
		this.jResultWindowInner.text((window.innerWidth || 0) + 'x' + (window.innerHeight || 0));
		this.jResultWindowOuter.text((window.outerWidth || 0) + 'x' + (window.outerHeight || 0));
		this.jResultDocClient.text((doc.clientWidth || 0) + 'x' + (doc.clientHeight || 0));
		this.jResultDocOffset.text((doc.offsetWidth || 0) + 'x' + (doc.offsetHeight || 0));
		this.jResultDocScroll.text((doc.scrollWidth || 0) + 'x' + (doc.scrollHeight || 0));
		this.jResultBodyClient.text((body.clientWidth || 0) + 'x' + (body.clientHeight || 0));
		this.jResultBodyOffset.text((body.offsetWidth || 0) + 'x' + (body.offsetHeight || 0));
		this.jResultBodyScroll.text((body.scrollWidth || 0) + 'x' + (body.scrollHeight || 0));
		this.jResultOrientation.text(_.ua.screen.getOrientation());
		this.jResultWidth.text(_.ua.screen.getWidth());
		this.jResultHeight.text(_.ua.screen.getHeight());
	}
};




////////////////////  ini  ////////////////////
$(function () {
	DPL.test.ini();
});
