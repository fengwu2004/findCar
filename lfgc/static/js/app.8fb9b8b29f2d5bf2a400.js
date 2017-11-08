webpackJsonp([1],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return networkInstance; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__idrCoreManager_js__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__idrDebug_js__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jquery__ = __webpack_require__(284);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_jquery__);
/**
 * Created by yan on 01/03/2017.
 */





var networkInstance = new idrNetworkManager()

//-------------------------
var networkdebug = false

function doAjax_debug(url, data, success) {

	__WEBPACK_IMPORTED_MODULE_2_jquery___default.a.post(url, JSON.stringify(data), function(res) {

		success && success(res)
	})
}
//-------------------------

function ajax(options) {
	//编码数据
	function setData() {
		var name, value;
		if (data) {
			if (typeof data === "string") {
				data = data.split("&");
				for (var i = 0, len = data.length; i < len; i++) {
					name = data[i].split("=")[0];
					value = data[i].split("=")[1];
					data[i] = encodeURIComponent(name) + "=" + encodeURIComponent(value);
				}
				console.log(data)
				console.log(typeof data)
				data = data.replace("/%20/g", "+");
			} else if (typeof data === "object") {
				var arr = [];
				for (var name in data) {
					if (typeof data[name] !== 'undefined') {
						var value = data[name].toString();
						name = encodeURIComponent(name);
						value = encodeURIComponent(value);
						arr.push(name + "=" + value);
					}
					
				}
				data = arr.join("&").replace("/%20/g", "+");
			}
			//若是使用get方法或JSONP，则手动添加到URL中
			if (type === "get" || dataType === "jsonp") {
				url += url.indexOf("?") > -1 ? (url.indexOf("=")>-1 ? "&"+data : data ): "?" + data;
			}
		}
	}
	// JSONP
	function createJsonp() {
		var script = document.createElement("script"),
			timeName = new Date().getTime() + Math.round(Math.random() * 1000),
			callback = "JSONP_" + timeName;
		
		window[callback] = function(data) {
			clearTimeout(timeout_flag);
			document.body.removeChild(script);
			success(data);
		}
		script.src = url +  (url.indexOf("?") > -1 ? "&" : "?") + "callback=" + callback;
		script.type = "text/javascript";
		document.body.appendChild(script);
		setTime(callback, script);
	}
	//设置请求超时
	function setTime(callback, script) {
		if (timeOut !== undefined) {
			timeout_flag = setTimeout(function() {
				if (dataType === "jsonp") {
					// delete window[callback];
					document.body.removeChild(script);
					
				} else {
					timeout_bool = true;
					xhr && xhr.abort();
				}
				console.log("timeout");
				error && error('请求超时!');
				
			}, timeOut);
		}
	}
	// XHR
	function createXHR() {
		//由于IE6的XMLHttpRequest对象是通过MSXML库中的一个ActiveX对象实现的。
		//所以创建XHR对象，需要在这里做兼容处理。
		function getXHR() {
			if (window.XMLHttpRequest) {
				return new XMLHttpRequest();
			} else {
				//遍历IE中不同版本的ActiveX对象
				var versions = ["Microsoft", "msxm3", "msxml2", "msxml1"];
				for (var i = 0; i < versions.length; i++) {
					try {
						var version = versions[i] + ".XMLHTTP";
						return new ActiveXObject(version);
					} catch (e) {}
				}
			}
		}
		//创建对象。
		xhr = getXHR();
		xhr.open(type, url, async);
		//设置请求头
		if (type === "post" && !contentType) {
			//若是post提交，则设置content-Type 为application/x-www-four-urlencoded
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
		} else if (contentType) {
			xhr.setRequestHeader("Content-Type", contentType);
		}
		//添加监听
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				if (timeOut !== undefined) {
					//由于执行abort()方法后，有可能触发onreadystatechange事件，
					//所以设置一个timeout_bool标识，来忽略中止触发的事件。
					if (timeout_bool) {
						return;
					}
					clearTimeout(timeout_flag);
				}
				if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
					
					success(xhr.responseText);
				} else {
					error(xhr.status, xhr.statusText);
				}
			}
		};
		//发送请求
		xhr.send(type === "get" ? null : data);
		setTime(); //请求超时
	}
	
	var url = options.url || "", //请求的链接
		type = (options.type || "get").toLowerCase(), //请求的方法,默认为get
		data = options.data || null, //请求的数据
		contentType = options.contentType || "", //请求头
		dataType = options.dataType || "", //请求的类型
		async = options.async === undefined && true, //是否异步，默认为true.
		timeOut = options.timeOut, //超时时间。
		before = options.before || function() {}, //发送之前执行的函数
		error = options.error || function() {}, //错误执行的函数
		success = options.success || function() {}; //请求成功的回调函数
	var timeout_bool = false, //是否请求超时
		timeout_flag = null, //超时标识
		xhr = null; //xhr对角
	setData();
	before();
	if (dataType === "jsonp") {
		createJsonp();
	} else {
		createXHR();
	}
};

function doAjax(url, data, successFn, failedFn) {
	
	console.log('网络请求' + url)
	
	if (data) {
		
		ajax({
			
			type: "get",
			
			dataType: 'jsonp',
			
			url: url, //添加自己的接口链接
			
			data: data,
			
			timeOut: 10000,
			
			before:function () {
			
			},
			
			success:function (response) {
				
				console.log('请求成功' + url)
				
				if (response != null && response.code == "success") {
					
					successFn && successFn(response)
				}
				else {

				    if (failedFn) {

                        failedFn && failedFn(response);
                    }
                    else {

                        console.log(JSON.stringify(response))
                    }
				}
			},
			
			error:function (response) {

                if (failedFn) {

                    failedFn && failedFn(response);
                }
                else {

                    console.log(JSON.stringify(response))
                }
			}
		});
	}
	else {
		
		ajax({
			
			type: "get",
			
			dataType: 'jsonp',
			
			url: url, //添加自己的接口链接
			
			timeOut: 10000,
			
			before:function () {
			
			},
			
			success:function (response) {
				
				if (response != null && response.code == "success") {
					
					successFn && successFn(response)
				}
				else {

                    if (failedFn) {

                        failedFn && failedFn(response);
                    }
                    else {

                        console.log(JSON.stringify(response))
                    }
				}
			},
			
			error:function (response) {

                if (failedFn) {

                    failedFn && failedFn(response);
                }
                else {

                    console.log(JSON.stringify(response))
                }
			}
		});
	}
}

function idrNetworkManager() {
	
	this.host = 'https://wx.indoorun.com/'
	
	this.debug_host = 'http://192.168.1.107:8888/'

    var ua = navigator.userAgent

    if (ua.match(/iPhone|iPod/i) != null) {

	    this.osType = 'iPhone'
    }
    else if (ua.match(/Android/i) != null) {

	    this.osType = 'Android'
    }
    else {

        this.osType = 'unknow'
    }
}

idrNetworkManager.prototype.doAjax = function(url, data, successFn, failedFn) {

    // idrDebug.showDebugInfo(true)
	
	data.appId = __WEBPACK_IMPORTED_MODULE_0__idrCoreManager_js__["a" /* default */].appId
	
	data.sessionKey = __WEBPACK_IMPORTED_MODULE_0__idrCoreManager_js__["a" /* default */].sessionKey
	
	data.clientId = __WEBPACK_IMPORTED_MODULE_0__idrCoreManager_js__["a" /* default */].clientId
	
	doAjax(url, data, successFn, failedFn)
}

idrNetworkManager.prototype.serverCallWxAuth = function(success, failed) {
	
	var url = this.host + 'wxauth/getAuthParas?reqUrl=' + window.location.href;
	
	doAjax(url, null, success, failed)
}

idrNetworkManager.prototype.serverCallInitSession = function(url, success, failed) {
	
	if (false) {
		
		var url = this.debug_host + 'wx/initSession.html'
		
		doAjax_debug(url, {}, success, failed)
	}
	else {
		
		doAjax(url, {}, success, failed)
	}
}

idrNetworkManager.prototype.serverCallWXSign = function(data, success, failed) {

    if (false) {
		
		var url = this.debug_host + 'wx/getSign.html'
		
		doAjax_debug(url, data, success, failed)
	}
	else {
		
		var url = this.host + 'wx/getSign.html'

		this.doAjax(url, data, success, failed)
	}
}

idrNetworkManager.prototype.serverCallRegionPathData = function (regionId, success, failed) {
	
	var url = this.host + 'wx/getRegionPathData';
	
	var data = {
		'regionId': regionId
	};
	
	this.doAjax(url, data, success, failed)
}

idrNetworkManager.prototype.serverCallRegionAllInfo = function (regionId, success, failed) {
	
	var url = this.host + 'wx/getRegionData';
	
	var data = {
		'regionId': regionId
	};
	
	this.doAjax(url, data, success, failed)
}

idrNetworkManager.prototype.getMarkedUnit = function(regionId, success, failed) {

    if (false) {
		
		var url = this.debug_host + 'chene/getCheLocation.html'
		
		var data = {

            regionId:regionId
		}
		
		doAjax_debug(url, data, success, failed)
	}
	else {
		
		var url = this.host + 'chene/getCheLocation.html'

		var data = {

            regionId:regionId
		}

		this.doAjax(url, data, success, failed)
	}
}

idrNetworkManager.prototype.removeMarkedUnit = function(regionId, success, failed) {
	
	var url = this.host + 'chene/removeCheLocation.html'
	
	var data = {

        regionId:regionId
	}
	
	this.doAjax(url, data, success, failed)
}

idrNetworkManager.prototype.saveMarkedUnit = function(unit, success, failed) {
	
	var pos = unit.getPos()
	
	var unitInJson = JSON.stringify({svgX:pos.x, svgY:pos.y, floorId:unit.floorId, regionId:unit.regionId})
	
	var url = this.host + 'chene/saveCheLocation.html'
	
	var data = {
		'sName': unitInJson
	};
	
	this.doAjax(url, data, success, failed)
}

idrNetworkManager.prototype.getParkingPlaceUnitByCarNo = function(carNo, regionId, success, failed) {
	
	if (false) {
		
		var url = this.debug_host + 'chene/getParkingPlaceUnitByCarNo.html'

		var data = {
			'regionId': regionId,
			'carNo': carNo,
		}

		doAjax_debug(url, data, success, failed)
	}
	else {
		
		var url = this.host + 'chene/getParkingPlaceUnitByCarNo.html'
		
		var data = {
			'regionId': regionId,
			'carNo': carNo,
		}
		
		this.doAjax(url, data, success, failed)
	}
}

idrNetworkManager.prototype.serverCallLocatingBin = function(beacons, count, regionId, floorId, success, failed) {

    if (networkdebug) {

        var url = this.debug_host + 'wx/locate/locating';

        var data = {
            'regionId': regionId
        };

        // idrDebug.debugInfo('请求定位')

        doAjax_debug(url, data, success, failed)
    }
    else {

        if (!__WEBPACK_IMPORTED_MODULE_0__idrCoreManager_js__["a" /* default */].isAppEnd) {

            if (count <= 0) {

                return
            }
        }

        var data = {
            'version':1,
            'beacons': beacons,
            'gzId': 'ewr2342342',
            'openId': 'wx_oBt8bt-1WMXu67NNZI-JUNQj6UAc',
            'OSType': this.osType,
            'regionId': regionId,
            'floorId': floorId,
            'beaconCount':count
        }

        if (__WEBPACK_IMPORTED_MODULE_0__idrCoreManager_js__["a" /* default */].isAppEnd) {

            if (beacons && count) {

                data = {
                    'version':1,
                    'beacons': beacons,
                    'gzId': 'ewr2342342',
                    'openId': 'wx_oBt8bt-1WMXu67NNZI-JUNQj6UAc',
                    'OSType': this.osType,
                    'regionId': regionId,
                    'floorId': floorId,
                    'beaconCount':count
                }
            }
            else {

                data = {
                    'version':1,
                    'beacons': '',
                    'gzId': 'ewr2342342',
                    'openId': 'wx_oBt8bt-1WMXu67NNZI-JUNQj6UAc',
                    'OSType': this.osType,
                    'regionId': regionId,
                    'floorId': floorId,
                    'beaconCount':count
                }
            }
        }

        var url = this.host + 'locate/locatingBin';

        this.doAjax(url, data, success, failed)
    }
}



/***/ }),
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return intance; });
function DebugManager() {
	
	this.label = document.getElementById('debug')
	
	this.debugInfo = function(str) {
		
		this.label.innerText = str
	}
	
	this.showDebugInfo = function(show) {
		
		if (show) {
		
			this.label.style.visibility = 'visible'
		}
		else {
			
			this.label.style.visibility = 'hidden'
		}
	}
}

var intance = new DebugManager()



/***/ }),
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return idrCoreMgr; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__idrNetworkManager_js__ = __webpack_require__(7);
/**
 * Created by yan on 08/02/2017.
 */



function idrCoreManager() {
    
    this.appId = ''
    
    this.clientId = ''
    
    this.time = 'null'
    
    this.sign = 'null'
    
    this.sessionKey = ''

    this.isAppEnd = false

    this.isAndroid = false
    
    var self = this

    function initWx(appid, initSuccessFunc, initFailedFunc) {
        
        self.appId = appid
    
        __WEBPACK_IMPORTED_MODULE_0__idrNetworkManager_js__["a" /* default */].serverCallWXSign({'appId': appid}, function(data) {

            self.clientId = data.clientId

            success(initSuccessFunc, initFailedFunc);
        
        }, function(str) {
        
            initFailedFunc && initFailedFunc(str)
        })
    }

    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURI(r[2]);
        }
        return null;
    }
    
    function initApp(appid, initSuccessFunc, initFailedFunc) {

        self.appId = appid

        self.clientId = getQueryString('mac')

        var android = getQueryString('android')

        self.isAndroid = (android != null)

        success(initSuccessFunc, initFailedFunc)
    }
    
    function success(succFn, errorFn) {
        
        if (typeof succFn !== 'function') {
            
            return
        }

        var str = 'appId=' + self.appId + '&clientId=' + self.clientId + '&time=' + self.time + '&sign=' + self.sign
        
        var url = __WEBPACK_IMPORTED_MODULE_0__idrNetworkManager_js__["a" /* default */].host + 'wx/initSession.html?' + str;
        
        __WEBPACK_IMPORTED_MODULE_0__idrNetworkManager_js__["a" /* default */].serverCallInitSession(url, function(data) {
    
            self.sessionKey = data.sessionKey;

            data.code === 'failed' ? (errorFn && errorFn(data)) : succFn && succFn(data);
            
        }, function() {

            errorFn && errorFn();
        })
    }

    this.init = function (appid, initSuccessFunc, initFailedFunc) {

        if (!this.isAppEnd) {

            initWx(appid, initSuccessFunc, initFailedFunc)
        }
        else {

            initApp(appid, initSuccessFunc, initFailedFunc)
        }
    }
}

var idrCoreMgr = new idrCoreManager();



/***/ }),
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return idrUnit; });
/**
 * Created by ky on 17-5-4.
 */
function idrUnit(unitInfo) {
    
    for (var key in unitInfo) {
        
        this[key] = unitInfo[key]
    }
    
    var that = this
    
    this.getPos = function() {
        
        var x = 0.5 * (that.boundLeft + that.boundRight)
        
        var y = 0.5 * (that.boundTop + that.boundBottom)
        
        return {x:x, y:y, floorId:that.floorId}
    }
    
    var _pts = null
    
    function getPts() {
        
        if (_pts) {
            
            return _pts
        }
        
        var pts = getPolygon().split(' ')
        
        _pts = []
        
        for (var i = 0; i < pts.length; ++i) {
            
            var p = pts[i].split(',').map(Number)
            
            var temp = YFM.Math.Vector.pos(p[0], p[1])
            
            _pts.push(temp)
        }
        
        return _pts
    }
    
    function getPolygon() {
        
        if (that.points) {
            
            return that.points
        }
        
        var left = that.boundLeft
        
        var top = that.boundTop
        
        var right = that.boundRight
        
        var bottom = that.boundBottom
        
        that.points = left + ',' + top + ' ' + right + ',' + top + ' ' + right + ',' + bottom + ' ' + left + ',' + bottom
        
        return that.points
    }
    
    this.color = null
    
    this.getPolygon = getPolygon
    
    this.getPts = getPts
}



/***/ }),
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Position; });

function Position() {
    
    this.x = 0;
    
    this.y = 0;
}

Position.prototype.getX = function() {
    
    return this.x;
}

Position.prototype.setX = function(x) {
    
    this.x = x;
}

Position.prototype.getY = function() {
    
    return this.y;
}

Position.prototype.setY = function(y) {
    
    this.y = y;
}

Position.prototype.hashCode = function() {
    
    return this.x + this.y;
}

Position.prototype.equals = function(obj) {
    
    if (obj == null || !(obj instanceof Position)) {
        
        return false;
    }
    
    if (this.x != pos.x || this.y != pos.y) {
        
        return false;
    }
    
    
    return true;
}

Position.prototype.compareTo = function(o) {
    
    if (this.getX() < o.getX()) {
        return -1;
    }
    else if (this.getX() > o.getX()) {
        return 1;
    }
    else if (this.getY() < o.getY()) {
        return -1;
    }
    else if (this.getY() > o.getY()) {
        return 1;
    }
    else {
        return 0;
    }
}

Position.prototype.string = function() {
    
    return this.x + "," + this.y;
}



/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = {
  NODE_ENV: '"production"'
}


/***/ }),
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/img/car.25606e2.png";

/***/ }),
/* 80 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IDRMarkers; });

function IDRMapMarker(pos, icon) {
    
    this.position = pos
    
    this.id = null
    
    this.image = icon
    
    this.className = 'IDRMapMarker'
    
    this.el = null
    
    this.resetPosition = function(p) {
        
        this.position = p
    }
}

function IDRCarMarker(pos, icon) {
    
    IDRMapMarker.call(this, pos, icon)
    
    this.className = 'IDRCarMarker'
}

function IDRFacMarker(pos, icon) {
    
    IDRMapMarker.call(this, pos, icon)
    
    this.className = 'IDRFacMarker'
}

function IDRStartMarker(pos, icon) {
    
    IDRMapMarker.call(this, pos, icon)
    
    this.className = 'IDRStartMarker'
}

function IDREndMarker(pos, icon) {
    
    IDRMapMarker.call(this, pos, icon)
    
    this.className = 'IDREndMarker'
}

function IDRTempMarker(pos, icon) {
	
	IDRMapMarker.call(this, pos, icon)
	
	this.className = 'IDRTempMarker'
}

function IDRTreasureboxMarker(pos, icon) {

    IDRMapMarker.call(this, pos, icon)

    this.className = 'IDRTreasureboxMarker'
}

function IDROpenedTreasureboxMarker(pos, icon) {

    IDRMapMarker.call(this, pos, icon)

    this.className = 'IDROpenedTreasureboxMarker'
}

var IDRMarkers = {
    "IDRMapMarker":IDRMapMarker,
    "IDRCarMarker":IDRCarMarker,
    "IDRFacMarker":IDRFacMarker,
    "IDRStartMarker":IDRStartMarker,
    "IDREndMarker":IDREndMarker,
    "IDRTempMarker":IDRTempMarker,
    "IDRTreasureboxMarker":IDRTreasureboxMarker,
    "IDROpenedTreasureboxMarker":IDROpenedTreasureboxMarker
}



/***/ }),
/* 81 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return instance; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__idrNetworkManager_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__idrDebug__ = __webpack_require__(12);
/**
 * Created by yan on 20/02/2017.
 */
/**
 * Created by Sorrow.X on 2016/9/20.
 * beacons.js  蓝牙功能模块
 */




function idrBeaconMgr() {

  this.initSuccess = false

  this.onBeaconReceiveFunc = null

  var self = this
  
  function promiseOfWxAuth() {

    return new Promise((resolve, reject) => {

      __WEBPACK_IMPORTED_MODULE_0__idrNetworkManager_js__["a" /* default */].serverCallWxAuth(data => {

        resolve(data)

      }, data => {

        reject(data)
      })
    })
  }

  function promiseOfConfigWx(res) {

    return new Promise((resolve, reject) => {

      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: res.appId, // 必填，公众号的唯一标识
        timestamp: res.timestamp, // 必填，生成签名的时间戳
        nonceStr: res.nonceStr, // 必填，生成签名的随机串
        signature: res.signature, // 必填，签名，见附录1
        jsApiList: [    // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          'checkJsApi',
          'getNetworkType',
          'getLocation',
          'startSearchBeacons',
          'onSearchBeacons',
          'stopSearchBeacons',
          'onMenuShareAppMessage',
          'onMenuShareTimeline',
          'getNetworkType',
          'scanQRCode',
          'onMenuShareQZone'
        ]
      })

      wx.ready(function () {

        resolve()
      })

      wx.error(function (res) {

        reject(res)
      })
    })
  }
  
  function promiseOfStopSearchBeacons() {

    return new Promise(resolve => {
      wx.stopSearchBeacons({
        complete: argv => { resolve(argv.errMsg) }
      })
    })
  }

  function promiseOfStartSearchBeacons() {

    return new Promise(resolve => {
      wx.startSearchBeacons({
        ticket:"",
        complete: argv => {
          if (argv.errMsg == 'startSearchBeacons:bluetooth power off') {

            resolve(0)
          }
          else {

            resolve()
          }
        }
      })
    })
  }

  function init(resolve, reject) {

    if (self.initSuccess) {

      promiseOfStopSearchBeacons()
        .then(() => {

          return promiseOfStartSearchBeacons()
        })
        .then(res => {

          resolve(res)
        })
        .catch(res => {

          resolve(res)
        })

      return
    }

    promiseOfWxAuth()
      .then(res => {

        return promiseOfConfigWx(res)
      })
      .then(() => {

        self.initSuccess = true

        wx.onSearchBeacons({
          complete: argv => {
            var beacons = argv.beacons;
            self.onBeaconReceiveFunc && self.onBeaconReceiveFunc(beacons);
          }
        })

        return promiseOfStartSearchBeacons()
      })
      .then(res => {

        resolve(res)
      })
      .catch(res => {

        reject && reject(res)
      })
  }

  this.init = init
}

var instance = new idrBeaconMgr()



/***/ }),
/* 82 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return idrLocateServerInstance; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__idrBeaconManager_js__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__idrDebug__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__idrCoreManager__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__idrNetworkManager_js__ = __webpack_require__(7);
/**
 * Created by yan on 23/02/2017.
 */







function idrLocateServer() {

  var _floorId = ''

  var _beacons = null

  var _count = 0

  var _regionId = ''

  var _x = 0

  var _y = 0

  var _started = false

  var _onLocateSuccess = null

  var _onLocateFailed = null

  var _locateTimerId = null

  this.onCheckSpeacialBeacons = null

  var self = this

  function getValidBeacons(beacons) {

    var temp = []

    for (var i = 0; i < beacons.length; ++i) {

      if (parseInt(beacons[i].rssi) !== 0) {

        temp.push(beacons[i])
      }
    }

    return temp
  }

  this.test = function () {

    console.log('test调用')
  }

  function filterbeacons(inBeacons) {

    var beacons = getValidBeacons(inBeacons)

    var newBeacons = ''

    for (var i = 0; i < beacons.length; ++i) {

      var beacon = beacons[i];

      var major = parseInt(beacon.major)

      var minor = parseInt(beacon.minor)

      var rssi = parseInt(beacon.rssi)

      var accuracy = parseInt(beacon.accuracy * 100)

      var v0 = String.fromCharCode(accuracy & 0x00ff)

      var v1 = String.fromCharCode((accuracy & 0xff00) >> 8)

      var v2 = String.fromCharCode(rssi + 256)

      var v3 = String.fromCharCode(minor & 0x00ff)

      var v4 = String.fromCharCode((minor & 0xff00) >> 8)

      var v5 = String.fromCharCode(major & 0x00ff)

      var v6 = String.fromCharCode((major & 0xff00) >> 8)

      var value = v6 + v5 + v4 + v3 + v2 + v1 + v0

      newBeacons = newBeacons + value
    }

    return {beacons:newBeacons, count:beacons.length};
  }

  function onReceiveBeacons(beacons) {

    var tempBeacons = beacons

    if (__WEBPACK_IMPORTED_MODULE_2__idrCoreManager__["a" /* default */].isAndroid) {

      tempBeacons = JSON.parse(beacons)
    }

    var newBeacons = filterbeacons(tempBeacons)

    self.onCheckSpeacialBeacons && self.onCheckSpeacialBeacons(tempBeacons)

    _beacons = window.btoa(newBeacons.beacons)

    _count = newBeacons.count
  }

  function onServerLocate() {

    __WEBPACK_IMPORTED_MODULE_3__idrNetworkManager_js__["a" /* default */].serverCallLocatingBin(_beacons, _count, _regionId, _floorId, function(res) {

      _x = res.x

      _y = res.y

      _floorId = res.floorId

      if (typeof _onLocateSuccess === 'function') {

        _onLocateSuccess({x:_x, y:_y, floorId:_floorId, regionId:_regionId});
      }

    }, function (str) {

      if (typeof _onLocateFailed === 'function') {

        _onLocateFailed(str)
      }
    })
  }

  function startWxLocate() {

    __WEBPACK_IMPORTED_MODULE_0__idrBeaconManager_js__["a" /* default */].onBeaconReceiveFunc = onReceiveBeacons

    __WEBPACK_IMPORTED_MODULE_0__idrBeaconManager_js__["a" /* default */].init(res => {

      if (res === 0) {

        _onLocateFailed(0)
      }
      else {

        _started = true
      }
    }, res => {

      _started = false

      console.log(res)
    })

    if (_locateTimerId != null) {

      clearInterval(_locateTimerId)

      _locateTimerId = setInterval(onServerLocate, 1000)
    }
  }

  this.start = function (regionId, floorId, onLocateSuccess, onLocateFailed) {

    _regionId = regionId

    _floorId = floorId

    _onLocateFailed = onLocateFailed

    _onLocateSuccess = onLocateSuccess

    if (!__WEBPACK_IMPORTED_MODULE_2__idrCoreManager__["a" /* default */].isAppEnd) {

      startWxLocate()
    }

    _locateTimerId = setInterval(onServerLocate, 1000)
  }

  this.stop = function () {

    clearInterval(_locateTimerId)

    _started = false

    _beacons = null
  }

  this.setStartFailed = function () {

    _started = false
  }

  this.isStart = function() {

    return _started
  }

  this.onReceiveBeacons = onReceiveBeacons
}

var idrLocateServerInstance = new idrLocateServer()

window.locateServer = idrLocateServerInstance



/***/ }),
/* 83 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IDRRegionEx; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__idrUnit__ = __webpack_require__(42);
/**
 * Created by ky on 17-4-21.
 */



function IDRRegionEx(regionAllInfo) {
	
	for (var key in regionAllInfo) {
		
		this[key] = regionAllInfo[key]
	}

    this.floorList.reverse()
	
	var floorList = this.floorList

    var t = new Date()

	for (var i = 0; i < this.floorList.length; ++i) {
		
		var unitList = this.floorList[i].unitList
		
		var units = []

        var floorName = this.floorList[i].name
		
		for (var j = 0; j < unitList.length; ++j) {

		    var idrunit = new __WEBPACK_IMPORTED_MODULE_0__idrUnit__["a" /* default */](unitList[j])

            idrunit.floorName = floorName

			units.push(idrunit)
		}

		delete this.floorList[i].unitList
		
		this.floorList[i].unitList = units
	}

	console.log('加载unit时间' + (new Date().getTime() - t.getTime()).toString())

	function getFloorName(floorId) {

        for (var i = 0; i < floorList.length; ++i) {

            var floor = floorList[i]

            if (floor.id === floorId) {

                return floor.name
            }
        }

        return ''
    }
	
	function getFloorIndex(floorId) {
		
		for (var i = 0; i < floorList.length; ++i) {
			
			var floor = floorList[i]
			
			if (floor.id === floorId) {
				
				return floor.floorIndex
			}
		}
		
		return null
	}
	
	function getFloorbyId(floorId) {
		
		for (var i = 0; i < floorList.length; ++i) {
			
			var floor = floorList[i]
			
			if (floor.id === floorId) {
				
				return floor
			}
		}
		
		return null
	}
	
	function getUnitById(floorId, unitId) {
		
		var floor = getFloorbyId(floorId)
		
		if (floor == null) {
			
			return null
		}
		
		for (var i = 0; i < floor.unitList.length; ++i) {
			
			var unit = floor.unitList[i]
			
			if (unit.id === unitId) {
				
				return unit
			}
		}
		
		return null
	}
	
	function getDistance(pos1, pos2) {
		
		return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2))
	}
	
	function getNearUnit(pos, unitList) {
		
		if (!pos || !pos.floorId) {
			
			return null
		}

		if (!unitList) {

            var floor = getFloorbyId(pos.floorId)

            unitList = floor.unitList
        }

		var result = null, mindis = 10000
		
		for (var i = 0; i < unitList.length; ++i) {
			
			var unit = unitList[i]

            if (unit.floorId !== pos.floorId) {

			    continue
            }
			
			var dis = getDistance(pos, unit.getPos())
			
			if (dis < mindis) {
				
				mindis = dis
				
				result = unit
			}
		}
		
		return result
	}
	
	function getAllUnits(currnetFloorId) {
		
		var results = []
		
		for (var i = 0; i < this.floorList.length; ++i) {
			
			var units = this.floorList[i].unitList
			
			for (var j = 0; j < units.length; ++j) {
				
				if (units[j].unitTypeId != '0') {
					
					continue
				}
				
				results.push(units[j])
			}
		}
		
		return results
	}
	
	this.getFloorbyId = getFloorbyId
	
	this.getUnitById = getUnitById
	
	this.getFloorIndex = getFloorIndex
	
	this.getNearUnit = getNearUnit
	
	this.getAllUnits = getAllUnits
}



/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname) {// see http://vuejs-templates.github.io/webpack for documentation.
var path = __webpack_require__(229)

var build_assetsPublicPath = 'http://wx.indoorun.com/indoorun/webapp/lfgc/'
// var build_assetsPublicPath = 'http://wx.indoorun.com/indoorun/test/app/guozheng2/'
var dev_assetsPublicPath = '/'

module.exports = {
  build: {
    env: __webpack_require__(44),
    index: path.resolve(__dirname, '../lfgc/index.htm'),
    assetsRoot: path.resolve(__dirname, '../lfgc'),
    assetsSubDirectory: 'static',
    assetsPublicPath:build_assetsPublicPath,
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: __webpack_require__.i({"NODE_ENV":"production"}).npm_config_report
  },
  dev: {
    env: __webpack_require__(102),
    port: 8080,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: dev_assetsPublicPath,
    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  },
  publicPath: true
    ? build_assetsPublicPath
    : '.'
}

/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }),
/* 85 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AlertBox; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_alertbox_vue__ = __webpack_require__(242);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_alertbox_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__components_alertbox_vue__);



function AlertBox() {

  var _vm = null;

  function load() {

    _vm = new __WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */]({
      el: '#alertbox',
      components: { alertbox: __WEBPACK_IMPORTED_MODULE_1__components_alertbox_vue___default.a },
      data: function data() {
        return {
          title: '',
          message: '',
          buttons: []
        };
      }
    });
  }

  function hide() {

    if (_vm) {

      _vm.$el.style.visibility = 'hidden';
    }
  }

  function show(title, message, buttons) {

    if (!_vm) {

      load();

      _vm.title = title;

      _vm.message = message;

      _vm.buttons = buttons;

      return;
    }

    _vm.title = title;

    _vm.message = message;

    _vm.buttons = buttons;

    _vm.$el.style.visibility = 'visible';
  }

  this.show = show;

  this.hide = hide;
}



/***/ }),
/* 86 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BottomBar; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_bottombar_vue__ = __webpack_require__(243);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_bottombar_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__components_bottombar_vue__);



function BottomBar() {

  var _vm = null;

  function load() {

    _vm = new __WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */]({
      el: '#bottombar',
      components: { bottombar: __WEBPACK_IMPORTED_MODULE_1__components_bottombar_vue___default.a },
      data: function data() {
        return {
          message: ''
        };
      }
    });
  }

  function show(bShow, message) {

    if (!_vm) {

      if (!bShow) {

        return;
      }

      load();

      _vm.message = message;

      return;
    }

    if (bShow) {

      _vm.$el.style.visibility = 'visible';

      _vm.message = message;
    } else {

      _vm.$el.style.visibility = 'hidden';
    }
  }

  this.show = show;
}



/***/ }),
/* 87 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ErrorTipView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_errortipview_vue__ = __webpack_require__(244);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_errortipview_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__components_errortipview_vue__);



function ErrorTipView() {

  var _vm = null;

  var _message = '';

  function load() {

    _vm = new __WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */]({
      el: '#errortip',
      components: { errortipview: __WEBPACK_IMPORTED_MODULE_1__components_errortipview_vue___default.a },
      data: function data() {
        return {
          message: _message,
          display: 1
        };
      }
    });
  }

  function show(message) {

    _message = message;

    if (!_vm) {

      load();

      setTimeout(function () {

        _vm.display = 0;
      }, 1000);

      return;
    }

    _vm.display = 1;

    _vm.message = message;

    _vm.$el.style.visibility = 'visible';

    setTimeout(function () {

      _vm.display = 0;

      setTimeout(function () {

        _vm.$el.style.visibility = 'hidden';
      }, 1000);
    }, 1000);
  }

  this.show = show;
}



/***/ }),
/* 88 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FindFacilityView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_findfacilityview_vue__ = __webpack_require__(246);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_findfacilityview_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__components_findfacilityview_vue__);



var futi = {
  type: 1,
  title: '扶梯',
  icon: './static/futi.png'
};

var dianti = {

  type: 2,
  title: '电梯',
  icon: './static/dianti.png'
};

var xishoujian = {
  type: 3,
  title: '洗手间',
  icon: './static/cesuo.png'
};

var atm = {
  type: 4,
  title: 'ATM',
  icon: './static/ATM.png'
};

var chukou = {
  type: 5,
  title: '出口',
  icon: './static/chukou.png'
};

var rukou = {
  type: 7,
  title: '入口',
  icon: './static/rukou.png'
};

var anquanchukou = {
  type: 8,
  title: '安全出口',
  icon: './static/people.png'
};

var louti = {
  type: 9,
  title: '楼梯',
  icon: './static/louti.png'
};

var xiche = {
  type: 10,
  title: '洗车',
  icon: './static/xiche.png'
};

var shoufeichu = {
  type: 11,
  title: '收费处',
  icon: './static/shoufeichu.png'
};

function getIcons(type) {

  if (type == 1) return futi;

  if (type == 2) return dianti;

  if (type == 3) return xishoujian;

  if (type == 4) return atm;

  if (type == 5) return chukou;

  if (type == 7) return rukou;

  if (type == 8) return anquanchukou;

  if (type == 9) return louti;

  if (type == 10) return xiche;

  if (type == 11) return shoufeichu;
}

function FindFacilityView(map) {

  var _vm = null;

  var _facilitys = null;

  var _icons = [];

  function getFacilitys() {

    _facilitys = map.findUnitsWithType([1, 2, 3, 4, 5, 7, 8, 9, 10, 11]);

    _icons.length = 0;

    for (var key in _facilitys) {

      _icons.push(getIcons(key));
    }
  }

  function onNavigateTo(unitType) {

    if (!(unitType in _facilitys)) {

      return;
    }

    var units = _facilitys[unitType];

    if (units.length == 0) {

      return;
    }

    var unit = units[0];

    map.doRoute(map.getUserPos(), unit.getPos());
  }

  function show() {

    getFacilitys();

    if (!_vm) {

      _vm = new __WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */]({
        el: '#findfacility',
        components: { findfacilityview: __WEBPACK_IMPORTED_MODULE_1__components_findfacilityview_vue___default.a },
        data: function data() {
          return {
            facilitys: _icons
          };
        },
        methods: {
          onNavigateTo: onNavigateTo
        }
      });
    } else {

      _vm.$el.style.visibility = 'visible';
    }
  }

  this.show = show;
}



/***/ }),
/* 89 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FindFacilityView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_publicfacility_vue__ = __webpack_require__(248);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_publicfacility_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__components_publicfacility_vue__);



function FindFacilityView(cb) {

  var _vm = null;

  var _cb = cb;

  function load() {

    _vm = new __WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */]({
      el: '#publicfacility',
      components: { publicfacilitydiv: __WEBPACK_IMPORTED_MODULE_1__components_publicfacility_vue___default.a },
      methods: {
        onclick: function onclick() {

          _cb && _cb();
        }
      }
    });
  }

  function show(visible) {

    if (!_vm) {

      if (visible) {

        load();
      }

      return;
    }

    if (visible) {

      _vm.$el.style.visibility = 'visible';
    } else {

      _vm.$el.style.visibility = 'hidden';
    }
  }

  this.show = show;
}



/***/ }),
/* 90 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NormalBottomBar; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_normalBottombar_vue__ = __webpack_require__(247);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_normalBottombar_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__components_normalBottombar_vue__);



function NormalBottomBar(btninfos) {

  var _vm = null;

  function load() {

    _vm = new __WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */]({
      el: '#footer',
      components: { normalbottombar: __WEBPACK_IMPORTED_MODULE_1__components_normalBottombar_vue___default.a },
      data: function data() {
        return {
          btnInfos: btninfos
        };
      },
      methods: {
        onReceive: function onReceive(msg) {

          console.log(msg);
        },
        onFindByUnit: function onFindByUnit() {}
      }
    });
  }

  function show(visible) {

    if (!_vm) {

      if (visible) {

        load();
      }

      return;
    }

    if (visible) {

      _vm.$el.style.visibility = 'visible';
    } else {

      _vm.$el.style.visibility = 'hidden';
    }
  }

  this.show = show;
}



/***/ }),
/* 91 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UpdateMarkerView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_updatemarkerview_vue__ = __webpack_require__(249);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_updatemarkerview_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__components_updatemarkerview_vue__);



function UpdateMarkerView(deleteCallback, changePosCallback, shareCallBack) {

  var _vm = null;

  var _deleteCallback = deleteCallback;

  var _changePosCallback = changePosCallback;

  var _shareCallBack = shareCallBack;

  var _pos = null;

  function load() {

    _vm = new __WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */]({
      el: '#updatemaker',
      components: { updatemarkerview: __WEBPACK_IMPORTED_MODULE_1__components_updatemarkerview_vue___default.a },
      data: function data() {
        return {
          show: true,
          x: _pos.x,
          y: _pos.y
        };
      },
      methods: {
        deleteMarker: function deleteMarker() {

          _deleteCallback && _deleteCallback();

          this.show = false;
        },
        changeMarkerPos: function changeMarkerPos() {

          _changePosCallback && _changePosCallback();

          this.show = false;
        },
        share: function share() {

          _shareCallBack && _shareCallBack();

          this.show = false;
        }
      }
    });
  }

  function getPos(marker, map) {

    var pos = map.getScreenPos(marker.position);

    var x = (pos.x - 65).toString() + 'px';

    var y = (pos.y - 100).toString() + 'px';

    return { x: x, y: y };
  }

  function show(visible, marker, map) {

    if (!_vm) {

      _pos = getPos(marker, map);

      if (visible) {

        load();
      }

      return;
    }

    if (visible) {

      _pos = getPos(marker, map);

      _vm.show = true;

      _vm.x = _pos.x;

      _vm.y = _pos.y;
    } else {

      _vm.show = false;
    }
  }

  this.show = show;
}



/***/ }),
/* 92 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ZoomView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_zoom_vue__ = __webpack_require__(250);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_zoom_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__components_zoom_vue__);



function ZoomView(map) {

  var _vm = null;

  var _map = map;

  function load() {

    _vm = new __WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */]({
      el: '#zoom',
      components: { zoom: __WEBPACK_IMPORTED_MODULE_1__components_zoom_vue___default.a },
      data: function data() {
        return {
          map: _map
        };
      }
    });
  }

  function show() {

    if (!_vm) {

      load();

      return;
    }

    _vm.$el.style.visibility = 'visible';
  }

  function hide() {

    if (_vm) {

      _vm.$el.style.visibility = 'hidden';
    }
  }

  this.show = show;

  this.hide = hide;
}



/***/ }),
/* 93 */,
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(126)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(105),
  /* template */
  __webpack_require__(255),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-2fafc4fb",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(130)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(108),
  /* template */
  __webpack_require__(259),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-416b6b96",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(134)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(109),
  /* template */
  __webpack_require__(263),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-6bc1ede5",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(137)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(111),
  /* template */
  __webpack_require__(266),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-c7a3b7d0",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(122)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(112),
  /* template */
  __webpack_require__(251),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-0b1922e6",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(128)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(113),
  /* template */
  __webpack_require__(257),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-37ebb794",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(132)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(114),
  /* template */
  __webpack_require__(261),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-473fd465",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 101 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return map; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__modules_idrMapView__ = __webpack_require__(276);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_idrRegionEx__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_idrUnit__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__modules_IDRMapMarker_IDRMapMarker__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__modules_idrNetworkManager__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__modules_idrCoreManager__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__modules_idrLocationServer__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__modules_idrDebug__ = __webpack_require__(12);









var map = {
    'idrMapView':__WEBPACK_IMPORTED_MODULE_0__modules_idrMapView__["a" /* default */],
    'idrRegionEx':__WEBPACK_IMPORTED_MODULE_1__modules_idrRegionEx__["a" /* default */],
    'idrUnit':__WEBPACK_IMPORTED_MODULE_2__modules_idrUnit__["a" /* default */],
    'idrNetworkInstance':__WEBPACK_IMPORTED_MODULE_4__modules_idrNetworkManager__["a" /* default */],
    'idrCoreManagerInstance':__WEBPACK_IMPORTED_MODULE_5__modules_idrCoreManager__["a" /* default */],
    'idrMapMarker':__WEBPACK_IMPORTED_MODULE_3__modules_IDRMapMarker_IDRMapMarker__["a" /* default */],
    'idrDebug':__WEBPACK_IMPORTED_MODULE_7__modules_idrDebug__["a" /* default */]
}



/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

var merge = __webpack_require__(268)
var prodEnv = __webpack_require__(44)

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"'
})


/***/ }),
/* 103 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'alertbox',
  props: ['message', 'title', 'buttons'],
  methods: {
    callback: function callback(button) {

      button.callback && button.callback();
    }
  }
});

/***/ }),
/* 104 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'bottombar',
  props: ['message']
});

/***/ }),
/* 105 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'emptyspace',
  props: ['dofind'],
  computed: {
    getStyle: function getStyle() {
      if (this.dofind) {
        return 'inFind';
      }
      return 'notFind';
    }
  },
  methods: {
    onClick: function onClick() {

      this.$emit('onclick', '');
    }
  }
});

/***/ }),
/* 106 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'errortipview',
  props: ['message', 'opacity']
});

/***/ }),
/* 107 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'facilitybtn',
  props: ['item'],
  methods: {
    onclick: function onclick() {
      this.$emit('onclickunitwith', this.item.type);
      console.log(this.item.title);
    }
  }
});

/***/ }),
/* 108 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'findwithnum',
  props: ['error', 'placeinfos', 'carlist'],
  data: function data() {
    return {
      carnumber: "",
      onfocuse: false
    };
  },
  methods: {
    onClose: function onClose() {

      this.$emit('close');
    },
    onConfirm: function onConfirm() {

      this.onfocuse = false;

      this.$emit('confirm', this.carnumber);
    },
    onSelect: function onSelect(car) {

      console.log('selectcar');

      this.$emit('selectcar', car);
    },
    onCancel: function onCancel() {

      this.$emit('changetosearchunit');
    },
    onFocuse: function onFocuse() {

      this.onfocuse = true;
    }
  },
  computed: {
    getErrorShow: function getErrorShow() {

      if (this.onfocuse) {

        return 'errorTipHide';
      }

      if (this.error) {

        return 'errorTip';
      }

      return 'errorTipHide';
    }
  }
});

/***/ }),
/* 109 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


function onClose() {

  this.$emit('onclose', 2);
}

function onCancel() {

  this.onClose();

  this.$emit('onmarkinmap');
}

function onConfirm() {

  var units = this.map.findUnitWithName(this.selectedFloorId, this.unitName);

  if (!units) {

    this.findError = true;
  } else {

    this.onClose();

    this.$emit('onfindunits', units);
  }
}

function onSelectFloor(floorId) {

  this.selectedFloorId = floorId;

  this.map.autoChangeFloor = false;

  this.map.changeFloor(floorId);
}

function getFloorStyle(floorId) {

  if (floorId === this.selectedFloorId) {

    return 'floor floorSelected';
  } else {

    return 'floor';
  }
}

function onFocuse() {

  this.findError = false;
}

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'findwithunit',
  props: ['map'],
  data: function data() {
    return {
      findError: false,
      unitName: '',
      floorlist: this.map.regionEx.floorList,
      selectedFloorId: this.map.getFloorId()
    };
  },
  methods: {
    onClose: onClose,
    onCancel: onCancel,
    onConfirm: onConfirm,
    onSelectFloor: onSelectFloor,
    getFloorStyle: getFloorStyle,
    onFocuse: onFocuse
  },
  computed: {
    showerror: function showerror() {

      if (this.findError) {

        return 'visible';
      } else {

        return 'hidden';
      }
    }
  }
});

/***/ }),
/* 110 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__facilitybtn_vue__ = __webpack_require__(245);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__facilitybtn_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__facilitybtn_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'findfacilityview',
  props: ['facilities'],
  methods: {
    onClose: function onClose() {
      this.$root.$el.style.visibility = 'hidden';
    },
    onClickUnit: function onClickUnit(type) {
      this.onClose();
      this.$emit('onnavigateto', type);
    }
  },
  components: { facilitybtn: __WEBPACK_IMPORTED_MODULE_0__facilitybtn_vue___default.a }
});

/***/ }),
/* 111 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//


function onShow() {

  this.show = !this.show;

  if (this.show) {

    this.dropDownStyle = 'fadein';
  } else {

    this.dropDownStyle = 'fadeout';
  }
}

function onSelect(floorId) {

  this.$emit('onselect', floorId);

  console.log('选择:' + floorId);

  this.show = false;

  if (this.show) {

    this.dropDownStyle = 'fadein';
  } else {

    this.dropDownStyle = 'fadeout';
  }
}

function getFloorStyle(floorId) {

  if (floorId === this.selectfloorid) {

    return 'dropdown selected';
  } else {

    return 'dropdown';
  }
}

function getCurrentName() {

  for (var i = 0; i < this.floorList.length; ++i) {

    if (this.floorList[i].id === this.selectfloorid) {

      return this.floorList[i].name;
    }
  }

  return null;
}

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'floorlistdiv',
  props: ['floorlist', 'selectfloorid', 'locatefloorid'],
  data: function data() {
    return {
      floorList: this.floorlist,
      selectFloorId: this.selectfloorid,
      show: false,
      dropDownStyle: 'fadeout'
    };
  },
  computed: {},
  methods: {
    onShow: onShow,
    onSelect: onSelect,
    getFloorStyle: getFloorStyle,
    name: getCurrentName,
    checkShow: function checkShow(floorId) {

      return this.locatefloorid == floorId;
    }
  }
});

/***/ }),
/* 112 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'locatestatediv',
  props: ['dolocate'],
  computed: {
    getStyle: function getStyle() {
      if (this.dolocate) {
        return 'inLocating';
      }
      return 'notLocating';
    }
  },
  methods: {
    onClick: function onClick() {
      this.$emit('onclick', !this.dolocate);
    }
  }
});

/***/ }),
/* 113 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//


function onClose() {

  this.$emit('close', '');
}

function onConfirm() {

  this.$emit('confirm', '');
}

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'markwithble',
  props: ['name'],
  methods: {
    onClose: onClose,
    onConfirm: onConfirm
  }
});

/***/ }),
/* 114 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'navigatebottombar',
  props: ['routers', 'initfloorid'],
  data: function data() {
    return {
      selectedfloorId: null
    };
  },
  methods: {
    exit: function exit() {
      this.$emit('onexit', true);
    },
    clickFloor: function clickFloor(floorId) {
      this.selectedfloorId = floorId;
      this.$emit('showfloor', floorId);
    },
    getSelected: function getSelected(floorId) {

      if (this.selectedfloorId === null && floorId === this.initfloorid) {

        return 'selected';
      }

      if (this.selectedfloorId === floorId) {

        return 'selected';
      }

      return '';
    }
  }
});

/***/ }),
/* 115 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'normalbottombar',
  props: ['data'],
  methods: {
    onclick: function onclick() {
      this.data.cb && this.data.cb();
    }
  }
});

/***/ }),
/* 116 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'publicfacilitydiv',
  methods: {
    onClick: function onClick() {
      this.$emit('onclick', 1);
    }
  }
});

/***/ }),
/* 117 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'updatemarkerview',
  props: ['x', 'y'],
  methods: {
    onDelete: function onDelete() {

      this.$emit('ondelete');
    },
    onChangePos: function onChangePos() {

      this.$emit('onchangepos');
    },
    onShare: function onShare() {

      this.$emit('onshare');
    }
  }
});

/***/ }),
/* 118 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'zoom',
  props: ['map'],
  data: function data() {
    return {
      _time: null
    };
  },
  methods: {
    zoomout: function zoomout() {

      var time = new Date().getTime();

      if (!this._time || time - this._time > 1000) {

        this.map.zoom(0.75);

        this._time = time;
      }
    },
    zoomin: function zoomin() {

      var time = new Date().getTime();

      if (!this._time || time - this._time > 1000) {

        this.map.zoom(1.35);

        this._time = time;
      }
    }
  }
});

/***/ }),
/* 119 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__indoorunMap_map_js__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__findfacilityview__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__findfacility__ = __webpack_require__(88);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__normalbottombar__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__AlertBox__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__bottombar__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__updatemarkerview__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__errortipview__ = __webpack_require__(87);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__zoomview__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_floorList_vue__ = __webpack_require__(97);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_floorList_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11__components_floorList_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__components_markwithble_vue__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__components_markwithble_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12__components_markwithble_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__components_emptyspace_vue__ = __webpack_require__(94);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__components_emptyspace_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13__components_emptyspace_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__components_locatestatus_vue__ = __webpack_require__(98);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__components_locatestatus_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14__components_locatestatus_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__components_navigateBottombar_vue__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__components_navigateBottombar_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15__components_navigateBottombar_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__components_findWithNum_vue__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__components_findWithNum_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_16__components_findWithNum_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__components_findWithUnit_vue__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__components_findWithUnit_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_17__components_findWithUnit_vue__);

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.




















var config = __webpack_require__(84);

__WEBPACK_IMPORTED_MODULE_1_vue__["a" /* default */].config.productionTip = false;

var regionId = '15083944886931146';

var idrMapView = __WEBPACK_IMPORTED_MODULE_2__indoorunMap_map_js__["a" /* default */].idrMapView;

var map = new idrMapView();

map.publicPath = config.publicPath;

var floorListView = null;

var emptySpaceView = null;

var locateStatusView = null;

var findFacilityBtnView = null;

var navigateBottomBar = null;

var normalBottomBar = null;

var updateMarkerView = null;

var emptySpaceTimer = null;

var emptyUnits = [];

var targetUnit = null;

var startEmptyNavi = false;

var errortipview = new __WEBPACK_IMPORTED_MODULE_9__errortipview__["a" /* default */]();

var alertboxview = null;

var zoomView = null;

var endMarker = null;

// indoorun.idrDebug.showDebugInfo(false)

function enableClickMarker() {

  map.addOnceEvent(map.eventTypes.onMarkerClick, function (marker) {

    if (marker.id != endMarker.id || endMarker.className !== 'IDRCarMarker') {

      return false;
    }

    map.centerPos(marker.position, false);

    showUpdateMarkerView(true, marker);

    map.addOnceEvent(map.eventTypes.onMapScroll, function () {

      showUpdateMarkerView(false, null);

      return true;
    });

    return true;
  });
}

map.addEventListener(map.eventTypes.onMapScroll, function () {

  if (!locateStatusView) {

    return;
  }

  locateStatusView.dolocate = false;
});

function addCarMarker(unit) {

  var pos = unit.getPos();

  __WEBPACK_IMPORTED_MODULE_2__indoorunMap_map_js__["a" /* default */].idrNetworkInstance.saveMarkedUnit(unit, null, null);

  endMarker = doAddCarMarker(pos);

  map.centerPos(pos, false);

  enableClickMarker();
}

var markWithBleView = null;
function showMarkWithBle(unit) {

  if (endMarker) {

    map.centerPos(endMarker.position, false);

    return;
  }

  var name = map.regionEx.getFloorbyId(unit.floorId).name + '  ' + unit.name;

  if (markWithBleView) {

    markWithBleView.name = name;

    markWithBleView.show = true;

    markWithBleView.unit = unit;

    return;
  }

  markWithBleView = new __WEBPACK_IMPORTED_MODULE_1_vue__["a" /* default */]({
    el: '#markwithble',
    data: function data() {
      return {
        show: true,
        unit: unit,
        name: name
      };
    },
    components: { markwithble: __WEBPACK_IMPORTED_MODULE_12__components_markwithble_vue___default.a },
    methods: {
      onConfirm: function onConfirm() {

        this.show = false;

        addCarMarker(this.unit);
      },
      onClose: function onClose() {

        this.show = false;
      }
    }
  });
}

var findEmptySpaceInfo = {
  icon: config.publicPath + '/static/kongwei.png',
  title: '空位引导',
  type: '0',
  cb: navigateToEmptySpace
};

var findByBleInfo = {
  icon: config.publicPath + '/static/biaoji.png',
  title: '蓝牙标记',
  type: '1',
  cb: function cb() {
    markWithBluetooth();
  }
};

var findCarInfo = {
  icon: config.publicPath + '/static/zhaoche.png',
  title: '找车',
  type: '2',
  cb: function cb() {
    onFindCar();
  }
};

function showNormalBottomBar(bshow) {

  if (!normalBottomBar && bshow) {

    normalBottomBar = new __WEBPACK_IMPORTED_MODULE_5__normalbottombar__["a" /* default */]([findEmptySpaceInfo, findByBleInfo, findCarInfo]);
  }

  normalBottomBar && normalBottomBar.show(bshow);
}

function getRouters(path) {

  var results = [];

  if (!path) {

    return results;
  }

  for (var i = 0; i < path.paths.length; ++i) {

    var floorPath = path.paths[i];

    var name = map.regionEx.getFloorbyId(floorPath.floorId).name;

    results.push({ id: floorPath.floorId, name: name });
  }

  return results;
}

function showNavigateBottombar(bshow, path, cb) {

  if (!bshow) {

    if (navigateBottomBar) {

      navigateBottomBar.show = false;
    }

    return;
  }

  var routers = getRouters(path);

  if (routers.length <= 0) {

    return;
  }

  if (navigateBottomBar) {

    navigateBottomBar.show = bshow;

    navigateBottomBar.routerpos = routers;

    navigateBottomBar.callback = cb;

    navigateBottomBar.initFloorId = routers[0].id;

    return;
  }

  navigateBottomBar = new __WEBPACK_IMPORTED_MODULE_1_vue__["a" /* default */]({
    el: '#navigate',
    components: { navigatebottombar: __WEBPACK_IMPORTED_MODULE_15__components_navigateBottombar_vue___default.a },
    data: function data() {
      return {
        routerpos: routers,
        callback: cb,
        initFloorId: routers[0].id,
        show: true
      };
    },
    methods: {
      onStopNavigate: function onStopNavigate() {

        this.callback && this.callback();
      },
      onShowSelectFloor: function onShowSelectFloor(value) {

        map.changeFloor(value);

        map.birdLook();
      }
    }
  });
}

function showFindFacilityBtnView(bshow, cb) {

  if (!findFacilityBtnView && bshow) {

    findFacilityBtnView = new __WEBPACK_IMPORTED_MODULE_3__findfacilityview__["a" /* default */](cb);
  }

  findFacilityBtnView && findFacilityBtnView.show(bshow);
}

function showLocateStatusView(bshow) {

  if (locateStatusView) {

    locateStatusView.show = bshow;

    return;
  }

  locateStatusView = new __WEBPACK_IMPORTED_MODULE_1_vue__["a" /* default */]({
    el: '#locateState',
    components: { locatestatediv: __WEBPACK_IMPORTED_MODULE_14__components_locatestatus_vue___default.a },
    methods: {
      doLocating: function doLocating() {

        if (map.getUserPos()) {

          this.dolocate = true;

          map.centerPos(map.getUserPos(), false);

          map.autoChangeFloor = true;
        } else {

          map.doLocation(function (pos) {

            map.setCurrPos(pos);

            if (pos) {

              floorListView.locateFloorId = pos.floorId;
            } else {

              floorListView.locateFloorId = null;
            }
          }, function (errorId) {

            floorListView.locateFloorId = null;

            if (errorId === 0) {

              errortipview.show('温馨提示：蓝牙未开启，请开启蓝牙');
            }
          });
        }
      }
    },
    data: function data() {
      return {
        show: true,
        dolocate: false
      };
    }
  });
}

function showFloorListView(bshow) {

  if (floorListView) {

    floorListView.show = bshow;

    return;
  }

  floorListView = new __WEBPACK_IMPORTED_MODULE_1_vue__["a" /* default */]({
    el: "#floorList",
    components: { floorlistdiv: __WEBPACK_IMPORTED_MODULE_11__components_floorList_vue___default.a },
    data: function data() {
      return {
        show: true,
        floorList: map.regionEx.floorList,
        currentFloorId: map.getFloorId(),
        locateFloorId: map.getUserPos() ? map.getUserPos().floorId : null
      };
    },
    methods: {
      onSelect: function onSelect(val) {
        this.currentFloorId = val;
        map.changeFloor(val);
        map.autoChangeFloor = false;
      }
    }
  });
}

function checkTargetValid(unitId, unitList) {

  for (var i = 0; i < unitList.length; ++i) {

    if (unitList[i].id === unitId) {

      return true;
    }
  }

  return false;
}

function checkNeedUpdateNaivtarget(unitlist) {

  if (!startEmptyNavi) {

    return;
  }

  if (!targetUnit || !checkTargetValid(targetUnit.id, unitlist)) {

    targetUnit = map.findNearUnit(map.getUserPos(), unitlist);

    if (!map.doRoute(null, targetUnit.getPos(), true)) {

      var confirm = { name: '确定', callback: function callback() {

          alertboxview.hide();
        } };

      showAlertBox(null, '您附近有空位', [confirm]);

      return;
    }

    endMarker && map.removeMarker(endMarker);

    endMarker = addEndMarker(targetUnit.getPos());
  }
}

function getUnits(emptyspaces) {

  var emptyUnits = [];

  for (var i = 0; i < emptyspaces.length; ++i) {

    var unit = new __WEBPACK_IMPORTED_MODULE_2__indoorunMap_map_js__["a" /* default */].idrUnit(emptyspaces[i]);

    emptyUnits.push(unit);
  }

  return emptyUnits;
}

function doFindEmptySpace() {

  var data = { regionId: map.getRegionId(), floorId: map.getFloorId() };

  var url = __WEBPACK_IMPORTED_MODULE_2__indoorunMap_map_js__["a" /* default */].idrNetworkInstance.host + 'chene/getSpaceUnitListOfRegion.html';

  __WEBPACK_IMPORTED_MODULE_2__indoorunMap_map_js__["a" /* default */].idrNetworkInstance.doAjax(url, data, function (res) {

    emptyUnits.length = 0;

    for (var i = 0; i < res.data.length; ++i) {

      var units = getUnits(res.data[i].spaceUnitList);

      if (map.getFloorId() === res.data[i].floorId) {

        map.updateUnitsColor(units, 0x8aef99);
      }

      if (map.getUserPos() && map.getUserPos().floorId == res.data[i].floorId) {

        checkNeedUpdateNaivtarget(units);
      }

      units.forEach(function (unit) {

        emptyUnits.push(unit);
      });
    }
  }, function (res) {

    console.log(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(res));
  });
}

function showEmptySpaceView(bshow) {

  if (!bshow) {

    if (emptySpaceView) {

      emptySpaceView.show = false;
    }

    return;
  }

  if (emptySpaceView) {

    emptySpaceView.show = true;
  } else {

    emptySpaceView = new __WEBPACK_IMPORTED_MODULE_1_vue__["a" /* default */]({
      el: '#emptyspace',
      components: { emptyspace: __WEBPACK_IMPORTED_MODULE_13__components_emptyspace_vue___default.a },
      methods: {
        onFindEmptySpace: function onFindEmptySpace() {

          this.doFind = !this.doFind;

          if (this.doFind) {

            doFindEmptySpace();

            emptySpaceTimer = setInterval(doFindEmptySpace, 10000);
          } else {

            clearInterval(emptySpaceTimer);

            emptySpaceTimer = null;

            map.clearFloorUnitsColor(true);

            emptyUnits.length = 0;
          }
        }
      },
      data: function data() {
        return {
          doFind: false,
          show: true
        };
      }
    });
  }
}

var gmtime = new Date().getTime();

map.initMap('yf1248331604', 'map', regionId);

function askSpaceUnitWhenChangeFloor() {

  if (!emptySpaceView || !emptySpaceView.show || !emptySpaceView.doFind) {

    return;
  }

  doFindEmptySpace();
}

var startLocate = false;
var firsttime = true;

// 必须微信初始化后，input唤出keyboard才没有bug(android上)
function doLocating() {

  map.doLocation(function (pos) {

    map.setCurrPos(pos);

    if (pos) {

      floorListView.locateFloorId = pos.floorId;

      if (firsttime) {

        map.centerPos(pos, false);

        firsttime = false;
      }
    } else {

      floorListView.locateFloorId = null;
    }
  }, function (errorId) {

    floorListView.locateFloorId = null;

    if (errorId === 0) {

      errortipview.show('温馨提示：蓝牙未开启，请开启蓝牙');
    }
  });
}

map.addEventListener(map.eventTypes.onFloorChangeSuccess, function (data) {

  askSpaceUnitWhenChangeFloor();

  floorListView.currentFloorId = data.floorId;

  if (!startLocate) {

    doLocating();

    startLocate = true;

    runOnLoopEnd(function () {

      __WEBPACK_IMPORTED_MODULE_2__indoorunMap_map_js__["a" /* default */].idrNetworkInstance.getMarkedUnit(map.getRegionId(), function (res) {

        endMarker = doAddCarMarker({ x: res.data.svgX, y: res.data.svgY, floorId: res.data.floorId });

        enableClickMarker();
      }, function () {

        showFindCarByNum();
      });
    });
  }
});

function runOnLoopEnd(callback) {

  setTimeout(callback, 2000);
}

map.addEventListener(map.eventTypes.onNaviStatusUpdate, function (status) {

  if (!status.validate) {

    return;
  }

  if (status.projDist >= 150) {

    map.reRoute();

    return;
  }

  if (status.goalDist < 150) {

    var confirm = { name: '知道了', callback: function callback() {

        alertboxview.hide();

        map.stopRoute();
      } };

    showAlertBox('您已到达目的地', null, [confirm]);
  }
});

function checkExit() {

  var cancel = { name: '取消', callback: function callback() {

      alertboxview.hide();
    } };

  var confirm = { name: '结束', callback: function callback() {

      map.stopRoute();

      alertboxview.hide();
    } };

  showAlertBox('是否结束本次导航', null, [cancel, confirm]);
}

map.addEventListener(map.eventTypes.onRouterFinish, function () {

  showNavigateBottombar(false, null, null);

  showSomeUIInNavi(true);

  map.removeMarker(endMarker);

  endMarker = null;

  targetUnit = null;

  if (startEmptyNavi) {

    startEmptyNavi = false;

    clearInterval(emptySpaceTimer);

    emptySpaceTimer = null;

    emptySpaceView.doFind = false;

    map.clearFloorUnitsColor(true);

    emptyUnits.length = 0;
  }
});

function doAddCarMarker(pos) {

  var IDRCarMarker = __WEBPACK_IMPORTED_MODULE_2__indoorunMap_map_js__["a" /* default */].idrMapMarker.IDRCarMarker;

  var endMarker = new IDRCarMarker(pos, config.publicPath + '/static/markericon/car.png');

  map.addMarker(endMarker);

  return endMarker;
}

function addEndMarker(pos) {

  var IDREndMarker = __WEBPACK_IMPORTED_MODULE_2__indoorunMap_map_js__["a" /* default */].idrMapMarker.IDREndMarker;

  var endMarker = new IDREndMarker(pos, config.publicPath + '/static/markericon/end.png');

  map.addMarker(endMarker);

  return endMarker;
}

function showSomeUIInNavi(bshow) {

  showEmptySpaceView(bshow);

  showNormalBottomBar(bshow);

  showFindFacilityBtnView(bshow, function () {

    showFindFacilityView();
  });
}

map.addEventListener(map.eventTypes.onRouterSuccess, function (data) {

  if (!endMarker) {

    endMarker = addEndMarker(data.end);
  }

  showSomeUIInNavi(false);

  showBottomBar(false);

  showNavigateBottombar(true, data.path, checkExit);

  map.changeFloor(data.start.floorId);

  map.birdLook();
});

map.addEventListener(map.eventTypes.onInitMapSuccess, function (regionEx) {

  showFloorListView(true);

  showEmptySpaceView(true);

  showLocateStatusView(true);

  showFindFacilityBtnView(true, function () {

    showFindFacilityView();
  });

  showNormalBottomBar(true);

  document.title = regionEx.name;

  zoomView = new __WEBPACK_IMPORTED_MODULE_10__zoomview__["a" /* default */](map);

  zoomView.show();

  map.changeFloor(regionEx.floorList[0].id);
});

var tempMarkers = [];

function onFindTargetUnits(units) {

  tempMarkers.length = 0;

  if (units.length == 0) {

    return;
  }

  var pos = units[0].getPos();

  addCarMarker(units[0]);

  map.doRoute(null, pos);
}

function onMarkUnitInMap() {

  showEmptySpaceView(false);

  showFindFacilityBtnView(false);

  showNormalBottomBar(false);

  showBottomBar(true, '点击车位进行选择');

  map.addOnceEvent(map.eventTypes.onUnitClick, function (unit) {

    var pos = unit.getPos();

    addCarMarker(unit);

    showBottomBar(false, '');

    map.doRoute(null, pos);

    showEmptySpaceView(true);

    showNormalBottomBar(true);

    return true;
  });
}

function onFindCar() {

  if (!endMarker) {

    showFindCarByNum();

    return;
  }

  if (!map.getUserPos()) {

    errortipview.show('定位失败，无法寻车');

    return;
  }

  if (map.doRoute(null, endMarker.position)) {

    map.removeMarker(endMarker);

    endMarker = addEndMarker(endMarker.position);
  }
}

map.addEventListener(map.eventTypes.onRouterFailed, function () {

  errortipview.show('您已在目的地附近');
});

var _carlist = [{
  carNo: '沪A 21548',
  placeCode: 'F-352',
  unitId: "14980981315802601"
}, {
  carNo: '沪A 21548',
  placeCode: 'F-351',
  unitId: "14980981315802601"
}, {
  carNo: '沪A 21548',
  placeCode: 'F-356',
  unitId: "14980981315802601"
}, {
  carNo: '沪A 21548',
  placeCode: 'F-355',
  unitId: "14980981315802601"
}, {
  carNo: '沪A 21548',
  placeCode: 'F-354',
  unitId: "14980981315802601"
}, {
  carNo: '沪A 21888',
  placeCode: 'F-343',
  unitId: "14980981315802601"
}];

function _onFindByCarNo(carNo) {

  var url = __WEBPACK_IMPORTED_MODULE_2__indoorunMap_map_js__["a" /* default */].idrNetworkInstance.host + 'chene/getParkingPlaceUnitByCarNo.html';

  var data = {
    'regionId': map.getRegionId(),
    'carNo': carNo
  };

  __WEBPACK_IMPORTED_MODULE_2__indoorunMap_map_js__["a" /* default */].idrNetworkInstance.doAjax(url, data, function (res) {

    // alert(JSON.stringify(res))

    var carlist = res.data.matchedCarList;

    if (!carlist || carlist.length <= 0) {

      return;
    }

    if (carlist.length > 1) {

      _findCarByNum.carlist = carlist;
    } else {

      var units = map.findUnitWithName(carlist[0].floorId, carlist[0].placeCode);

      addCarMarker(units[0]);

      if (map.getUserPos()) {

        map.doRoute(null, units[0].getPos());
      }

      _findCarByNum.show = false;
    }
  }, function () {

    _findCarByNum.error = true;
  });
}

var _findCarByNum = null;
function showFindCarByNum() {

  if (_findCarByNum) {

    _findCarByNum.show = true;

    _findCarByNum.carlist = null;

    return;
  }

  _findCarByNum = new __WEBPACK_IMPORTED_MODULE_1_vue__["a" /* default */]({
    el: '#findwithnum',
    components: { findwithnum: __WEBPACK_IMPORTED_MODULE_16__components_findWithNum_vue___default.a },
    data: function data() {
      return {
        show: true,
        error: false,
        carlist: null
      };
    },
    methods: {
      onFindByCarNo: function onFindByCarNo(carNum) {

        this.error = false;

        _onFindByCarNo(carNum);
      },
      onChangeToSearchUnit: function onChangeToSearchUnit() {

        this.show = false;

        showFindCarByUnit();
      },
      onSelectCar: function onSelectCar(car) {

        var unit = map.findUnitWithId(car.unitId);

        addCarMarker(unit);

        if (map.getUserPos()) {

          map.doRoute(null, unit.getPos());
        }

        this.show = false;
      },
      onClose: function onClose() {

        this.show = false;
      }
    }
  });
}

var _findCarByUnit = null;
function showFindCarByUnit() {

  if (_findCarByUnit) {

    _findCarByUnit.show = true;

    return;
  }

  _findCarByUnit = new __WEBPACK_IMPORTED_MODULE_1_vue__["a" /* default */]({
    el: '#findwithunit',
    components: { findwithunit: __WEBPACK_IMPORTED_MODULE_17__components_findWithUnit_vue___default.a },
    data: function data() {
      return {
        show: true,
        map: map,
        showerrorincarno: false
      };
    },
    methods: {
      onFindUnits: function onFindUnits(unitName) {

        onFindTargetUnits(unitName);
      },
      onClose: function onClose() {

        this.show = false;
      },
      onMarkInMap: function onMarkInMap() {

        onMarkUnitInMap();
      }
    }
  });
}

function navigateToEmptySpace() {

  if (map.getUserPos() == null) {

    errortipview.show('定位失败, 无法导航至空车位');

    return;
  }

  startEmptyNavi = true;

  doFindEmptySpace();

  if (!emptySpaceTimer) {

    emptySpaceTimer = setInterval(doFindEmptySpace, 10000);

    emptySpaceView.doFind = true;
  }
}

function markWithBluetooth() {

  var pos = map.getUserPos();

  if (endMarker) {

    map.centerPos(endMarker.position, false);

    return;
  }

  if (!pos) {

    errortipview.show('定位失败，无法标记');

    return;
  }

  showMarkWithBle(map.getNearUnit(pos));
}

var findFacilityView = null;

function showFindFacilityView() {

  if (!findFacilityView) {

    findFacilityView = new __WEBPACK_IMPORTED_MODULE_4__findfacility__["a" /* default */](map);
  }

  findFacilityView.show();
}

function showAlertBox(title, message, buttons) {

  if (!alertboxview) {

    alertboxview = new __WEBPACK_IMPORTED_MODULE_6__AlertBox__["a" /* default */]();
  }

  alertboxview.show(title, message, buttons);
}

var bottomBar = null;

function showBottomBar(bshow, message) {

  if (!bottomBar && bshow) {

    bottomBar = new __WEBPACK_IMPORTED_MODULE_7__bottombar__["a" /* default */]();
  }

  bottomBar && bottomBar.show(bshow, message);
}

function updateMarkerPos() {

  showBottomBar(true, '点击车位进行选择');

  showNormalBottomBar(false);

  map.addOnceEvent(map.eventTypes.onUnitClick, function (unit) {

    endMarker = map.updateMarkerLocation(endMarker, unit.getPos());

    showBottomBar(false, '');

    showNormalBottomBar(true);

    return true;
  });
}

function deleteMarker() {

  map.removeMarker(endMarker);

  endMarker = null;

  __WEBPACK_IMPORTED_MODULE_2__indoorunMap_map_js__["a" /* default */].idrNetworkInstance.removeMarkedUnit(regionId, null, null);
}

function sharePosition() {

  var ua = navigator.userAgent;

  if (ua.match(/iPhone|iPod/i) != null) {

    setTimeout("javascript:location.href='http://a.app.qq.com/o/simple.jsp?pkgname=com.yellfun.yellfunchene'", 0);
  } else if (ua.match(/Android/i) != null) {

    window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.yellfun.yellfunchene";
  }
}

function showUpdateMarkerView(show, marker) {

  if (!updateMarkerView && show) {

    updateMarkerView = new __WEBPACK_IMPORTED_MODULE_8__updatemarkerview__["a" /* default */](deleteMarker, updateMarkerPos, sharePosition);
  }

  updateMarkerView && updateMarkerView.show(show, marker, map);
}

/***/ }),
/* 120 */,
/* 121 */,
/* 122 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 123 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 124 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 125 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 126 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 127 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 128 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 129 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 130 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 131 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 132 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 133 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 134 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 135 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 136 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 137 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 138 */,
/* 139 */,
/* 140 */,
/* 141 */,
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */,
/* 146 */,
/* 147 */,
/* 148 */,
/* 149 */,
/* 150 */,
/* 151 */,
/* 152 */,
/* 153 */,
/* 154 */,
/* 155 */,
/* 156 */,
/* 157 */,
/* 158 */,
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */,
/* 163 */,
/* 164 */,
/* 165 */,
/* 166 */,
/* 167 */,
/* 168 */,
/* 169 */,
/* 170 */,
/* 171 */,
/* 172 */,
/* 173 */,
/* 174 */,
/* 175 */,
/* 176 */,
/* 177 */,
/* 178 */,
/* 179 */,
/* 180 */,
/* 181 */,
/* 182 */,
/* 183 */,
/* 184 */,
/* 185 */,
/* 186 */,
/* 187 */,
/* 188 */,
/* 189 */,
/* 190 */,
/* 191 */,
/* 192 */,
/* 193 */,
/* 194 */,
/* 195 */,
/* 196 */,
/* 197 */,
/* 198 */,
/* 199 */,
/* 200 */,
/* 201 */,
/* 202 */,
/* 203 */,
/* 204 */,
/* 205 */,
/* 206 */,
/* 207 */,
/* 208 */,
/* 209 */,
/* 210 */,
/* 211 */,
/* 212 */,
/* 213 */,
/* 214 */,
/* 215 */,
/* 216 */,
/* 217 */,
/* 218 */,
/* 219 */,
/* 220 */,
/* 221 */,
/* 222 */,
/* 223 */,
/* 224 */,
/* 225 */,
/* 226 */,
/* 227 */,
/* 228 */,
/* 229 */,
/* 230 */,
/* 231 */,
/* 232 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/img/bluetooth_img.5fe7baa.png";

/***/ }),
/* 233 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTExIDc5LjE1ODMyNSwgMjAxNS8wOS8xMC0wMToxMDoyMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkJFMTk1MzhGQTYyNjExRTZCRUZDQTRCNUE1Qjk4NDEwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkJFMTk1MzkwQTYyNjExRTZCRUZDQTRCNUE1Qjk4NDEwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QkUxOTUzOERBNjI2MTFFNkJFRkNBNEI1QTVCOTg0MTAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QkUxOTUzOEVBNjI2MTFFNkJFRkNBNEI1QTVCOTg0MTAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5XD+cNAAACMUlEQVR42syYy0sCURTG70wbi2rnIqKkNvZYt+hhbcSS9gW1NaKy/6D+iawgi9q7jQixTRSFRMtem6Iieq56YAhh37EzYiLTXMfJ+8EPL8x47ucd59xzrvbRrglJtYBB0AfagQfU8bU3cA3OwD6IgyuZ4JpFQ1VgBIRBN33PYvwMOASLIAa+ymHIDyKgTdjTOZgFO2Y36SbXXGAFJMpgRnCMBMd0ya6QG2yBLuGMjsAweLayQmRmz0EzgmPv8VymhmrAJvBajVzlC4rq3bssNJaQl+eqMXtkqyAkE5WMaO6Gn1fq+V6kBhplV2sNTBRbIb+smewvYjOFYwmFeO5fhuhzQVROEc51OUOjnHUrpTZOvDlDM6LyChuGaG/qUcAQbUmtZGhIYm9yUuRhkAz1CnXUS4Y6FTLUQYaaFDLk0fOKKxVUqwvFpHPZqYreydCtnQi0oebGLw92Dd2QoVM7EdLzE1kjmcc7kZ4L2TV0QuXHFAbLijyyaZ1blYwCZshDnAxdggMFDFG7dGm89ksKGFrMLz9i3DdJy0ZNXdizxQpraj/3TVIqQ01NChhz52dq6ig37BUQJVUx6/kLoRep2pL/mIeS3F6bdq5Go+h1+E98AXyF3WuxzZVu6AfHDpo55jkstdKkJ3YfdcBMlM+WnmRPP1Jgkt+AizI9ogDH/CzlOMZQgsvcMc6mstsMfWecY/yZVrQSj/SCvOzU4DWDer72SiUEJzo60tsWkkd63wIMACo9i8JwocxrAAAAAElFTkSuQmCC"

/***/ }),
/* 234 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG4AAAAICAYAAAAY9sq8AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTExIDc5LjE1ODMyNSwgMjAxNS8wOS8xMC0wMToxMDoyMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkExMEIyNkU4QTYyNDExRTY4RTNDQzYwNzlBQ0M2OEJEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkExMEIyNkU5QTYyNDExRTY4RTNDQzYwNzlBQ0M2OEJEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QTEwQjI2RTZBNjI0MTFFNjhFM0NDNjA3OUFDQzY4QkQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QTEwQjI2RTdBNjI0MTFFNjhFM0NDNjA3OUFDQzY4QkQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6y7ZYqAAAAiUlEQVR42mL8//8/wygYlEAIiFcAcT4QX0eXZBoNn0EL6oHYFYj3ALEquiTjaI4btIALiLcBsT0QPwFiByC+OxpxQwNwA/FOILYG4kdAbAfED0eLysEPvgKxNxCfAGI5IN4HxDKjOW7oAH4g3gvExkB8B1R8giJuNOaGHjg4GnFDD7wGYkeAAAMAuF4ko8EzBDAAAAAASUVORK5CYII="

/***/ }),
/* 235 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAABmCAYAAAA53+RiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTExIDc5LjE1ODMyNSwgMjAxNS8wOS8xMC0wMToxMDoyMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjVEQjVFOTBENEEyRDExRTY4QThBOTVENjQ2MjkyMDRDIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjVEQjVFOTBFNEEyRDExRTY4QThBOTVENjQ2MjkyMDRDIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NURCNUU5MEI0QTJEMTFFNjhBOEE5NUQ2NDYyOTIwNEMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NURCNUU5MEM0QTJEMTFFNjhBOEE5NUQ2NDYyOTIwNEMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6bgIZoAAAUKklEQVR42uxd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"

/***/ }),
/* 236 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAABmCAYAAAA53+RiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTExIDc5LjE1ODMyNSwgMjAxNS8wOS8xMC0wMToxMDoyMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjVFNDRCQTA5NEEyRDExRTY4MzJEQjU4RTZEMDY1MzUxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjVFNDRCQTBBNEEyRDExRTY4MzJEQjU4RTZEMDY1MzUxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NUU0NEJBMDc0QTJEMTFFNjgzMkRCNThFNkQwNjUzNTEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NUU0NEJBMDg0QTJEMTFFNjgzMkRCNThFNkQwNjUzNTEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5Xoj4UAAARv0lEQVR42uxd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"

/***/ }),
/* 237 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAABmCAYAAAA53+RiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTExIDc5LjE1ODMyNSwgMjAxNS8wOS8xMC0wMToxMDoyMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjVFRDcxMjhENEEyRDExRTZCRjhBRjE2OEI2QkYxRUIwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjVFRDcxMjhFNEEyRDExRTZCRjhBRjE2OEI2QkYxRUIwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NUVENzEyOEI0QTJEMTFFNkJGOEFGMTY4QjZCRjFFQjAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NUVENzEyOEM0QTJEMTFFNkJGOEFGMTY4QjZCRjFFQjAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6ijENKAAAScklEQVR42uxd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"

/***/ }),
/* 238 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/img/public_img.381dad2.png";

/***/ }),
/* 239 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTExIDc5LjE1ODMyNSwgMjAxNS8wOS8xMC0wMToxMDoyMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkYwMTQ0NEMyQTYyMzExRTY4OUNFREY2RjA3MEYyRjdCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkYwMTQ0NEMzQTYyMzExRTY4OUNFREY2RjA3MEYyRjdCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RjAxNDQ0QzBBNjIzMTFFNjg5Q0VERjZGMDcwRjJGN0IiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RjAxNDQ0QzFBNjIzMTFFNjg5Q0VERjZGMDcwRjJGN0IiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7aNHwyAAABZUlEQVR42szZwW7CMAwG4IYnnzRNPYA2GGVjK+P9OMJ2D7HUaKxzE7t2Yiz9F6dqPzWiTUPjvX8IuYRsQxYhjXFcyCrkO6SFxsn/1tEYCbj9jecMzUf/t6yQYxzUKg68GCMx3Dv0bw9YGyHdgPmHg/HxgWPkV2EkhttH3BhYG5nFYcBaSBJuClgaScalgPFEG2UknPONissBtZFsHAWohcRwHzkcFZhCupI4DjBe6JWJFOG4QC4SejsJbg6QilTBzQXmkBjucw5OAkwh1XBSYERu/XSJcBrAFFKMgywanXLEHr8U7l6XmOLecooxXI9Md2/xI3EJCDZW9THjCHdJDVkCp4qUPpgPhMVCJ0GWxKkgS+PEyBq4FDK7wqmFm43kLPEPGu9WLlL7+4ODJC1oLXAspBUuhUQ3j6a2OkriSEhrXBYJg0+V9wQ539DPMHC+A9wU8gLNNuRn2Ke+l78hloOpvQowAKKYa7PySxvyAAAAAElFTkSuQmCC"

/***/ }),
/* 240 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAABGCAYAAACaGVmHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDozMGVlZmM2OS0yYmFiLWVhNDUtYWEzNi0yODZhYmE4NDhiYjEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTIwMDc1QjVFQjJGMTFFNEIzNTFDODc4RTA3RTI3MzMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTIwMDc1QjRFQjJGMTFFNEIzNTFDODc4RTA3RTI3MzMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpiNjhmNDJiMS1mNTM1LTRiNjItOTk3Ny0wY2JmNDNhNGVhMzQiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDoyNzFlOWM0ZS0yZDE1LTExNzgtYWQ2NS05YzI0ZDVlYmJlNzAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6eVNpVAAACGUlEQVR42uzcsWrCQBgH8NxdjFFxEhcXB/sAHZ0U3O0juPUB+gR9hG6lW9/EDj5AoQUnxcVBcKvaxvQu1/vgIkHtUKhikv8HRyBR4/fz+74IBtlkMvlotVrVMAxXzl54nld1MhK/5TedTldXJughZm1p6/71hfIQ3EEABShAAQpQgAIUoAAFKEABClAQQAEKUIACFKAABShAAQpQgAKUXIf7r8Kcu0IIn5k45ZvWJpRSQRRF8uJR5vO5PxwO2WazOeknWalUWK/X8xuNxvri2+ccIBR0DjpXKmYKlfW5+t60jk4FSqfTCUql0slhTPvobrcbpGLQNptNORgM1k7KA5dkoAAFKEABClCAAhSgAAUoQAEKAihAAQpQgAIUoAAFKEDJFgr9qsdyljuzeR9FWUcmOOciV9Vg8qW8tdafB8fMztcgCEIhRDFH1cIoX8p7u92+H6BIKR+Xy6VUSslCoVCmG28yjMMoP8qT8qW8Z7PZc+K4jvuKj8fj+3K5fFev113f9z3zRJ5RGE0tQxVCIIvF4qndbj+Y/XRH1O6vQpidK+5oNLqp1Wq3RvGaMVbKat+YcfFlWuaNKqTf77/Y6pAWhJZktiJoyBbMKtqtyMl8IRBl1rcFoa1y7YEocTB5iWYZB4mr5NvmTw7a3RNzEkA8ByiRRVF27QZt8stMPGN44osdyyhIXADx0sdQ9nGcHFRKso128SPAAGO60UTdz1tXAAAAAElFTkSuQmCC"

/***/ }),
/* 241 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAABBCAYAAACHHGk/AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDozMGVlZmM2OS0yYmFiLWVhNDUtYWEzNi0yODZhYmE4NDhiYjEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTg2NkJFOUFFQTU0MTFFNEE0NjNDNjA4M0NFQ0JBMEIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTg2NkJFOTlFQTU0MTFFNEE0NjNDNjA4M0NFQ0JBMEIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozNWY5MGY5MS1lYWI4LTQzMTEtODdmMy1lZTg3NDUwMDdhNjkiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDoyNzFlOWM0ZS0yZDE1LTExNzgtYWQ2NS05YzI0ZDVlYmJlNzAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz67J8ROAAACO0lEQVR42uzavU7CUBQH8H5cS6EyskAIAwkbidEdEiZ9BQdWBl0dnVzdcOEVfADjxBv4BjABEyNiChTrOaQX+YqpSvlo/ye5EWodzo9zbnuKwnVdhaPdbl/RjxtaF7QsJbwxpPVG6ymfz7/yAVVVl05QGYVA7oUQd6lUSpimaWgU/LsQgrifFLZtj/v9vjMejx8LhcIDH19CabValwTynMlkYrqui+l0OqK/m66eGJJQ6fOmNPUY5en0er3RYDC4LhaLL16+s5y5Im65QhhkMpl8EIgTUhBZKQ7nyfly3oZh8JYhPItZd/Cbc24ZrpAQY6zhcL7eVnFG70/kcV6sc8p7iNcykQnOl/OmTdbyUHRZLZrstQhVibJQFfJiIhZbSFMQsig0bylA+UZR51coeKzhoFI2BVCAAhSgAAUoQDmIEHv9RDSNH1mY/JqmVtt7bBFtlG63azabzdldZKVSMdPp9Hvk24dBhsOhwkviRB6FMTa9xkaLqw9QgAIUoAAFAZQd3ObLWUZd/RrfZxiGkfRznksR5Ky0VRQ5y/z17rRer/s6z7IsNchZaavt8x+Q344HQc5KW0Vx5X8A7SCoddyjQCmVSnY8Hg8chtrHLZfL9lFstLlczqlWq777vNFoLG2stVptgEsy7lOAAhSgAAUoCKAA5XhQEonEfCTYxXhwFChyVgp6ltnr7BP0rIQ9BShAAQpQgAIUoAAFARSgAAUoQAEKUA4zfnzI1Ol0kmFJNJvN+v7y/kuAAQDYI83QEXKxowAAAABJRU5ErkJggg=="

/***/ }),
/* 242 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(124)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(103),
  /* template */
  __webpack_require__(253),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-23dbf791",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 243 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(135)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(104),
  /* template */
  __webpack_require__(264),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-858fbf54",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 244 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(125)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(106),
  /* template */
  __webpack_require__(254),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-276979da",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 245 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(123)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(107),
  /* template */
  __webpack_require__(252),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-178115b2",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 246 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(136)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(110),
  /* template */
  __webpack_require__(265),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-a502d4ba",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 247 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(131)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(115),
  /* template */
  __webpack_require__(260),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-457a3ba2",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 248 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(129)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(116),
  /* template */
  __webpack_require__(258),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-3db65aa4",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 249 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(133)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(117),
  /* template */
  __webpack_require__(262),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-55b2758a",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 250 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(127)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(118),
  /* template */
  __webpack_require__(256),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-2ff33775",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 251 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    class: _vm.getStyle,
    on: {
      "click": _vm.onClick
    }
  })
},staticRenderFns: []}

/***/ }),
/* 252 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    on: {
      "click": _vm.onclick
    }
  }, [_c('img', {
    attrs: {
      "src": _vm.item.icon
    }
  }), _vm._v(" "), _c('p', [_vm._v(" " + _vm._s(_vm.item.title) + " ")])])
},staticRenderFns: []}

/***/ }),
/* 253 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('div', {
    staticClass: "bg"
  }), _vm._v(" "), _c('div', {
    staticClass: "content"
  }, [_c('p', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.title !== null),
      expression: "title !== null"
    }],
    staticClass: "title"
  }, [_vm._v(_vm._s(_vm.title))]), _vm._v(" "), _c('p', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.message !== null),
      expression: "message !== null"
    }],
    staticClass: "message"
  }, [_vm._v(_vm._s(_vm.message))]), _vm._v(" "), _c('div', {
    staticClass: "btns"
  }, _vm._l((_vm.buttons), function(button) {
    return _c('div', {
      key: button.name,
      staticClass: "btn",
      on: {
        "click": function($event) {
          _vm.callback(button)
        }
      }
    }, [_vm._v(_vm._s(button.name))])
  }))])])
},staticRenderFns: []}

/***/ }),
/* 254 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    style: ({
      opacity: _vm.opacity
    })
  }, [_c('img', {
    attrs: {
      "src": __webpack_require__(233)
    }
  }), _vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.message))])])
},staticRenderFns: []}

/***/ }),
/* 255 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    class: _vm.getStyle,
    on: {
      "click": _vm.onClick
    }
  })
},staticRenderFns: []}

/***/ }),
/* 256 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "scale_btn"
  }, [_c('div', {
    on: {
      "click": _vm.zoomout
    }
  }, [_c('img', {
    attrs: {
      "src": __webpack_require__(241)
    }
  })]), _vm._v(" "), _c('div', {
    on: {
      "click": _vm.zoomin
    }
  }, [_c('img', {
    attrs: {
      "src": __webpack_require__(240)
    }
  })])])
},staticRenderFns: []}

/***/ }),
/* 257 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "main"
  }, [_c('div', {
    staticClass: "bg",
    on: {
      "click": _vm.onClose
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "content"
  }, [_c('div', {
    staticClass: "closeBtn",
    on: {
      "click": _vm.onClose
    }
  }), _vm._v(" "), _c('img', {
    staticClass: "tag",
    attrs: {
      "src": __webpack_require__(232)
    }
  }), _vm._v(" "), _c('p', {
    staticClass: "title"
  }, [_vm._v("蓝牙自动标记")]), _vm._v(" "), _c('p', {
    staticClass: "tip"
  }, [_vm._v("标记当前位置"), _c('span', [_vm._v(_vm._s(_vm.name))]), _vm._v("为停车位置")]), _vm._v(" "), _c('div', {
    staticClass: "confirmBtn",
    on: {
      "click": _vm.onConfirm
    }
  }, [_vm._v("确定")]), _vm._v(" "), _c('br')])])
},staticRenderFns: []}

/***/ }),
/* 258 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    on: {
      "click": _vm.onClick
    }
  })
},staticRenderFns: []}

/***/ }),
/* 259 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "main"
  }, [_c('div', {
    staticClass: "bg",
    on: {
      "click": _vm.onClose
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "content"
  }, [_c('div', {
    staticClass: "closeBtn",
    on: {
      "click": _vm.onClose
    }
  }), _vm._v(" "), _c('img', {
    staticClass: "tag",
    attrs: {
      "src": __webpack_require__(79)
    }
  }), _vm._v(" "), _c('p', {
    staticClass: "title"
  }, [_vm._v("车牌找车")]), _vm._v(" "), _c('p', {
    staticClass: "tip"
  }, [_vm._v("请输入您的车牌号")]), _vm._v(" "), _c('div', {
    staticClass: "inputandresults"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.carnumber),
      expression: "carnumber"
    }],
    attrs: {
      "placeholder": "例：粤B NB001"
    },
    domProps: {
      "value": (_vm.carnumber)
    },
    on: {
      "focus": _vm.onFocuse,
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.carnumber = $event.target.value
      }
    }
  }), _vm._v(" "), _vm._l((_vm.carlist), function(car, index) {
    return _c('div', {
      key: car.carNo,
      staticClass: "droplist",
      on: {
        "click": function($event) {
          _vm.onSelect(car)
        }
      }
    }, [_c('label', {
      staticClass: "carNo"
    }, [_vm._v(_vm._s(car.carNo))]), _vm._v(" "), _c('label', {
      staticClass: "placeCode"
    }, [_vm._v(_vm._s(car.placeCode))])])
  })], 2), _vm._v(" "), _c('p', {
    class: _vm.getErrorShow
  }, [_vm._v("该车辆不在此停车场，请确认车牌号!")]), _vm._v(" "), _c('div', {
    staticClass: "confirmBtn",
    on: {
      "click": _vm.onConfirm
    }
  }, [_vm._v("确定")]), _vm._v(" "), _vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "cancelBtn",
    on: {
      "click": _vm.onCancel
    }
  }, [_vm._v("输入车位号找车")]), _vm._v(" "), _c('br')])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h5', [_c('span', [_vm._v("  or  ")])])
}]}

/***/ }),
/* 260 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    on: {
      "click": _vm.onclick
    }
  }, [_c('img', {
    attrs: {
      "src": _vm.data.icon
    }
  }), _vm._v(" "), _c('p', [_vm._v(" " + _vm._s(_vm.data.title) + " ")])])
},staticRenderFns: []}

/***/ }),
/* 261 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "main"
  }, [_c('img', {
    staticClass: "quit",
    attrs: {
      "src": __webpack_require__(239)
    },
    on: {
      "click": function($event) {
        _vm.exit(false)
      }
    }
  }), _vm._v(" "), _vm._l((_vm.routers), function(router) {
    return _c('div', {
      key: router.id,
      staticClass: "route"
    }, [_c('span', {
      class: _vm.getSelected(router.id),
      on: {
        "click": function($event) {
          _vm.clickFloor(router.id)
        }
      }
    }, [_vm._v(_vm._s(router.name))]), _c('img', {
      attrs: {
        "src": __webpack_require__(234)
      }
    })])
  }), _vm._v(" "), _c('span', [_vm._v("终")])], 2)
},staticRenderFns: []}

/***/ }),
/* 262 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "pointRev",
    style: ({
      left: _vm.x,
      top: _vm.y
    })
  }, [_c('div', {
    staticClass: "pointDelete"
  }, [_c('img', {
    attrs: {
      "src": __webpack_require__(236)
    },
    on: {
      "click": _vm.onDelete
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "box1"
  }, [_c('div', {
    staticClass: "pointCha"
  }, [_c('img', {
    attrs: {
      "src": __webpack_require__(235)
    },
    on: {
      "click": _vm.onChangePos
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "sharePoint"
  }, [_c('img', {
    attrs: {
      "src": __webpack_require__(237)
    },
    on: {
      "click": _vm.onShare
    }
  })])])])
},staticRenderFns: []}

/***/ }),
/* 263 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "main"
  }, [_c('div', {
    staticClass: "bg",
    on: {
      "click": _vm.onClose
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "content"
  }, [_c('div', {
    staticClass: "closeBtn",
    on: {
      "click": _vm.onClose
    }
  }), _vm._v(" "), _c('img', {
    staticClass: "tag",
    attrs: {
      "src": __webpack_require__(79)
    }
  }), _vm._v(" "), _c('p', {
    staticClass: "title"
  }, [_vm._v("输入车位号找车")]), _vm._v(" "), _c('p', {
    staticClass: "tip"
  }, [_vm._v("请输入您的车辆所停位置的车位号")]), _vm._v(" "), _c('div', {
    staticClass: "floors"
  }, _vm._l((_vm.floorlist), function(floor) {
    return _c('div', {
      key: floor.id,
      staticClass: "floor",
      class: _vm.getFloorStyle(floor.id),
      on: {
        "click": function($event) {
          _vm.onSelectFloor(floor.id)
        }
      }
    }, [_vm._v(_vm._s(floor.name))])
  })), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.unitName),
      expression: "unitName"
    }],
    attrs: {
      "placeholder": "例：026"
    },
    domProps: {
      "value": (_vm.unitName)
    },
    on: {
      "focus": _vm.onFocuse,
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.unitName = $event.target.value
      }
    }
  }), _vm._v(" "), _c('p', {
    staticClass: "errortip",
    style: ({
      visibility: _vm.showerror
    })
  }, [_vm._v("输入有误，请重新输入您的车位号!")]), _vm._v(" "), _c('div', {
    staticClass: "confirmBtn",
    on: {
      "click": _vm.onConfirm
    }
  }, [_vm._v("确定")]), _vm._v(" "), _vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "cancelBtn",
    on: {
      "click": function($event) {
        _vm.onCancel()
      }
    }
  }, [_vm._v("地图标记")]), _vm._v(" "), _c('br')])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h5', [_c('span', [_vm._v("  or  ")])])
}]}

/***/ }),
/* 264 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('p', [_vm._v(_vm._s(_vm.message))])])
},staticRenderFns: []}

/***/ }),
/* 265 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "main"
  }, [_c('div', {
    staticClass: "bg",
    on: {
      "click": _vm.onClose
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "content"
  }, [_c('img', {
    staticClass: "tag",
    attrs: {
      "src": __webpack_require__(238)
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "closeBtn",
    on: {
      "click": _vm.onClose
    }
  }), _vm._v(" "), _c('p', {
    staticClass: "title"
  }, [_vm._v("公共设施")]), _vm._v(" "), _c('p', {
    staticClass: "tip"
  }, [_vm._v("智能搜索 一键导航 规划最短路线")]), _vm._v(" "), _vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "facilities"
  }, _vm._l((_vm.facilities), function(facility) {
    return _c('facilitybtn', {
      key: facility.type,
      staticClass: "facility",
      attrs: {
        "item": facility
      },
      on: {
        "onclickunitwith": _vm.onClickUnit
      }
    })
  }))])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h5', [_c('span', [_vm._v("  搜一下  ")])])
}]}

/***/ }),
/* 266 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('div', {
    staticClass: "currentName",
    on: {
      "click": function($event) {
        _vm.onShow()
      }
    }
  }, [_vm._v(_vm._s(_vm.name())), _c('span', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.checkShow(_vm.selectfloorid)),
      expression: "checkShow(selectfloorid)"
    }],
    staticClass: "lc_dot"
  }, [_vm._v("●")])]), _vm._v(" "), _c('div', {
    class: _vm.dropDownStyle
  }, _vm._l((_vm.floorList), function(floor) {
    return _c('div', {
      key: floor.id,
      class: _vm.getFloorStyle(floor.id),
      on: {
        "click": function($event) {
          _vm.onSelect(floor.id)
        }
      }
    }, [_vm._v(_vm._s(floor.name)), _c('span', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (_vm.checkShow(floor.id)),
        expression: "checkShow(floor.id)"
      }],
      staticClass: "lc_dot"
    }, [_vm._v("●")])])
  }))])
},staticRenderFns: []}

/***/ }),
/* 267 */,
/* 268 */,
/* 269 */,
/* 270 */,
/* 271 */,
/* 272 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Composs; });
function Composs(id, defaultDegree, map) {
    
    var _composs = document.getElementById(id);
    
    var _mapview = map
    
    var _currentValue = 0
    
    var _lastClickTime = null
    
    _composs.addEventListener('click', onCompossClick)
    
    function onCompossClick() {
        
        var time = new Date()
        
        if (!_lastClickTime || time.getTime() - _lastClickTime > 2000) {
    
            _mapview.resetMap()
    
            _lastClickTime = time.getTime()
        }
    }
    
    function rotateToDegree(degree) {
        
        _currentValue = degree
        
        _composs.style.transform = "rotate(" + _currentValue + "deg)";
    }

    this.show = function (show) {

        if (show) {

            _composs.style.visibility = 'visible'
        }
        else {

            _composs.style.visibility = 'hidden'
        }
    }
    
    this.rotateToDegree = rotateToDegree
};



/***/ }),
/* 273 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return idrDataMgr; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__idrNetworkManager_js__ = __webpack_require__(7);
/**
 * Created by yan on 01/03/2017.
 */



function idrDataManager() {
    
    this.regionAllInfo = null
}

idrDataManager.prototype.loadRegionInfo = function(regionId, success, failed) {
    
    var that = this
    
    __WEBPACK_IMPORTED_MODULE_0__idrNetworkManager_js__["a" /* default */].serverCallRegionAllInfo(regionId, function (response) {
        
        that.regionAllInfo = response
        
        if (typeof success === "function") {
            
            success(that.regionAllInfo)
        }
    }, failed)
}

var idrDataMgr = new idrDataManager()



/***/ }),
/* 274 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return idrGlMap; });
/**
 * Created by ky on 17-6-20.
 */

function idrGlMap(mapView) {
	
	var maxScale = 1.5
	
	var minScale = 1
	
	var _mapScale = 1
	
	var _mapView = mapView
	
	var _regionEx = null
	
	var _floor = null
	
	var _origScale = 0.5
	
	var _mapRoot = null
	
	var _canvas_txt = null
	
	var _canvas_gl = null
	
	var _floorList = []
	
	var _region = null
	
	var _unitAddFloor = {}
	
	var listener = {
		
		onLoadFinish : function(floorId, floorIndex){
			
			console.log('onLoadFinish')
		},
		
		onLoadFailed : function(floorId, floorIndex){
			
			console.log('onLoadFailed')
		},
		
		onAllFloorLoadFinish : function(){
			
			onAllFloorLoaded()
		},
		
		onStatusChange : function(status){
		
		},
		
		onAnimStart : function(anim){
		},
		
		onAnimFinish : function(anim){
		},
		
		onAnimCancel : function(anim){
		
		},
		
		onClick : function(x, y){
			
			handleClick(x, y)
		},
		
		onDClick : function(x, y){
		
		},
		
		on2FClick : function(x, y){
		
		},
		
		onLongPressUp : function(x, y){
			
			handleLongPressUp(x, y)
		},
		
		onScroll: function(x, y) {
			
			handleMapScroll(x, y)
		}
	}
	
	var _currentFloorId = null
	
	this.init = function(regionEx, floorId, container) {
		
		_regionEx = regionEx
		
		_currentFloorId = floorId
		
		_floor = _regionEx.getFloorbyId(floorId)
		
		createCanvas(container)
		
		for (var i = _regionEx.floorList.length - 1; i >= 0; --i) {
			
			var data = {}
			
			data.id = _regionEx.floorList[i].id
			
			data.svg = _regionEx.floorList[i].mapSvg
			
			data.deflection = _regionEx.northDeflectionAngle
			
			_floorList.push(data)
		}
		
		_region = new Region("testRegion", _canvas_gl, _canvas_txt, listener);
		
		_region.setUIScaleRate(0.38333333)
		
		_region.addTexture("pubIcons", _mapView.publicPath + "/static/img_pub_icons.png");
		
		_region.addTexture("parking", _mapView.publicPath + "/static/img_parking.png");
		
		_region.addFloorsSVG(_floorList);
		
		_region.setFontColor('#825537')
		
		_region.setFontType('24px Arial')
		
		_region.startRender();
		
		_region.displayFloor(_floor.floorIndex)
		
		_region.animPitch(0)//设置为 2d
		
		_region.setAlwaysDrawUnit(true)

        _region.addTexture('locatepos', _mapView.publicPath + '/static/locatepos.png')

        _region.setLocMarkerParam('locatepos', 0x70145082, 200, 75)
    }
	
	function changeToFloor(floorId) {
		
		_currentFloorId = floorId
		
		_floor = _regionEx.getFloorbyId(floorId)
		
		_region.displayFloor(_floor.floorIndex)
		
		onAllFloorLoaded()
	}
	
	function onAllFloorLoaded() {
		
		_mapView.onLoadMapSuccess()
	}
	
	function createEle(type, id, className) {
		
		var ele = document.createElement(type)
		
		ele.id = id
		
		ele.className = className
		
		return ele
	}
	
	function createCanvas(containor) {
		
		_mapRoot = createEle('div', 'mapRoot', 'indoorunMap_map')
		
		_canvas_gl = document.getElementById('gl-canvas')
		
		if (!_canvas_gl) {
			
			_canvas_gl = createEle('canvas', 'gl-canvas', 'canvas-frame')
			
			_canvas_gl.width = 1080
			
			_canvas_gl.height = 1920
		}
		
		_mapRoot.appendChild(_canvas_gl)
		
		_canvas_txt = document.getElementById('txt-canvas')
		
		if (!_canvas_txt) {
			
			_canvas_txt = createEle('canvas', 'txt-canvas', 'canvas-frame')
			
			_canvas_txt.width = 1080
			
			_canvas_txt.height = 1920
		}
		
		_mapRoot.appendChild(_canvas_txt)
		
		containor.appendChild(_mapRoot)
	}
	
	function updateUnitsColor(units, color) {
		
		units.forEach(function(unit) {
			
			_region.addQuickPolygon(_floor.floorIndex, unit.getPts(), color)
		})
		
		_region.buildQuickPolygonFloor(_floor.floorIndex)
	}
	
	function clearUnitsColor(units) {
		
		units.forEach(function(unit) {
			
			unit.color = null
		})
		
		_region.cleanQuickPolygonFloor(_floor.floorIndex)
	}
	
	function clearFloorUnitsColor(allFloor) {
		
		if (!allFloor) {
			
			_region.cleanQuickPolygonFloor(_floor.floorIndex)
			
			return
		}
		
		for (var i = 0; i < _regionEx.floorList.length; ++i) {
			
			_region.cleanQuickPolygonFloor(_regionEx.floorList[i].floorIndex)
		}
	}
	
	function addUnits(unitList) {
	   
    if (_floor.id in _unitAddFloor) {
        
        return
    }
		
		_unitAddFloor[_floor.id] = true
		
		for (var i = 0; i < unitList.length; ++i) {
			
			var unit = unitList[i]
			
			var unitMapObj = {}
			
			unitMapObj.type = parseFloat(unit.unitTypeId)
			
			unitMapObj.text = unit.name
			
			var pos = unit.getPos()
			
			_region.insertUnit(unitMapObj, _floor.floorIndex, pos.x, pos.y)
		}
	}
	
	function removeMarker(marker) {
		
		if (marker) {
			
			_region.removeMarker(marker.id)
			
			// console.log('移除marker')
		}
	}
	
	function getDistance(pos1, pos2) {
		
		return Math.sqrt((pos2.y - pos1.y) * (pos2.y - pos1.y) + (pos2.x - pos1.x) * (pos2.x - pos1.x))
	}
	
	function findUnit(x, y) {
		
		var minUnit = null
		
		var minDistance = 10000
		
		for (var i = 0; i < _floor.unitList.length; ++i) {
			
			var unit = _floor.unitList[i]
			
			var dis = getDistance({x:x, y:y}, unit.getPos())
			
			if (dis < minDistance) {
				
				minUnit = unit
				
				minDistance = dis
			}
		}
		
		return minUnit
	}
	
	function handleMapScroll(x, y) {
		
		_mapView.onMapScroll(x, y)
	}
	
	function handleLongPressUp(x, y) {
		
		var mapLoc = _region.getTouchPosMapLoc(x, y)
		
		_mapView.onMapLongPress({x:mapLoc.x, y:mapLoc.y, floorId:_currentFloorId})
	}
	
	function handleClick(x, y) {
		
		var markerId = _region.searchMarker(x, y)

        var mapLoc = _region.getTouchPosMapLoc(x, y)

        console.log(mapLoc.x, mapLoc.y)
		
		console.log(markerId)
		
		if (markerId !== -1) {
			
			_mapView.onMarkerClick(_currentFloorId, markerId)
			
			return
		}
		
		var units = _region.searchUnit(x, y)
		
		if (units.length > 0) {

            var unit = findUnit(units[0].x, units[0].y)
			
			_mapView.onUnitClick(unit)
			
			return
		}

		var icons = _region.searchIcon(x, y)

        if (icons.length > 0) {

            var unit = findUnit(icons[0].x, icons[0].y)

            _mapView.onUnitClick(unit)

            return
        }
		
		_mapView.onMapClick({x:mapLoc.x, y:mapLoc.y, floorId:_currentFloorId})
	}
	
	function addMarker(marker) {
		
		_region.addTexture(marker.className, marker.image)
		
		console.log('_floor.floorIndex' + _floor.floorIndex + ' ' + marker.position.x + ' ' + marker.position.y)
		
		var floor = _regionEx.getFloorbyId(marker.position.floorId)
		
		if (floor) {
			
			marker.id = _region.insertTextureMarker(marker.className, floor.floorIndex, marker.position.x, marker.position.y, 0, 0, 80)
		}
	}
	
	function detach() {
	
	
	}
	
	function attachTo(containor) {
	
	
	}
	
	function setPos(pos) {
		
		if (!pos || pos.floorId !== _currentFloorId) {
			
			_region.cleanLocation()
			
			return
		}
		
		var floor = _regionEx.getFloorbyId(pos.floorId)
		
		if (floor) {
			
			_region.setLocation(floor.floorIndex, pos.x, pos.y)
			
			_region.locateLaunch()
		}
	}
	
	function resetMap() {
		
		_region.overlookMap(_regionEx.getFloorIndex(_currentFloorId))
		
		_region.animPitch(0)//设置为 2d
	}

	function set25dMap() {

        _region.animPitch(45)
    }
	
	function scroll(screenVec) {
	
	
	}
	
	function zoom(scale) {
		
		var dis = _region.getLookDistance()
		
		if (dis < 100 || dis > 4000) {
			
			return
		}

		var value = dis * scale

        value = Math.min(value, 4000)

        value = Math.max(100, value)

		_region.animLookDistance(value)
	}
	
	function birdLook() {
		
		_region.overlookRoute()
	}
	
	function showRoutePath(path) {
		
		if (!path) {
			
			_region.cleanRoute()
			
			return
		}
		
		var pathInfloor = getTargetFloorPoints(path, _currentFloorId)
		
		if (!pathInfloor) {
			
			_region.cleanRoute()
			
			return
		}
		
		var data = []
		
		pathInfloor.forEach(function(p) {
			"use strict";
			var pos = {}
			
			pos.floor = _regionEx.getFloorIndex(p.floorId)
			
			pos.x = p.x
			
			pos.y = p.y
			
			data.push(pos)
		})
		
		_region.setRoute(data)
	}
	
	function getNaviStatus() {
		
		if (_region) {
			
			return _region.getNaviStatus()
		}
		
		return null
	}
	
	function getMapPos(svgPos) {
	
	
	}
	
	function getScreenPos(mapPos) {
		
		var floorIndex = _regionEx.getFloorbyId(mapPos.floorId).floorIndex
		
		var v = _region.floorPos2RegionPos(floorIndex, mapPos.x, mapPos.y)
		
		var p = _region.regionPos2Screen(v)
		
		return {x:p[0] * 0.3833333, y:p[1] * 0.3833333}
	}
	
	function rotate(rad, anchor) {
	
	
	}
	
	function centerPos(mapPos, anim) {
		
		var floor = _regionEx.getFloorbyId(mapPos.floorId)
		
		if (anim) {
			
			_region.animLookAt(floor.floorIndex, mapPos.x, mapPos.y)
		}
		else {
			
			_region.lookAtMapLoc(floor.floorIndex, mapPos.x, mapPos.y)
		}
		
	}
	
	function updateDisplay() {
	
	
	}
	
	function updateRoutePath() {
	
	}
	
	function getTargetFloorPoints(path, floorId) {
		
		if (!path) {
			
			return null
		}
		
		var result = []
		
		for (var i = 0; i < path.paths.length; ++i) {
			
			var floorPath = path.paths[i]
			
			if (floorPath.floorId === floorId) {
				
				result = result.concat(floorPath.position)
			}
		}
		
		if (result.length == 0) {
			
			return null
		}
		
		return result
	}
	
	function getMapScale() {
		
		return _mapScale
	}
	
	function getMapRotate() {
		
		var val = _region.getFloorAngle(_floor.floorIndex)
		
		return val
	}
	
	this.updateMinScale = function() {
	
	}
	
	function updateMarkerLocation(marker, pos) {
		
		var floor = _regionEx.getFloorbyId(pos.floorId)
		
		marker.id = _region.updateMarkerLocation(marker.id, floor.floorIndex, pos.x, pos.y)
		
		marker.position = pos
	}

    function addObjModel(){

        var baseUrl = _mapView.publicPath + "/static/model/";
        var m;

        m = new ObjModel(_region);
        m.x = 877;
        m.y = 1263;
        m.loadURLDir(baseUrl, "js001",
            function(model){
                _region.insertModel(0, model, 50, 0.24, model.x, model.y, 2);
            },
            function(status){
                console.log("load obj model faild:"+status);
            });
        m = new ObjModel(_region);
        m.x = 935;
        m.y = 1263;
        m.loadURLDir(baseUrl, "js001",
            function(model){
                _region.insertModel(0, model, -50, 0.24, model.x, model.y, 2);
            },
            function(status){
                console.log("load obj model faild:"+status);
            });


        m = new ObjModel(_region);
        m.x = 877;
        m.y = 1140;
        m.loadURLDir(baseUrl, "js001",
            function(model){
                _region.insertModel(0, model, -50, 0.24, model.x, model.y, 2);
            },
            function(status){
                console.log("load obj model faild:"+status);
            });
        m = new ObjModel(_region);
        m.x = 935;
        m.y = 1140;
        m.loadURLDir(baseUrl, "js001",
            function(model){
                _region.insertModel(0, model, 50, 0.24, model.x, model.y, 2);
            },
            function(status){
                console.log("load obj model faild:"+status);
            });

        m = new ObjModel(_region);
        m.x = 872;
        m.y = 1182;
        m.loadURLDir(baseUrl, "js002",
            function(model){
                _region.insertModel(0, model, 0, 0.24, model.x, model.y, 2);
            },
            function(status){
                console.log("load obj model faild:"+status);
            });

        m = new ObjModel(_region);
        m.x = 872;
        m.y = 1220;
        m.loadURLDir(baseUrl, "js003",
            function(model){
                _region.insertModel(0, model, 0, 0.24, model.x, model.y, 2);
            },
            function(status){
                console.log("load obj model faild:"+status);
            });

        m = new ObjModel(_region);
        m.x = 866;
        m.y = 1148;
        m.loadURLDir(baseUrl, "js004",
            function(model){
                _region.insertModel(0, model, -90, 0.24, model.x, model.y, 2);
            },
            function(status){
                console.log("load obj model faild:"+status);
            });

        m = new ObjModel(_region);
        m.x = 870;
        m.y = 1162;
        m.loadURLDir(baseUrl, "js005",
            function(model){
                _region.insertModel(0, model, -90, 0.24, model.x, model.y, 2);
            },
            function(status){
                console.log("load obj model faild:"+status);
            });

        m = new ObjModel(_region);
        m.x = 870;
        m.y = 1240;
        m.loadURLDir(baseUrl, "js006",
            function(model){
                _region.insertModel(0, model, -90, 0.24, model.x, model.y, 2);
            },
            function(status){
                console.log("load obj model faild:"+status);
            });

        m = new ObjModel(_region);
        m.x = 955;
        m.y = 1267;
        m.loadURLDir(baseUrl, "js007",
            function(model){
                _region.insertModel(0, model, -90, 0.24, model.x, model.y, 2);
            },
            function(status){
                console.log("load obj model faild:"+status);
            });

        m = new ObjModel(_region);
        m.x = 972;
        m.y = 1269;
        m.loadURLDir(baseUrl, "js002",
            function(model){
                _region.insertModel(0, model, -90, 0.24, model.x, model.y, 2);
            },
            function(status){
                console.log("load obj model faild:"+status);
            });

        m = new ObjModel(_region);
        m.x = 926;
        m.y = 1203;
        m.loadURLDir(baseUrl, "js008",
            function(model){
                _region.insertModel(0, model, -90, 1.2, model.x, model.y, 0);
            },
            function(status){
                console.log("load obj model faild:"+status);
            });

        /**
         * 六角台子
         */
        m = new ObjModel(_region);
        m.x = 908;
        m.y = 1201;
        m.loadURLDir(baseUrl, "js010",
            function(model){
                _region.insertModel(0, model, 0, 0.5, model.x, model.y, 0);
            },
            function(status){
            });
        m = new ObjModel(_region);
        m.x = 908;
        m.y = 1201;
        m.loadURLDir(baseUrl, "js010",
            function(model){
                _region.insertModel(0, model, 60, 0.5, model.x, model.y, 0);
            },
            function(status){
            });
        m = new ObjModel(_region);
        m.x = 908;
        m.y = 1201;
        m.loadURLDir(baseUrl, "js010",
            function(model){
                _region.insertModel(0, model, 120, 0.5, model.x, model.y, 0);
            },
            function(status){
            });
        m = new ObjModel(_region);
        m.x = 908;
        m.y = 1201;
        m.loadURLDir(baseUrl, "js010",
            function(model){
                _region.insertModel(0, model, 180, 0.5, model.x, model.y, 0);
            },
            function(status){
            });
        m = new ObjModel(_region);
        m.x = 908;
        m.y = 1201;
        m.loadURLDir(baseUrl, "js010",
            function(model){
                _region.insertModel(0, model, 240, 0.5, model.x, model.y, 0);
            },
            function(status){
            });
        m = new ObjModel(_region);
        m.x = 908;
        m.y = 1201;
        m.loadURLDir(baseUrl, "js010",
            function(model){
                _region.insertModel(0, model, 300, 0.5, model.x, model.y, 0);
            },
            function(status){
            });
    }
	
	this.getMapScale = getMapScale
	
	this.getMapRotate = getMapRotate
	
	this.detach = detach
	
	this.attachTo = attachTo
	
	this.setPos = setPos
	
	this.addMarker = addMarker
	
	this.resetMap = resetMap
	
	this.birdLook = birdLook
	
	this.showRoutePath = showRoutePath
	
	this.getScreenPos = getScreenPos
	
	this.updateUnitsColor = updateUnitsColor
	
	this.clearFloorUnitsColor = clearFloorUnitsColor
	
	this.getMapPos = getMapPos
	
	this.zoom = zoom
	
	this.scroll = scroll
	
	this.rotate = rotate
	
	this.centerPos = centerPos
	
	this.updateDisplay = updateDisplay
	
	this.updateRoutePath = updateRoutePath
	
	this.changeToFloor = changeToFloor
	
	this.addUnits = addUnits
	
	this.removeMarker = removeMarker
	
	this.root = function () {
		
		return _mapRoot
	}
	
	this.updateMarkerLocation = updateMarkerLocation
	
	this.clearUnitsColor = clearUnitsColor
	
	this.getNaviStatus = getNaviStatus

    this.setDynamicNavi = function (value) {

	    if (_region) {

            _region.setNavigateProj(value)
        }
    }

    this.set25dMap = set25dMap

    this.addObjModel = addObjModel
}



/***/ }),
/* 275 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return idrMapEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return idrMapEventTypes; });
/**
 * Created by ky on 17-5-4.
 */

var idrMapEventTypes = {
    
    onInitMapSuccess:'onInitMapSuccess',
    
    onFloorChangeSuccess:'onFloorChangeSuccess',
    
    onMapClick:'onMapClick',
    
    onMarkerClick:'onMarkerClick',
    
    onUnitClick:'onUnitClick',
    
    onRouterSuccess:'onRouterSuccess',
    
    onRouterFinish:'onRouterFinish',
    
    onMapLongPress:'onMapLongPress',
    
    onMapScroll:'onMapScroll',
    
    onRouterFailed:'onRouterFailed',
    
    onRouterPathUpdate:'onRouterPathUpdate',
    
    onNaviStatusUpdate:'onNaviStatusUpdate'
}

function idrMapEvent() {
    
    this.events = {}

    this.oncesEvents = {}
    
    this.checkEvent = function(type) {
        
        if (this.events.hasOwnProperty(type)) {
            
            var property = this.events[type]
            
            return property !== null
        }
        
        return false
    }
    
    this.removeEvent = function(type) {
        
        if (!idrMapEventTypes.hasOwnProperty(type)) {
            
            return false
        }
        
        this.events[type] = null
        
        return true
    }
    
    this.fireEvent = function(type, data) {
        
        if (!idrMapEventTypes.hasOwnProperty(type)) {
            
            return false
        }
        
        var fn = this.events[type]
        
        fn && fn(data)
        
        return true
    }
    
    this.addEvent = function(type, fn) {
        
        if (!idrMapEventTypes.hasOwnProperty(type)) {
            
            return false
        }
        
        this.events[type] = fn
        
        return true
    }
    
    this.fireOnce = function (type, data) {

        if (!idrMapEventTypes.hasOwnProperty(type)) {

            return false
        }

        var fn = this.oncesEvents[type]

        if (!fn) {

            return false
        }

        if (fn(data)) {

            this.oncesEvents[type] = null
        }

        return true
    }
    
    this.addOnce = function(type, fn) {

        this.oncesEvents[type] = fn
    }
}



/***/ }),
/* 276 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return idrMapView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__idrDataManager_js__ = __webpack_require__(273);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__idrNetworkManager_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__idrRouter_js__ = __webpack_require__(277);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__idrRegionEx_js__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__idrUnit_js__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__idrDebug__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__IDRMapMarker_IDRMapMarker_js__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__Composs_IDRComposs_js__ = __webpack_require__(272);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__idrMapEvent_js__ = __webpack_require__(275);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__idrCoreManager_js__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__idrLocationServer_js__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__idrGlMap_js__ = __webpack_require__(274);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__idrBeaconManager__ = __webpack_require__(81);
/**
 * Created by yan on 09/02/2017.
 */



























function idrMapView() {

  this.eventTypes = __WEBPACK_IMPORTED_MODULE_8__idrMapEvent_js__["a" /* idrMapEventTypes */]

  this.regionEx = null

  this.autoChangeFloor = true

  var _locator = __WEBPACK_IMPORTED_MODULE_10__idrLocationServer_js__["a" /* default */]

  var _router = null

  var _container = null

  var _currentPos = null

  var _regionId = null

  var _currentFloorId = null

  var _units = []

  var _mapRoot = null

  var _mapEvent = new __WEBPACK_IMPORTED_MODULE_8__idrMapEvent_js__["b" /* idrMapEvent */]()

  var _dynamicNavi = false

  var _inNavi = false

  var _markers = {}

  var _idrMap = null

  var _path = null

  var _composs = null

  var self = this

  var _naviParm = null

  var _displayAnimId = null

  var _naviStatusUpdateTimer = null

  function onMapClick(pos) {

    _mapEvent.fireEvent(self.eventTypes.onMapClick, pos)
  }

  function showComposs(show) {

    if (!_composs) {

      return
    }

    _composs.show(show)
  }

  function doLocation(success, failed) {

    if (!_locator.isStart()) {

      _locator.start(_regionId, _currentFloorId, success, failed)
    }
  }

  function getRoutePath(start, end) {

    return _router.routerPath(start, end, false)
  }

  function doRoute(start, end, car) {

    _inNavi = false

    if (!start) {

      _dynamicNavi = true

      start = _currentPos
    }
    else {

      _dynamicNavi = false
    }

    if (!start) {

      return false
    }

    _path = null

    if (car === undefined) {

      _path = _router.routerPath(start, end, false)
    }
    else {

      _path = _router.routerPath(start, end, car)
    }

    if (!_path) {

      return false
    }

    if (_path.distance < 120) {

      _mapEvent.fireEvent(self.eventTypes.onRouterFailed, '您已在目的地附近')

      return false
    }

    _naviParm = {
      start:start,
      end:end,
      car:car,
      dynamic:_dynamicNavi
    }

    _inNavi = true

    showRoutePath(_path)

    _mapEvent.fireEvent(self.eventTypes.onRouterSuccess, {path:_path, end:end, start:start})

    _naviStatusUpdateTimer = setInterval(function() {

      _mapEvent.fireEvent(self.eventTypes.onNaviStatusUpdate, _idrMap.getNaviStatus())

    }, 1000)

    return true
  }

  function stopRoute() {

    _path = null

    _naviParm = null

    _inNavi = false

    _idrMap.showRoutePath(null)

    _mapEvent.fireEvent(self.eventTypes.onRouterFinish, null)

    clearInterval(_naviStatusUpdateTimer)

    _naviStatusUpdateTimer = null
  }

  function showRoutePath(paths) {

    _idrMap.showRoutePath(paths)

    _idrMap.setDynamicNavi(_dynamicNavi)
  }

  function reRoute() {

    if (!_naviParm || !_naviParm.dynamic) {

      return
    }

    if (_naviParm === undefined) {

      _path = _router.routerPath(_currentPos, _naviParm.end, false)
    }
    else {

      _path = _router.routerPath(_currentPos, _naviParm.end, _naviParm.car)
    }

    showRoutePath(_path)
  }

  function onMapScroll(x, y) {

    if (_mapEvent.fireOnce(self.eventTypes.onMapScroll, {x:x, y:y})) {

      return
    }

    _mapEvent.fireEvent(self.eventTypes.onMapScroll, {x:x, y:y})
  }

  function onMapLongPress(pos) {

    if (_mapEvent.fireOnce(type, pos)) {

      return
    }

    _mapEvent.fireEvent(self.eventTypes.onMapLongPress, pos)
  }

  function onUnitClick(unit) {

    if (_mapEvent.fireOnce(self.eventTypes.onUnitClick, unit)) {

      return
    }

    _mapEvent.fireEvent(self.eventTypes.onUnitClick, unit)
  }

  function updateUnitsColor(units, color) {

    _idrMap.updateUnitsColor(units, color)
  }

  function clearUnitsColor(units) {

    _idrMap.clearUnitsColor(units)
  }

  function clearFloorUnitsColor(allfloor) {

    _idrMap.clearFloorUnitsColor(allfloor)
  }

  function createMap() {

    if (!_idrMap) {

      _idrMap = new __WEBPACK_IMPORTED_MODULE_11__idrGlMap_js__["a" /* default */](self)

      _idrMap.init(self.regionEx, _currentFloorId, _container)
    }
    else  {

      _idrMap.changeToFloor(_currentFloorId)
    }
  }

  function updateDisplay() {

    _displayAnimId = requestAnimationFrame(function () {

      if (_composs) {

        _composs.rotateToDegree(_idrMap.getMapRotate())
      }

      updateDisplay()
    })
  }

  function addComposs() {

    if (_composs) {

      return
    }

    var div = document.createElement('div')

    div.setAttribute('id', 'composs')

    _container.appendChild(div)

    _composs = new __WEBPACK_IMPORTED_MODULE_7__Composs_IDRComposs_js__["a" /* default */]('composs', 0, self)
  }

  function loadMap() {

    createMap(_regionId, _currentFloorId)
  }

  function changeFloor(floorId) {

    _currentFloorId = floorId

    loadMap()
  }

  function initMap(appid, containerId, regionId) {

    _container = document.getElementById(containerId)

    __WEBPACK_IMPORTED_MODULE_9__idrCoreManager_js__["a" /* default */].init(appid, function() {

      console.log('begin loadRegionInfo')

      __WEBPACK_IMPORTED_MODULE_0__idrDataManager_js__["a" /* default */].loadRegionInfo(regionId, function(res) {

        self.regionEx = new __WEBPACK_IMPORTED_MODULE_3__idrRegionEx_js__["a" /* default */](res['data'])

        _regionId = regionId

        _mapEvent.fireEvent(self.eventTypes.onInitMapSuccess, self.regionEx)

      }, function() {

        console.log('load region data failed')
      })
    })
  }

  function onLoadMapSuccess() {

    addComposs()

    _mapRoot = _idrMap.root()

    _idrMap.showRoutePath(_path)

    _idrMap.setPos(_currentPos)

    var floor = self.regionEx.getFloorbyId(_currentFloorId)

    _idrMap.addUnits(floor.unitList)

    updateDisplay()

    _mapEvent.fireEvent(self.eventTypes.onFloorChangeSuccess, {floorId:_currentFloorId, regionId:_regionId})

    setTimeout(function() {

      if (!_router) {

        __WEBPACK_IMPORTED_MODULE_1__idrNetworkManager_js__["a" /* default */].serverCallRegionPathData(_regionId, function(res) {

          var gmtime = new Date()

          self.regionEx.regionPath = res.data

          _router = new __WEBPACK_IMPORTED_MODULE_2__idrRouter_js__["a" /* default */](self.regionEx.floorList, self.regionEx.regionPath)

          // idrDebug.debugInfo('加载时间RegionPathData:' + (new Date().getTime() - gmtime).toString())

        }, null)

      }
    }, 500)
  }

  function addEventListener(type, fn) {

    return _mapEvent.addEvent(type, fn)
  }

  function addOnceEvent(type, fn) {

    return _mapEvent.addOnce(type, fn)
  }

  function removeEventListener(type) {

    return _mapEvent.removeEvent(type)
  }

  function fireEvent(type, data) {

    return _mapEvent.fireEvent(type, data)
  }

  function removeMarker(marker) {

    console.log('移除marker')
    if (!marker) {

      return
    }

    var temp = []

    for (var i = 0; i < _markers[marker.position.floorId].length; ++i) {

      var tempMarker = _markers[marker.position.floorId][i]

      if (tempMarker.id !== marker.id) {

        temp.push(tempMarker)
      }
    }

    _markers[marker.position.floorId] = temp

    _idrMap.removeMarker(marker)
  }

  function getMarkers(floorId) {

    if (floorId in _markers) {

      return _markers[floorId]
    }

    return null
  }

  function addMarker(marker) {

    if (!_markers.hasOwnProperty(marker.position.floorId)) {

      _markers[marker.position.floorId] = new Array()
    }

    _markers[marker.position.floorId].push(marker)

    _idrMap.addMarker(marker)

    console.log('加marker')

    return marker
  }

  function findMarker(floorId, markerId) {

    if (!_markers.hasOwnProperty(floorId)) {

      return null
    }

    var markersArray = _markers[floorId]

    for (var i = 0; i < markersArray.length; ++i) {

      if (markerId === markersArray[i].id) {

        return markersArray[i]
      }
    }

    return null
  }

  function onMarkerClick(floorId, markerId) {

    var marker = findMarker(floorId, markerId)

    if (_mapEvent.fireOnce(self.eventTypes.onMarkerClick, marker)) {

      return
    }

    _mapEvent.fireEvent(self.eventTypes.onMarkerClick, marker)
  }

  function getMapPos(screenPos) {

    return _idrMap.getMapPos(screenPos)
  }

  function getScreenPos(mapPos) {

    return _idrMap.getScreenPos(mapPos)
  }

  function zoom(scale) {

    _idrMap.zoom(scale)
  }

  function scroll(screenVec) {

    _idrMap.scroll(screenVec)
  }

  function rotate(rad, anchor) {

    _idrMap.rotate(rad, anchor)
  }

  function centerPos(mapPos, anim) {

    if (!mapPos) {

      return
    }

    if (mapPos.floorId !== _currentFloorId) {

      changeFloor(mapPos.floorId)
    }

    _idrMap.centerPos(mapPos, anim)
  }

  function resetMap() {

    _idrMap.resetMap()
  }

  function birdLook() {

    _idrMap.birdLook()
  }

  function setPos(pos) {

    _idrMap.setPos(pos)
  }

  function Positionfilter(ps, pe, v) {

    if (ps == null) return;

    var d = Math.sqrt((ps.x - pe.x)*(ps.x - pe.x) + (ps.y - pe.y)*(ps.y - pe.y));

    if (d > v){

      pe.x=(ps.x * (d - v) + pe.x * v) / d;

      pe.y=(ps.y * (d - v) + pe.y * v) / d;
    }
  }

  function setUserPos(pos) {

    var p = {x:pos.x, y:pos.y, floorId:pos.floorId}

    if (_currentPos && _currentPos.floorId === pos.floorId) {

      Positionfilter(_currentPos, p, 40)
    }

    _currentPos = p

    if (pos.floorId !== _currentFloorId && self.autoChangeFloor) {

      changeFloor(p.floorId)
    }
    else  {

      setPos(p)
    }
  }

  function updateMarkerLocation(marker, pos) {

    removeMarker(marker)

    marker.position = pos

    addMarker(marker)

    return marker
  }

  function findUnitWithId(unitId) {

    for (var i = 0; i < self.regionEx.floorList.length; ++i) {

      var floor = self.regionEx.floorList[i]

      for (var j = 0; j < floor.unitList.length; ++j) {

        var unit = floor.unitList[j]

        if (unit.id === unitId) {

          return unit
        }
      }
    }

    return null
  }

  function findUnitWithName(floorId, name) {

    var floor = self.regionEx.getFloorbyId(floorId)

    var results = null

    for (var i = 0; i < floor.unitList.length; ++i) {

      var unit = floor.unitList[i]

      var index = unit.name.indexOf(name)

      if (index !== -1 && index + name.length == unit.name.length) {

        if (!results) {

          results = []
        }

        results.push(unit)
      }
    }

    return results
  }

  function findNearUnit(pos, targetunits) {

    return self.regionEx.getNearUnit(pos, targetunits)
  }

  function getNearUnit(pos) {

    var floor = self.regionEx.getFloorbyId(pos.floorId)

    return self.regionEx.getNearUnit(pos, floor.unitList)
  }

  function findUnitsWithType(types) {

    var result = {}

    var floor = null

    for (var k = 0; k < self.regionEx.floorList.length; ++k) {

      var floor = self.regionEx.floorList[k]

      for (var i = 0; i < floor.unitList.length; ++i) {

        var unit = floor.unitList[i]

        for (var j = 0; j < types.length; ++j) {

          if (unit.unitTypeId == types[j]) {

            if (unit.unitTypeId in result) {

              result[unit.unitTypeId].push(unit)
            }
            else  {

              result[unit.unitTypeId] = [unit]
            }
          }
        }
      }
    }

    return result
  }

  this.centerPos = centerPos

  this.resetMap = resetMap

  this.birdLook = birdLook

  this.getMapPos = getMapPos

  this.getScreenPos = getScreenPos

  this.zoom = zoom

  this.scroll = scroll

  this.rotate = rotate

  this.setCurrPos = setUserPos

  this.addMarker = addMarker

  this.removeMarker = removeMarker

  this.changeFloor = changeFloor

  this.showRootPath = showRoutePath

  this.addComposs = addComposs

  this.initMap = initMap

  this.addEventListener = addEventListener

  this.addOnceEvent = addOnceEvent

  this.removeEventListener = removeEventListener

  this.fireEvent = fireEvent

  this.doRoute = doRoute

  this.doLocation = doLocation

  this.onUnitClick = onUnitClick

  this.onMapClick = onMapClick

  this.onMarkerClick = onMarkerClick

  this.getMarkers = getMarkers

  this.updateUnitsColor = updateUnitsColor

  this.clearUnitsColor = clearUnitsColor

  this.stopRoute = stopRoute

  this.updateDisplay = updateDisplay

  this.onLoadMapSuccess = onLoadMapSuccess

  this.getUserPos = function () {

    return _currentPos
  }

  this.getRegionId = function() {

    return _regionId
  }

  this.getFloorId = function() {

    return _currentFloorId
  }

  this.findUnitsWithType = findUnitsWithType

  this.getRoutePath = getRoutePath

  this.onMapLongPress = onMapLongPress

  this.onMapScroll = onMapScroll

  this.findUnitWithId = findUnitWithId

  this.findUnitWithName = findUnitWithName

  this.getNearUnit = getNearUnit

  this.updateMarkerLocation = updateMarkerLocation

  this.clearFloorUnitsColor = clearFloorUnitsColor

  this.findNearUnit = findNearUnit

  this.isDynamicNavi = function () {

    return _dynamicNavi
  }

  this.isInNavi = function () {

    return _inNavi
  }

  this.set25dMap = function () {

    _idrMap.set25dMap()
  }

  this.showComposs = showComposs

  this.addObjModel = function () {

    _idrMap.addObjModel()
  }

  this.reRoute = reRoute
}



/***/ }),
/* 277 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return idrRouter; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__pathRoute_PathSearch_js__ = __webpack_require__(281);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__pathRoute_Position_js__ = __webpack_require__(43);
/**
 * Created by yan on 15/03/2017.
 */





function idrRouter(floorList, pathData) {
    
    var _floorList = floorList
    
    var _start = null
    
    var _end = null
    
    var _car = false
	
	  var _pathSearch = new __WEBPACK_IMPORTED_MODULE_0__pathRoute_PathSearch_js__["a" /* default */](pathData)
    
    function getFloorIndex(floorId) {
        
        for (var i = 0; i < _floorList.length; ++i) {
            
            if (_floorList[i].id === floorId) {
                
                return _floorList[i].floorIndex
            }
        }
        
        return -1
    }
    
    function getRouterParm() {
        
        return {start:_start, end:_end, car:_car}
    }
    
    function getFloorId(floorIndex) {
        
        for (var i = 0; i < _floorList.length; ++i) {
            
            if (_floorList[i].floorIndex === floorIndex) {
                
                return _floorList[i].id
            }
        }
        
        return null
    }
    
    /**
     * @param start 起点
     * @param end 终点
     * @param car 是否车行
     * @return PathResult
     */
    function routerPath(start, end, car) {
        
        _start = start
        
        _end = end
        
        _car = car
        
        return doRouter(start, end, car)
    }
    
    function doRouter(start, end, car) {
        
        var _sIndex = getFloorIndex(start.floorId)
        
        var _eIndex = getFloorIndex(end.floorId)
        
        var s = new __WEBPACK_IMPORTED_MODULE_1__pathRoute_Position_js__["a" /* default */]
        
        s.x = start.x
        
        s.y = start.y
        
        var e = new __WEBPACK_IMPORTED_MODULE_1__pathRoute_Position_js__["a" /* default */]
        
        e.x = end.x
        
        e.y = end.y
      
				console.log('导航起始点')
	
				console.log(JSON.stringify(start))
	
				console.log(JSON.stringify(end))
	
				console.log('导航起始点--')
			
        var result = _pathSearch.search(_sIndex, s, _eIndex, e, car, null)
        
        for (var i = 0; i < result.paths.length; ++i) {
            
            var floorId = getFloorId(result.paths[i].floorIndex)
            
            result.paths[i].floorId = floorId
            
            for (var j = 0; j < result.paths[i].position.length; ++j) {
                
                result.paths[i].position[j].floorId = floorId
            }
        }
        
        return result
    }
    
    this.getRouterParm = getRouterParm
    
    this.routerPath = routerPath
}



/***/ }),
/* 278 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FloorPath; });
/**
 * 路径搜索结果
 *
 * @author Administrator
 *
 */

function FloorPath() {
    
    this.floorIndex = null;// 路径所在楼层
    this.typeId = null;//路径终点类型，0为终点，其余参考unitTypeId，分别表示楼梯、电梯等(UnitType)
    this.distance = null;// 路线距离
    this.position = null;// 路线点集 array
}



/***/ }),
/* 279 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PathBrief; });
/**
 * 简略路径结果
 *
 * @author Administrator
 *
 */

function PathBrief() {
    
    this.p1 = null;//起点，当为null时表示起点与投影点过近，可忽略
    this.p2 = null;//终点，当为null时表示起点与投影点过近，可忽略
    this.ps = null;//起点到最短路径的投影点
    this.pe = null;//终点到最短路径的投影点
    this.f = null;//对应楼层，-1表示人行贯通，-2表示车行贯通
    this.a = null;//邻接矩阵中的起点，若为-1表示ps、pe在一条线上无需中继点
    this.b = null;//邻接矩阵中的终点
    this.distance = null;//路径距离
}





/***/ }),
/* 280 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PathResult; });
/**
 * 完整路径结果
 * @author Administrator
 *
 */

function PathResult() {
    
    this.paths = null;//每段路径数据[FloorPath]
    
    this.distance = 0;//全路径的总距离
}





/***/ }),
/* 281 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PathSearch; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__PathUtil_js__ = __webpack_require__(282);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__PathResult_js__ = __webpack_require__(280);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__PathBrief_js__ = __webpack_require__(279);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__FloorPath_js__ = __webpack_require__(278);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Position_js__ = __webpack_require__(43);
/**
 * 路径搜索
 *
 * @author Administrator
 *
 */











function PathSearch(data) {
    
    var IGNOREDES = 10;// 忽略距离，到路线投影点距离小于这一值的起始结束点将被忽略
    
    var floorPath = data.floorPath;// 楼层路径数据
    
    var footPath = data.footPath;// 人行贯通路径数据
    
    var carPath = data.carPath;// 车行贯通路径数据
    
    /**
     * 搜索从f1层p1点到f2层p2点的最短路径（完整信息）
     *
     * @param f1起点楼层下标
     * @param p1起点坐标
     * @param f2终点楼层下标
     * @param p2终点坐标
     * @param type贯通类型，0人行，1车行
     * @param brief简略信息，若有可减少计算量，若为null则自动计算
     * @return PathResult
     */
    this.search = function(f1, p1, f2, p2, type, brief) {
        
        var result = null;
        
        if(brief == null)brief = searchBriefDiff(f1, p1, f2, p2, type, false);
        
        if (brief != null) {
            
            result = new __WEBPACK_IMPORTED_MODULE_1__PathResult_js__["a" /* default */]();
            
            result.distance = brief.distance;
            
            var paths = [];
            
            var f = brief.f;
            
            if (f == -1) {
                
                var a = brief.a;
                
                var b = brief.b;
                
                var structure = type == 0 ? footPath : carPath;
                
                var positions = structure.positions;
                
                var matrix = structure.matrix;
                
                var pro = b;
                
                paths.push(searchFloorPathSimple(searchBriefSame(f2, positions[b].pos, p2, type, true)));
                
                while (a != matrix[a][b].proIndex) {
                    
                    b = matrix[a][b].proIndex;
                    
                    if (positions[b].floorIndex == positions[pro].floorIndex) {
                        
                        var fp = searchFloorPathSimple(searchBriefSame(positions[b].floorIndex, positions[b].pos,
                            positions[pro].pos, type, true));
                        
                        fp.typeId = positions[pro].unitTypeId;
                        
                        paths.push(fp);
                    }
                    
                    pro = b;
                }
                
                var fp = searchFloorPathSimple(searchBriefSame(f1, p1, positions[a].pos, type, true));
                
                fp.typeId = positions[a].unitTypeId;
                
                paths.push(fp);
                
                paths.reverse()
            }
            else {
                
                paths.push(searchFloorPathSimple(brief));
            }
            
            result.paths = paths;
        }
        return result;
    }
    
    function searchFloorPathSimple(brief) {
        
        var f = brief.f;
        
        var a = brief.a
        
        var b = brief.b
        
        var fp = new __WEBPACK_IMPORTED_MODULE_3__FloorPath_js__["a" /* default */]();
        
        fp.floorIndex = f;
        
        fp.distance = brief.distance;
        
        var list = [];
        
        if (brief.p2 != null)
            list.push(brief.p2);
        if (brief.pe != null)
            list.push(brief.pe);
        
        searchFloorPath(f, a, b, list);
        
        if (brief.ps != null)
            list.push(brief.ps);
        if (brief.p1 != null)
            list.push(brief.p1);
        
        list.reverse();
        
        fp.position = list;
        
        return fp;
    }
    
    function searchFloorPath(f, a, b, list) {
        
        var positions = floorPath[f].positions;
        
        var matrix = floorPath[f].matrix;
        
        if (a == -1)
            return;
        
        var p = new __WEBPACK_IMPORTED_MODULE_4__Position_js__["a" /* default */]()
        
        p.x = positions[b].x
        
        p.y = positions[b].y
        
        list.push(p);
        
        while (b != matrix[a][b].proIndex) {
            
            b = matrix[a][b].proIndex;
            
            p = new __WEBPACK_IMPORTED_MODULE_4__Position_js__["a" /* default */]()
            
            p.x = positions[b].x
            
            p.y = positions[b].y
            
            list.push(p);
        }
    }
    
    function searchBriefDiff(f1, p1, f2, p2, type, absolutely) {
        
        if (f1 == f2 && !absolutely)
            return searchBriefSame(f1, p1, p2, type, true);
        
        var result = new __WEBPACK_IMPORTED_MODULE_2__PathBrief_js__["a" /* default */]();
        
        result.f = -1;
        
        var length = Number.MAX_VALUE;
        var structure = type == 0 ? footPath : carPath;
        var positions = structure.positions;
        var matrix = structure.matrix;
        var n = positions.length;
        var start = -1, end = -1;
        for (var a = 0; a < n; a++) {
            if (positions[a].floorIndex == f1)
                for (var b = 0; b < n; b++) {
                    if (positions[b].floorIndex == f2 && matrix[a][b] != null) {
                        var pb1 = searchBriefSame(f1, p1, positions[a].pos, type, true);
                        var pb2 = searchBriefSame(f2, positions[b].pos, p2, type, true);
                        if (pb1 != null && pb2 != null) {
                            var len = pb1.distance + pb2.distance + matrix[a][b].length;
                            if (len < length) {
                                length = len;
                                start = a;
                                end = b;
                            }
                        }
                    }
                }
        }
        if (start == -1)
            return null;
        result.a = start;
        result.b = end;
        var pb1 = searchBriefSame(f1, p1, positions[start].pos, type, true);
        var pb2 = searchBriefSame(f2, positions[end].pos, p2, type, true);
        result.p1 = pb1.p1;
        result.ps = pb1.ps;
        result.p2 = pb2.p2;
        result.pe = pb2.pe;
        result.distance = length;
        return result;
    }
    
    function searchBriefSame(f, p1, p2, type, absolutely) {
        
        var result = new __WEBPACK_IMPORTED_MODULE_2__PathBrief_js__["a" /* default */]();
        
        result.f = f;
        
        var length = 0;
        
        var positions = floorPath[f].positions;
        
        var lines = floorPath[f].lines;
        
        var matrix = floorPath[f].matrix;
        
        var l1 = __WEBPACK_IMPORTED_MODULE_0__PathUtil_js__["a" /* default */].findNearestLine(p1, lines);
        
        var l2 = __WEBPACK_IMPORTED_MODULE_0__PathUtil_js__["a" /* default */].findNearestLine(p2, lines);
        
        var s = __WEBPACK_IMPORTED_MODULE_0__PathUtil_js__["a" /* default */].p2lDes(p1, lines[l1]);
        
        var e = __WEBPACK_IMPORTED_MODULE_0__PathUtil_js__["a" /* default */].p2lDes(p2, lines[l2]);
        
        if (s.getDistance() > IGNOREDES) {
            length += s.distance;
            result.p1 = p1;
        }
        
        if (e.getDistance() > IGNOREDES) {
            length += e.distance;
            result.p2 = p2;
        }
        
        var ps = s.position;
        
        var pe = e.position;
        
        result.ps = ps;
        
        result.pe = pe;
        
        if (l1 != l2) {
            
            var pa = __WEBPACK_IMPORTED_MODULE_0__PathUtil_js__["a" /* default */].findPositionIndex(lines[l1].endPointOne, positions);
            
            var pb = __WEBPACK_IMPORTED_MODULE_0__PathUtil_js__["a" /* default */].findPositionIndex(lines[l1].endPointTwo, positions);
            
            var pc = __WEBPACK_IMPORTED_MODULE_0__PathUtil_js__["a" /* default */].findPositionIndex(lines[l2].endPointOne, positions);
            
            var pd = __WEBPACK_IMPORTED_MODULE_0__PathUtil_js__["a" /* default */].findPositionIndex(lines[l2].endPointTwo, positions);
            
            var sa = __WEBPACK_IMPORTED_MODULE_0__PathUtil_js__["a" /* default */].p2pDes(ps, positions[pa]);
            
            var sb = __WEBPACK_IMPORTED_MODULE_0__PathUtil_js__["a" /* default */].p2pDes(ps, positions[pb]);
            
            var sc = __WEBPACK_IMPORTED_MODULE_0__PathUtil_js__["a" /* default */].p2pDes(pe, positions[pc]);
            
            var sd = __WEBPACK_IMPORTED_MODULE_0__PathUtil_js__["a" /* default */].p2pDes(pe, positions[pd]);
            
            var len = Number.MAX_VALUE;
            
            var start = -1, end = -1;
            
            if (matrix[pa][pc] != null) {
                
                len = sa + sc + matrix[pa][pc].length;
                
                start = pa;
                end = pc;
            }
            
            if (matrix[pa][pd] != null && sa + sd + matrix[pa][pd].length < len) {
                len = sa + sd + matrix[pa][pd].length;
                start = pa;
                end = pd;
            }
            if (matrix[pb][pc] != null && sb + sc + matrix[pb][pc].length < len) {
                len = sb + sc + matrix[pb][pc].length;
                start = pb;
                end = pc;
            }
            if (matrix[pb][pd] != null && sb + sd + matrix[pb][pd].length < len) {
                len = sb + sd + matrix[pb][pd].length;
                start = pb;
                end = pd;
            }
            if (start != -1) {
                result.a = start;
                result.b = end;
                if (__WEBPACK_IMPORTED_MODULE_0__PathUtil_js__["a" /* default */].p2pDes(ps, positions[start]) < 1)
                    result.ps = null;
                if (__WEBPACK_IMPORTED_MODULE_0__PathUtil_js__["a" /* default */].p2pDes(pe, positions[end]) < 1)
                    result.pe = null;
                length += len;
            } else
                return absolutely ? null : searchBriefDiff(f, p1, f, p2, type, true);
        } else {
            result.a = -1;
            length += __WEBPACK_IMPORTED_MODULE_0__PathUtil_js__["a" /* default */].p2pDes(ps, pe);
        }
        result.distance = length;
        return result;
    }
}



/***/ }),
/* 282 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PathUtil; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__PositionDistance_js__ = __webpack_require__(283);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Position_js__ = __webpack_require__(43);





var PathUtil = (function() {
    
    /**
     * 在线段集合中找到距离目标点最近的线段
     *
     * @param p目标点
     * @return 线段index
     */
    function findNearestLine(p, lines) {
        
        var index = 0;
        var minDes = Number.MAX_VALUE;
        for (var i = lines.length - 1; i >= 0; i--) {
            
            var des = p2lDes(p, lines[i]).getDistance();
            if (des < minDes) {
                index = i;
                minDes = des;
            }
        }
        
        return index;
    }
    
    /**
     * 二分查找点在有序集合中的位置下标
     *
     * @param pos待查找点
     * @param positions点集（有序）
     * @return pos在positions中的下标，若找不到返回-1
     */
    
    function compareTo(left, right) {
        
        if (left.x < right.x) {
            return -1;
        }
        else if (left.x > right.x) {
            return 1;
        }
        else if (left.y < right.y) {
            return -1;
        }
        else if (left.y > right.y) {
            return 1;
        }
        else {
            return 0;
        }
    }
    
    function findPositionIndex(pos, positions) {
        
        var left = 0;
        
        var right = positions.length - 1;
        
        var mid;
        
        while (left <= right) {
            
            mid = (left + right) >> 1;
            
            var t = compareTo(pos, positions[mid]);
            
            if (t < 0) {
                right = mid - 1;
                
            }
            else if (t == 0) {
                
                return mid;
            }
            else {
                
                left = mid + 1;
            }
        }
        
        return -1;
    }
    
    /**
     * 求两点间欧氏距离
     *
     * @param a点A
     * @param b点B
     * @return AB间欧式距离
     */
    function p2pDes(a, b) {
        
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    }
    
    /**
     * 求点到线段的最短距离及其端点
     *
     * @param p点
     * @param l线段
     * @return 最短距离及其端点
     */
    function p2lDes (p, l) {
        
        return dop2lDes(p.x, p.y, l.endPointOne.x, l.endPointOne.y,
            l.endPointTwo.x, l.endPointTwo.y);
    }
    
    /**
     * 求点到线段的最短距离及其端点
     *
     * @param x点横坐标
     * @param y点纵坐标
     * @param x1线段端点1横坐标
     * @param y1线段端点1纵坐标
     * @param x2线段端点2横坐标
     * @param y2线段端点2纵坐标
     * @return 最短距离及其端点
     */
    function dop2lDes(x, y, x1, y1, x2, y2) {
        
        var cross = (x2 - x1) * (x - x1) + (y2 - y1) * (y - y1);
        if (cross <= 0)
            return getPositionDistance(x, y, x1, y1);
        var d2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
        if (cross >= d2)
            return getPositionDistance(x, y, x2, y2);
        var r = cross / d2;
        var px = x1 + (x2 - x1) * r;
        var py = y1 + (y2 - y1) * r;
        return getPositionDistance(x, y, px, py);
    }
    
    function getPositionDistance(x, y, px, py) {
        
        var result = new __WEBPACK_IMPORTED_MODULE_0__PositionDistance_js__["a" /* default */]();
        var p = new __WEBPACK_IMPORTED_MODULE_1__Position_js__["a" /* default */]();
        p.x = px;
        p.y = py;
        result.setPosition(p);
        result.setDistance(Math.sqrt((x - px) * (x - px) + (y - py) * (y - py)));
        return result;
    }
    
    return {
        findNearestLine:findNearestLine,
        findPositionIndex:findPositionIndex,
        p2pDes:p2pDes,
        p2lDes:p2lDes,
    }
}())






/***/ }),
/* 283 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PositionDistance; });
/**
 * 点和距离的组合
 * @author Administrator
 *
 */

function PositionDistance() {
    
    this.position = null;
    
    this.distance = 0;
}

PositionDistance.prototype.getPosition = function() {
    
    return this.position;
}

PositionDistance.prototype.setPosition = function(position) {
    
    this.position = position;
}

PositionDistance.prototype.getDistance = function() {
    
    return this.distance;
}

PositionDistance.prototype.setDistance = function(distance) {
    
    this.distance = distance;
}




/***/ }),
/* 284 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * jQuery JavaScript Library v3.2.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2017-03-20T18:59Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var document = window.document;

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};



	function DOMEval( code, doc ) {
		doc = doc || document;

		var script = doc.createElement( "script" );

		script.text = code;
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.2.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && Array.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {

		// As of jQuery 3.0, isNumeric is limited to
		// strings and numbers (primitives or objects)
		// that can be coerced to finite numbers (gh-2662)
		var type = jQuery.type( obj );
		return ( type === "number" || type === "string" ) &&

			// parseFloat NaNs numeric-cast false positives ("")
			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
			// subtraction forces infinities to NaN
			!isNaN( obj - parseFloat( obj ) );
	},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {

		/* eslint-disable no-unused-vars */
		// See https://github.com/eslint/eslint/issues/6125
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}

		// Support: Android <=2.3 only (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		DOMEval( code );
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Support: IE <=9 - 11, Edge 12 - 13
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android <=4.0 only
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.3
 * https://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-08-08
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	disabledAncestor = addCombinator(
		function( elem ) {
			return elem.disabled === true && ("form" in elem || "label" in elem);
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rcssescape, fcssescape );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[i] = "#" + nid + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement("fieldset");

	try {
		return !!fn( el );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}
		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
						disabledAncestor( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( preferredDoc !== document &&
		(subWindow = document.defaultView) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( el ) {
		el.className = "i";
		return !el.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( el ) {
		el.appendChild( document.createComment("") );
		return !el.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID filter and find
	if ( support.getById ) {
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode("id");
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( (elem = elems[i++]) ) {
						node = elem.getAttributeNode("id");
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( el ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll(":enabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll(":disabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( el ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return (sel + "").replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( (oldCache = uniqueCache[ key ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( el ) {
	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement("fieldset") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( el ) {
	return el.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Simple selector that can be filtered directly, removing non-Elements
	if ( risSimple.test( qualifier ) ) {
		return jQuery.filter( qualifier, elements, not );
	}

	// Complex selector, compare the two sets, removing non-Elements
	qualifier = jQuery.filter( qualifier, elements );
	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) > -1 ) !== not && elem.nodeType === 1;
	} );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
        if ( nodeName( elem, "iframe" ) ) {
            return elem.contentDocument;
        }

        // Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
        // Treat the template element as a regular one in browsers that
        // don't support it.
        if ( nodeName( elem, "template" ) ) {
            elem = elem.content || elem;
        }

        return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && jQuery.isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && jQuery.isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = jQuery.isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( jQuery.isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the master Deferred
			master = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						master.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( master.state() === "pending" ||
				jQuery.isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return master.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
		}

		return master.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ jQuery.camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ jQuery.camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ jQuery.camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( jQuery.camelCase );
			} else {
				key = jQuery.camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			jQuery.contains( elem.ownerDocument, elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};




function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted,
		scale = 1,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		do {

			// If previous iteration zeroed out, double until we get *something*.
			// Use string for doubling so we don't accidentally see scale as unchanged below
			scale = scale || ".5";

			// Adjust and apply
			initialInUnit = initialInUnit / scale;
			jQuery.style( elem, prop, initialInUnit + unit );

		// Update scale, tolerating zero or NaN from tween.cur()
		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
		} while (
			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
		);
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]+)/i );

var rscriptType = ( /^$|\/(?:java|ecma)script/i );



// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// Support: IE <=9 only
	option: [ 1, "<select multiple='multiple'>", "</select>" ],

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

// Support: IE <=9 only
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, contains, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( jQuery.type( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
} )();
var documentElement = document.documentElement;



var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 only
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		// Make a writable jQuery.Event from the native event object
		var event = jQuery.event.fix( nativeEvent );

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: jQuery.isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
							return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
							return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,

	which: function( event ) {
		var button = event.button;

		// Add which for key events
		if ( event.which == null && rkeyEvent.test( event.type ) ) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
			if ( button & 1 ) {
				return 1;
			}

			if ( button & 2 ) {
				return 3;
			}

			if ( button & 4 ) {
				return 2;
			}

			return 0;
		}

		return event.which;
	}
}, jQuery.event.addProp );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	/* eslint-disable max-len */

	// See https://github.com/eslint/eslint/issues/3229
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,

	/* eslint-enable */

	// Support: IE <=10 - 11, Edge 12 - 13
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( ">tbody", elem )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.access( src );
		pdataCur = dataPriv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		isFunction = jQuery.isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( isFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( isFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rmargin = ( /^margin/ );

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		div.style.cssText =
			"box-sizing:border-box;" +
			"position:relative;display:block;" +
			"margin:auto;border:1px;padding:1px;" +
			"top:1%;width:50%";
		div.innerHTML = "";
		documentElement.appendChild( container );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = divStyle.marginLeft === "2px";
		boxSizingReliableVal = divStyle.width === "4px";

		// Support: Android 4.0 - 4.3 only
		// Some styles come back with percentage values, even though they shouldn't
		div.style.marginRight = "50%";
		pixelMarginRightVal = divStyle.marginRight === "4px";

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
		"padding:0;margin-top:1px;position:absolute";
	container.appendChild( div );

	jQuery.extend( support, {
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelMarginRight: function() {
			computeStyleTests();
			return pixelMarginRightVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// Shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a property mapped along what jQuery.cssProps suggests or to
// a vendor prefixed property.
function finalPropName( name ) {
	var ret = jQuery.cssProps[ name ];
	if ( !ret ) {
		ret = jQuery.cssProps[ name ] = vendorPropName( name ) || name;
	}
	return ret;
}

function setPositiveNumber( elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i,
		val = 0;

	// If we already have the right measurement, avoid augmentation
	if ( extra === ( isBorderBox ? "border" : "content" ) ) {
		i = 4;

	// Otherwise initialize for horizontal or vertical properties
	} else {
		i = name === "width" ? 1 : 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {

			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// At this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {

			// At this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// At this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with computed style
	var valueIsBorderBox,
		styles = getStyles( elem ),
		val = curCSS( elem, name, styles ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// Computed unit is not pixels. Stop here and return.
	if ( rnumnonpx.test( val ) ) {
		return val;
	}

	// Check for style in case a browser which returns unreliable values
	// for getComputedStyle silently falls back to the reliable elem.style
	valueIsBorderBox = isBorderBox &&
		( support.boxSizingReliable() || val === elem.style[ name ] );

	// Fall back to offsetWidth/Height when value is "auto"
	// This happens for inline elements with no explicit setting (gh-3571)
	if ( val === "auto" ) {
		val = elem[ "offset" + name[ 0 ].toUpperCase() + name.slice( 1 ) ];
	}

	// Normalize "", auto, and prepare for extra
	val = parseFloat( val ) || 0;

	// Use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						} ) :
						getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = extra && getStyles( elem ),
				subtract = extra && augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				);

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ name ] = value;
				value = jQuery.css( elem, name );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 13
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

			/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( jQuery.isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					jQuery.proxy( result.stop, result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://html.spec.whatwg.org/multipage/infrastructure.html#strip-and-collapse-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnothtmlwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnothtmlwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( type === "string" ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = value.match( rnothtmlwhite ) || [];

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );




support.focusin = "onfocusin" in window;


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = jQuery.now();

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = jQuery.isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( jQuery.isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 13
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce++ ) + uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( jQuery.isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" ).prop( {
					charset: s.scriptCharset,
					src: s.url
				} ).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var doc, docElem, rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		rect = elem.getBoundingClientRect();

		doc = elem.ownerDocument;
		docElem = doc.documentElement;
		win = doc.defaultView;

		return {
			top: rect.top + win.pageYOffset - docElem.clientTop,
			left: rect.left + win.pageXOffset - docElem.clientLeft
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
		// because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume getBoundingClientRect is there when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {

			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset = {
				top: parentOffset.top + jQuery.css( offsetParent[ 0 ], "borderTopWidth", true ),
				left: parentOffset.left + jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true )
			};
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( jQuery.isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( true ) {
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
		return jQuery;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );


/***/ })
],[119]);