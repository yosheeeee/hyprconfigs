webpackJsonp([ 2, 3 ], {
    0: function(module, exports, __webpack_require__) {
        "use strict";
        __webpack_require__(535).run();
    },
    20: function(module, exports) {
        "use strict";
        var _typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
        var buildInfo = window.vbBuildInfo;
        module.exports = {
            getVersion: function() {
                return chrome.runtime.getManifest().version;
            },
            getRevision: function() {
                return getValue("buildNumber", 0);
            },
            getTimestamp: function() {
                return getValue("date", 0);
            },
            isDebug: function() {
                return Boolean(getValue("debug", false));
            },
            getRegionBrandId: function() {
                return getValue("regionBrandId");
            },
            getCustomBrandId: function() {
                return getValue("customBrandId");
            },
            getClids: function() {
                return getValue("clids");
            },
            getErrorboosterProject: function() {
                return getValue("errorboosterProject");
            },
            ensureBrandedBuildInfo: function() {}
        };
        function getValue(path, defaultValue) {
            if ("object" === ("undefined" === typeof buildInfo ? "undefined" : _typeof(buildInfo)) && buildInfo[path]) return buildInfo[path];
            return defaultValue;
        }
    },
    23: function(module, exports) {
        "use strict";
        var visbookmarksFakeTabUrl = "";
        var visbookmarksUrl = "chrome://newtab/";
        var visbookmarksRealUrl = chrome.runtime.getURL("/layout/newtab.html");
        module.exports = {
            id: "chr",
            isChr: true,
            extensionId: chrome.runtime.id,
            cid: 72482,
            type: "vb-chrome",
            yasoft: "vbch",
            browserName: "chrome",
            visbookmarksUrl: visbookmarksUrl,
            visbookmarksFakeTabUrl: visbookmarksFakeTabUrl,
            visbookmarksRealUrl: visbookmarksRealUrl,
            vbUrls: [ visbookmarksUrl, visbookmarksFakeTabUrl, visbookmarksRealUrl ]
        };
    },
    25: function(module, exports, __webpack_require__) {
        "use strict";
        var _createClass = function() {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }
        var about = __webpack_require__(23);
        var buildInfo = __webpack_require__(20);
        var ErrorType = {
            UNCAUGHT: "690.2361",
            CLIENT: "690.2362"
        };
        var ErrorLevel = {
            CRITICAL: "critical",
            DEBUG: "debug",
            ERROR: "error",
            INFO: "info",
            TRACE: "trace",
            WARN: "warn"
        };
        var Environment = {
            DEBUG: "development",
            PROD: "production"
        };
        var SEND_USAGE_STAT_SETTING = "settings.sendUsageStat";
        var ErrorBooster = function() {
            function ErrorBooster() {
                _classCallCheck(this, ErrorBooster);
            }
            _createClass(ErrorBooster, [ {
                key: "send",
                value: function(url) {
                    var _this = this;
                    var isUncaught = url.includes(ErrorType.UNCAUGHT);
                    return chrome.storage.local.get([ SEND_USAGE_STAT_SETTING ], function(params) {
                        if (params[SEND_USAGE_STAT_SETTING] || isUncaught) return fetch(url).catch(function() {
                            return _this._fallbackError();
                        }).catch(console.error);
                    });
                }
            }, {
                key: "uncaught",
                value: function(message) {
                    var additional = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                    var vars = this._getVars(message, ErrorLevel.CRITICAL, additional);
                    return this.send(this._getUrl(ErrorType.UNCAUGHT, vars));
                }
            }, {
                key: "error",
                value: function(message) {
                    var additional = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                    var vars = this._getVars(message, ErrorLevel.ERROR, additional);
                    return this.send(this._getUrl(ErrorType.CLIENT, vars));
                }
            }, {
                key: "info",
                value: function(message) {
                    var additional = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                    var vars = this._getVars(message, ErrorLevel.INFO, additional);
                    return this.send(this._getUrl(ErrorType.CLIENT, vars));
                }
            }, {
                key: "warn",
                value: function(message) {
                    var additional = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                    var vars = this._getVars(message, ErrorLevel.WARN, additional);
                    return this.send(this._getUrl(ErrorType.CLIENT, vars));
                }
            }, {
                key: "_fallbackError",
                value: function() {
                    return fetch(this._getUrl(ErrorType.CLIENT, "-project=" + buildInfo.getErrorboosterProject() + ",-msg=ebfallback"));
                }
            }, {
                key: "_getUrl",
                value: function(path, vars) {
                    return new URL("/clck/click/path=" + path + "/vars=" + vars + "/*", "https://yandex.ru").toString();
                }
            }, {
                key: "_getVars",
                value: function(message, level, additional) {
                    var vars = {
                        msg: message,
                        level: level,
                        project: buildInfo.getErrorboosterProject(),
                        service: about.yasoft,
                        timestamp: Date.now(),
                        version: buildInfo.getVersion(),
                        env: buildInfo.isDebug() ? Environment.DEBUG : Environment.PROD,
                        ua: navigator && navigator.userAgent,
                        additional: JSON.stringify(additional)
                    };
                    return Object.keys(vars).filter(function(key) {
                        return vars[key];
                    }).map(function(key) {
                        return "-" + key + "=" + encodeURIComponent(ErrorBooster.toWellFormed(vars[key]));
                    }).join(",");
                }
            } ], [ {
                key: "toWellFormed",
                value: function(val) {
                    return val.toWellFormed ? val.toWellFormed() : val;
                }
            } ]);
            return ErrorBooster;
        }();
        module.exports = new ErrorBooster();
    },
    44: function(module, exports) {
        function isObject(value) {
            var type = typeof value;
            return !!value && ("object" == type || "function" == type);
        }
        module.exports = isObject;
    },
    45: function(module, exports, __webpack_require__) {
        var isArguments = __webpack_require__(46), isArray = __webpack_require__(52), isIndex = __webpack_require__(56), isLength = __webpack_require__(50), isObject = __webpack_require__(44);
        var objectProto = Object.prototype;
        var hasOwnProperty = objectProto.hasOwnProperty;
        function keysIn(object) {
            if (null == object) return [];
            if (!isObject(object)) object = Object(object);
            var length = object.length;
            length = length && isLength(length) && (isArray(object) || isArguments(object)) && length || 0;
            var Ctor = object.constructor, index = -1, isProto = "function" == typeof Ctor && Ctor.prototype === object, result = Array(length), skipIndexes = length > 0;
            while (++index < length) result[index] = index + "";
            for (var key in object) if (!(skipIndexes && isIndex(key, length)) && !("constructor" == key && (isProto || !hasOwnProperty.call(object, key)))) result.push(key);
            return result;
        }
        module.exports = keysIn;
    },
    46: function(module, exports, __webpack_require__) {
        var isArrayLike = __webpack_require__(47), isObjectLike = __webpack_require__(51);
        var objectProto = Object.prototype;
        var hasOwnProperty = objectProto.hasOwnProperty;
        var propertyIsEnumerable = objectProto.propertyIsEnumerable;
        function isArguments(value) {
            return isObjectLike(value) && isArrayLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
        }
        module.exports = isArguments;
    },
    47: function(module, exports, __webpack_require__) {
        var getLength = __webpack_require__(48), isLength = __webpack_require__(50);
        function isArrayLike(value) {
            return null != value && isLength(getLength(value));
        }
        module.exports = isArrayLike;
    },
    48: function(module, exports, __webpack_require__) {
        var baseProperty = __webpack_require__(49);
        var getLength = baseProperty("length");
        module.exports = getLength;
    },
    49: function(module, exports) {
        function baseProperty(key) {
            return function(object) {
                return null == object ? void 0 : object[key];
            };
        }
        module.exports = baseProperty;
    },
    50: function(module, exports) {
        var MAX_SAFE_INTEGER = 9007199254740991;
        function isLength(value) {
            return "number" == typeof value && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
        }
        module.exports = isLength;
    },
    51: function(module, exports) {
        function isObjectLike(value) {
            return !!value && "object" == typeof value;
        }
        module.exports = isObjectLike;
    },
    52: function(module, exports, __webpack_require__) {
        var getNative = __webpack_require__(53), isLength = __webpack_require__(50), isObjectLike = __webpack_require__(51);
        var arrayTag = "[object Array]";
        var objectProto = Object.prototype;
        var objToString = objectProto.toString;
        var nativeIsArray = getNative(Array, "isArray");
        var isArray = nativeIsArray || function(value) {
            return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
        };
        module.exports = isArray;
    },
    53: function(module, exports, __webpack_require__) {
        var isNative = __webpack_require__(54);
        function getNative(object, key) {
            var value = null == object ? void 0 : object[key];
            return isNative(value) ? value : void 0;
        }
        module.exports = getNative;
    },
    54: function(module, exports, __webpack_require__) {
        var isFunction = __webpack_require__(55), isObjectLike = __webpack_require__(51);
        var reIsHostCtor = /^\[object .+?Constructor\]$/;
        var objectProto = Object.prototype;
        var fnToString = Function.prototype.toString;
        var hasOwnProperty = objectProto.hasOwnProperty;
        var reIsNative = RegExp("^" + fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
        function isNative(value) {
            if (null == value) return false;
            if (isFunction(value)) return reIsNative.test(fnToString.call(value));
            return isObjectLike(value) && reIsHostCtor.test(value);
        }
        module.exports = isNative;
    },
    55: function(module, exports, __webpack_require__) {
        var isObject = __webpack_require__(44);
        var funcTag = "[object Function]";
        var objectProto = Object.prototype;
        var objToString = objectProto.toString;
        function isFunction(value) {
            return isObject(value) && objToString.call(value) == funcTag;
        }
        module.exports = isFunction;
    },
    56: function(module, exports) {
        var reIsUint = /^\d+$/;
        var MAX_SAFE_INTEGER = 9007199254740991;
        function isIndex(value, length) {
            value = "number" == typeof value || reIsUint.test(value) ? +value : -1;
            length = null == length ? MAX_SAFE_INTEGER : length;
            return value > -1 && value % 1 == 0 && value < length;
        }
        module.exports = isIndex;
    },
    61: function(module, exports, __webpack_require__) {
        "use strict";
        var toArray = __webpack_require__(62);
        var rxEscape = /&|  |<|>|\r\n|\n|'/g;
        var rxUnescape = /&amp;|&nbsp;|&lt;|&gt;|<(br|BR)\s*\/?>|&quot;/g;
        var mapEscape = {
            "&": "&amp;",
            "  ": "&nbsp; ",
            "<": "&lt;",
            ">": "&gt;",
            "\n": "<br />",
            "\r\n": "<br />",
            '"': "&quot;"
        };
        var mapUnescape = {
            "&amp;": "&",
            "&nbsp;": " ",
            "&lt;": "<",
            "&gt;": ">",
            "<br />": "\n",
            "<br/>": "\n",
            "<br>": "\n",
            "&quot;": '"'
        };
        var funcReplaceEscape = function(str) {
            return mapEscape[str];
        };
        var funcReplaceUnescape = function(str) {
            return mapUnescape[str.toLowerCase()];
        };
        var xml = {
            mapEscape: mapEscape,
            mapUnescape: mapUnescape,
            escape: function(str) {
                return str ? String(str).replace(rxEscape, funcReplaceEscape) : "";
            },
            unescape: function(str) {
                return str ? String(str).replace(rxUnescape, funcReplaceUnescape) : "";
            },
            fromString: "function" === typeof DOMParser ? function(string) {
                return new DOMParser().parseFromString(string, "text/xml");
            } : function(string) {
                var xmlDocument = new ActiveXObject("Microsoft.XMLDOM");
                xmlDocument.async = false;
                xmlDocument.loadXML(string);
                return xmlDocument;
            },
            select: "function" === typeof Sizzle ? function(selector, parent) {
                return Sizzle(selector, parent || window.document)[0] || null;
            } : function(selector, parent) {
                return (parent || window.document).querySelector(selector);
            },
            selectAll: "function" === typeof Sizzle ? function(selector, parent) {
                return Sizzle(selector, parent || window.document);
            } : function(selector, parent) {
                return toArray((parent || window.document).querySelectorAll(selector));
            },
            getText: function(elem, selector) {
                if (elem && selector) elem = xml.select(selector, elem);
                return elem ? elem.textContent || elem.innerText || elem.firstChild && elem.firstChild.data || elem.text || "" : "";
            },
            setText: function(elem, text) {
                if (elem) {
                    elem.textContent = text;
                    elem.innerText = text;
                }
            },
            getAttr: function(elem, selector, attr) {
                if (2 === arguments.length) {
                    attr = selector;
                    selector = null;
                }
                if (elem && selector) elem = xml.select(selector, elem);
                return elem && elem.getAttribute(attr) || "";
            },
            getAttrs: function(node) {
                return toArray(node.attributes).reduce(function(memo, attr) {
                    memo[attr.name] = attr.value;
                    return memo;
                }, Object.create(null));
            }
        };
        module.exports = xml;
        __webpack_require__(68).override(xml);
    },
    62: function(module, exports, __webpack_require__) {
        var arrayCopy = __webpack_require__(63), getLength = __webpack_require__(48), isLength = __webpack_require__(50), values = __webpack_require__(64);
        function toArray(value) {
            var length = value ? getLength(value) : 0;
            if (!isLength(length)) return values(value);
            if (!length) return [];
            return arrayCopy(value);
        }
        module.exports = toArray;
    },
    63: function(module, exports) {
        function arrayCopy(source, array) {
            var index = -1, length = source.length;
            array || (array = Array(length));
            while (++index < length) array[index] = source[index];
            return array;
        }
        module.exports = arrayCopy;
    },
    64: function(module, exports, __webpack_require__) {
        var baseValues = __webpack_require__(65), keys = __webpack_require__(66);
        function values(object) {
            return baseValues(object, keys(object));
        }
        module.exports = values;
    },
    65: function(module, exports) {
        function baseValues(object, props) {
            var index = -1, length = props.length, result = Array(length);
            while (++index < length) result[index] = object[props[index]];
            return result;
        }
        module.exports = baseValues;
    },
    66: function(module, exports, __webpack_require__) {
        var getNative = __webpack_require__(53), isArrayLike = __webpack_require__(47), isObject = __webpack_require__(44), shimKeys = __webpack_require__(67);
        var nativeKeys = getNative(Object, "keys");
        var keys = !nativeKeys ? shimKeys : function(object) {
            var Ctor = null == object ? void 0 : object.constructor;
            if ("function" == typeof Ctor && Ctor.prototype === object || "function" != typeof object && isArrayLike(object)) return shimKeys(object);
            return isObject(object) ? nativeKeys(object) : [];
        };
        module.exports = keys;
    },
    67: function(module, exports, __webpack_require__) {
        var isArguments = __webpack_require__(46), isArray = __webpack_require__(52), isIndex = __webpack_require__(56), isLength = __webpack_require__(50), keysIn = __webpack_require__(45);
        var objectProto = Object.prototype;
        var hasOwnProperty = objectProto.hasOwnProperty;
        function shimKeys(object) {
            var props = keysIn(object), propsLength = props.length, length = propsLength && object.length;
            var allowIndexes = !!length && isLength(length) && (isArray(object) || isArguments(object));
            var index = -1, result = [];
            while (++index < propsLength) {
                var key = props[index];
                if (allowIndexes && isIndex(key, length) || hasOwnProperty.call(object, key)) result.push(key);
            }
            return result;
        }
        module.exports = shimKeys;
    },
    68: function(module, exports, __webpack_require__) {
        "use strict";
        var _typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
        var events = __webpack_require__(69);
        var offscreenManager = __webpack_require__(70);
        exports.override = function(xml) {
            if ("object" !== ("undefined" === typeof xml ? "undefined" : _typeof(xml))) return;
            xml.fromStringOriginal = xml.fromString.bind({});
            xml.getAttrOriginal = xml.getAttr.bind({});
            xml.getTextOriginal = xml.getText.bind({});
            xml.selectAllOriginal = xml.selectAll.bind({});
            xml.fromString = function(string) {
                return string;
            };
            xml.getAttr = function(xmlString, selector, attr) {
                var callback = function(message) {
                    var errObj = message.errObj, attr = message.attr;
                    if (errObj) throw new Error(errObj.message); else return attr;
                };
                var msgBody = {
                    type: events.backend.XML_GET_ATTR,
                    data: {
                        xmlString: xmlString,
                        selector: selector,
                        attr: attr
                    }
                };
                return offscreenManager.sendMessage(msgBody, "XML getAttr timed out", callback);
            };
            xml.getText = function(xmlString, selector) {
                var callback = function(message) {
                    var errObj = message.errObj, text = message.text;
                    if (errObj) throw new Error(errObj.message); else return text;
                };
                var msgBody = {
                    type: events.backend.XML_GET_TEXT,
                    data: {
                        xmlString: xmlString,
                        selector: selector
                    }
                };
                return offscreenManager.sendMessage(msgBody, "XML getText timed out", callback);
            };
            xml.selectAll = function(selector, parent) {
                var callback = function(message) {
                    var errObj = message.errObj, selection = message.selection;
                    if (errObj) throw new Error(errObj.message); else return selection;
                };
                var msgBody = {
                    type: events.backend.XML_SELECT_ALL,
                    data: {
                        selector: selector,
                        parent: parent
                    }
                };
                return offscreenManager.sendMessage(msgBody, "XML selectAll timed out", callback);
            };
        };
    },
    69: function(module, exports) {
        "use strict";
        module.exports = {
            offscreen: {
                COLORS_DOMINANT_COLOR_BY_URL: "Colors.calculateDominantColorByUrl.response",
                COLORS_FONT_COLOR_BY_URL: "Colors.calculateFontColorByUrl.response",
                FILER_CD: "Filer.cd.response",
                FILER_CP: "Filer.cp.response",
                FILER_CREATE: "Filer.create.response",
                FILER_DF: "Filer.df.response",
                FILER_GET_ENTRY: "Filer.getEntry.response",
                FILER_INIT: "Filer.init.response",
                FILER_LS: "Filer.ls.response",
                FILER_MKDIR: "Filer.mkdir.response",
                FILER_MV: "Filer.mv.response",
                FILER_OPEN: "Filer.open.response",
                FILER_PATH_TO_FILESYSTEM_URL: "Filer.pathToFilesystemUrl.response",
                FILER_RM: "Filer.rm.response",
                FILER_WRITE: "Filer.write.response",
                SPEECHKIT_DATA: "Speechkit.data.response",
                SPEECHKIT_ERROR: "Speechkit.error.response",
                SPEECHKIT_INIT: "Speechkit.init.response",
                SPEECHKIT_STOP: "Speechkit.stop.response",
                XML_FROM_STRING: "Filer.fromString.response",
                XML_GET_ATTR: "Filer.getAttr.response",
                XML_GET_TEXT: "Filer.getText.response",
                XML_SELECT_ALL: "Filer.selectAll.response"
            },
            backend: {
                COLORS_DOMINANT_COLOR_BY_URL: "Colors.calculateDominantColorByUrl.request",
                COLORS_FONT_COLOR_BY_URL: "Colors.calculateFontColorByUrl.request",
                FILER_CD: "Filer.cd.request",
                FILER_CP: "Filer.cp.request",
                FILER_CREATE: "Filer.create.request",
                FILER_DF: "Filer.df.request",
                FILER_GET_ENTRY: "Filer.getEntry.request",
                FILER_INIT: "Filer.init.request",
                FILER_LS: "Filer.ls.request",
                FILER_MKDIR: "Filer.mkdir.request",
                FILER_MV: "Filer.mv.request",
                FILER_OPEN: "Filer.open.request",
                FILER_PATH_TO_FILESYSTEM_URL: "Filer.pathToFilesystemUrl.request",
                FILER_RM: "Filer.rm.request",
                FILER_WRITE: "Filer.write.request",
                SPEECHKIT_STOP: "Speechkit.stop.request",
                SPEECHKIT_INIT: "Speechkit.init.request",
                XML_FROM_STRING: "Filer.fromString.request",
                XML_GET_ATTR: "Filer.getAttr.request",
                XML_GET_TEXT: "Filer.getText.request",
                XML_SELECT_ALL: "Filer.selectAll.request"
            }
        };
    },
    70: function(module, exports, __webpack_require__) {
        "use strict";
        var _typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
        var _createClass = function() {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }
        var errorBooster = __webpack_require__(25);
        var creationCount = 0;
        var OffscreenManager = function() {
            function OffscreenManager() {
                _classCallCheck(this, OffscreenManager);
                this.maybeCloseOffscreen = this.maybeCloseOffscreen.bind(this);
                this.messages = new Map();
            }
            _createClass(OffscreenManager, [ {
                key: "_getMessageId",
                value: function() {
                    var uniqueId = void 0;
                    do uniqueId = Math.random().toString(36).substr(2, 9); while (this.messages.has(uniqueId));
                    return uniqueId;
                }
            }, {
                key: "_isTabsLeft",
                value: function() {
                    return chrome.tabs.query({}).then(function(tabs) {
                        return 0 !== tabs.length;
                    });
                }
            }, {
                key: "_closeOffscreen",
                value: function() {
                    var _this = this;
                    return OffscreenManager.hasOffscreen().then(function(hasDocument) {
                        if (hasDocument) return chrome.offscreen.closeDocument();
                    }).finally(function() {
                        _this.isCreatingOffscreenDocument = null;
                        chrome.tabs.onRemoved.removeListener(_this.maybeCloseOffscreen);
                    });
                }
            }, {
                key: "_createOffscreen",
                value: function() {
                    var _this2 = this;
                    return OffscreenManager.hasOffscreen().then(function(hasDocument) {
                        if (!hasDocument) return chrome.offscreen.createDocument({
                            url: "backend/offscreen.html",
                            reasons: Object.keys(justifications),
                            justification: Object.values(justifications).join("; ")
                        }, function() {
                            if (chrome.runtime.lastError) {
                                _this2.isCreatingOffscreenDocument = null;
                                errorBooster.uncaught(chrome.runtime.lastError, {
                                    creationCount: creationCount
                                });
                            } else {
                                creationCount += 1;
                                errorBooster.info("Offscreen is created", {
                                    creationCount: creationCount
                                });
                            }
                        });
                    }).finally(function() {
                        _this2.isClosingOffscreenDocument = null;
                        chrome.tabs.onRemoved.addListener(_this2.maybeCloseOffscreen);
                    });
                }
            }, {
                key: "_connectPort",
                value: function() {
                    var _this3 = this;
                    this.port = chrome.runtime.connect({
                        name: "offscreen"
                    });
                    this.port.onDisconnect.addListener(function() {
                        _this3.port = null;
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = void 0;
                        try {
                            for (var _step, _iterator = _this3.messages.values()[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var entry = _step.value;
                                if ("object" === ("undefined" === typeof entry ? "undefined" : _typeof(entry)) && entry.reject) entry.reject(new Error("Port was disconnected"));
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return) _iterator.return();
                            } finally {
                                if (_didIteratorError) throw _iteratorError;
                            }
                        }
                        _this3.messages.clear();
                    });
                    this.port.onMessage.addListener(function(message) {
                        var entry = _this3.messages.get(message.id);
                        if (entry) {
                            entry.resolve(message);
                            _this3.messages.delete(message.id);
                        }
                    });
                    return Promise.resolve();
                }
            }, {
                key: "_ensurePortConnected",
                value: function() {
                    var _this4 = this;
                    if (this.port) return Promise.resolve();
                    this.maybeCreateOffscreen();
                    return this.isCreatingOffscreenDocument.then(function() {
                        return _this4._connectPort();
                    });
                }
            }, {
                key: "addOffscreenListener",
                value: function(callback) {
                    if (this.port) this.port.onMessage.addListener(callback);
                }
            }, {
                key: "removeOffscreenListener",
                value: function(callback) {
                    if (this.port) this.port.onMessage.removeListener(callback);
                }
            }, {
                key: "maybeCloseOffscreen",
                value: function() {
                    if (!this.isClosingOffscreenDocument) this.isClosingOffscreenDocument = this._closeOffscreen();
                }
            }, {
                key: "maybeCreateOffscreen",
                value: function() {
                    if (!this.isCreatingOffscreenDocument) this.isCreatingOffscreenDocument = this._createOffscreen();
                }
            }, {
                key: "sendMessage",
                value: function(msgBody, _rejectMessage, callback, opt_errorHandler) {
                    var _this5 = this;
                    msgBody.id = this._getMessageId();
                    return this._ensurePortConnected().then(function() {
                        return new Promise(function(resolve, reject) {
                            _this5.messages.set(msgBody.id, {
                                resolve: resolve,
                                reject: reject
                            });
                            _this5.port.postMessage(msgBody);
                        });
                    }).then(function(message) {
                        if (callback) return callback(message);
                    }).catch(function(error) {
                        if (opt_errorHandler) opt_errorHandler(error);
                        if (error && error.message) errorBooster.uncaught(error.message);
                    });
                }
            } ], [ {
                key: "hasOffscreen",
                value: function() {
                    if ("getContexts" in chrome.runtime) return chrome.runtime.getContexts({
                        contextTypes: [ "OFFSCREEN_DOCUMENT" ]
                    }).then(function(contexts) {
                        return !!contexts.length;
                    }); else return clients.matchAll().then(function(matchedClients) {
                        return matchedClients.some(function(client) {
                            return client.url.includes(chrome.runtime.id);
                        });
                    });
                }
            } ]);
            return OffscreenManager;
        }();
        module.exports = new OffscreenManager();
    },
    259: function(module, exports, __webpack_require__) {
        "use strict";
        var loadImage = __webpack_require__(260);
        var FONT_COLOR_THRESHOLD = 170;
        var COLOR_BLACK = 0;
        var COLOR_WHITE = 1;
        var CANVAS_SIZE_THRESHOLD = 800;
        var MAX_THRESHOLD = 238;
        var MIN_THRESHOLD = 20;
        var PASTEL_THRESHOLD = 92;
        var OPACITY_TRESHOLD = 230;
        var WHITE_TRESHOLD = 253;
        var BLACK_TRESHOLD = 10;
        exports.DEFAULT_BGCOLOR = "e5e5e5";
        exports.OVERLAY_COLOR_WHITE = "ffffff";
        exports.OVERLAY_COLOR_BLACK = "000000";
        function toRGB(num) {
            return (num < 16 ? "0" : "") + num.toString(16);
        }
        function isAcidColor(red, green, blue) {
            var sum = red + green + blue;
            if (sum >= 2 * MAX_THRESHOLD && (red <= MIN_THRESHOLD || green <= MIN_THRESHOLD || blue <= MIN_THRESHOLD)) return true;
            if (sum <= MAX_THRESHOLD + 2 * MIN_THRESHOLD && (red >= MAX_THRESHOLD || green >= MAX_THRESHOLD || blue >= MAX_THRESHOLD)) return true;
            return false;
        }
        function isAlmostTransparent(opacity) {
            return opacity < OPACITY_TRESHOLD;
        }
        function isAlmostWhite(rgb) {
            return rgb[0] > WHITE_TRESHOLD && rgb[1] > WHITE_TRESHOLD && rgb[2] > WHITE_TRESHOLD;
        }
        function isAlmostBlack(rgb) {
            return rgb[0] < BLACK_TRESHOLD && rgb[1] < BLACK_TRESHOLD && rgb[2] < BLACK_TRESHOLD;
        }
        function isLightGrey(rgb) {
            var meanValue = (rgb[0] + rgb[1] + rgb[2]) / 3;
            return Math.abs(meanValue - rgb[0]) + Math.abs(meanValue - rgb[1]) + Math.abs(meanValue - rgb[2]) < 15;
        }
        exports.calculateFontColorForImage = function(img) {
            var color = exports.getDominant(img, {
                bottomQuarter: true,
                rightHalf: false,
                minifyCanvas: true,
                preventSkipColors: true
            });
            var fontColorNum = exports.getFontColorByBackgroundColor(color);
            var fontColor = 1 === fontColorNum ? exports.OVERLAY_COLOR_WHITE : exports.OVERLAY_COLOR_BLACK;
            return fontColor;
        };
        exports.getFontOverlayColorForBackgroundColor = function(bgColor) {
            var fontColorNum = exports.getFontColorByBackgroundColor(bgColor);
            return fontColorNum === COLOR_WHITE ? exports.OVERLAY_COLOR_WHITE : exports.OVERLAY_COLOR_BLACK;
        };
        function getRGBValues(colorString) {
            return {
                red: parseInt(colorString.substr(0, 2), 16),
                green: parseInt(colorString.substr(2, 2), 16),
                blue: parseInt(colorString.substr(4, 2), 16)
            };
        }
        var COLOR_NAMES = __webpack_require__(261);
        exports.normalize = function(str) {
            if (!str) return null;
            str = String(str).trim().toLowerCase();
            return str in COLOR_NAMES ? COLOR_NAMES[str] : normalizeHexValue(str);
        };
        var HEX_COLOR_RX = /^#?([\da-f]{3}(?:[\da-f]{3})?)/;
        function normalizeHexValue(val) {
            if (!HEX_COLOR_RX.test(val)) return null;
            val = HEX_COLOR_RX.exec(val)[1];
            return 3 === val.length ? color3to6(val) : val;
        }
        function color3to6(str) {
            return str[0] + str[0] + str[1] + str[1] + str[2] + str[2];
        }
        exports.calculateDominantColorByUrl = function(imageUrl, options, callback) {
            loadImage({
                url: imageUrl
            }, function(err, img) {
                var color = err ? null : exports.getDominant(img, options);
                callback(color);
            });
        };
        exports.calculateFontColorByUrl = function(imageUrl, callback) {
            loadImage({
                url: imageUrl
            }, function(err, img) {
                if (err) return callback(null);
                var color = exports.calculateFontColorForImage(img);
                callback(color);
            });
        };
        exports.getFontColorByBackgroundColor = function(bgColor) {
            bgColor = bgColor || exports.DEFAULT_BGCOLOR;
            var rgb = getRGBValues(bgColor);
            var tone = (rgb.red + rgb.green + rgb.blue) / 3;
            if (tone < FONT_COLOR_THRESHOLD && (rgb.red < FONT_COLOR_THRESHOLD || rgb.green < FONT_COLOR_THRESHOLD)) return COLOR_WHITE; else return COLOR_BLACK;
        };
        exports.getDominant = function(img, options) {
            options = options || {};
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            var canvasWidth = img.width;
            var canvasHeight = img.height;
            if (img.width > img.height) {
                if (options.minifyCanvas && img.width > CANVAS_SIZE_THRESHOLD) {
                    canvasWidth = CANVAS_SIZE_THRESHOLD;
                    canvasHeight = Math.round(canvasWidth * img.height / img.width);
                }
            } else if (options.minifyCanvas && img.height > CANVAS_SIZE_THRESHOLD) {
                canvasHeight = CANVAS_SIZE_THRESHOLD;
                canvasWidth = Math.round(canvasHeight * img.width / img.height);
            }
            canvas.setAttribute("width", canvasWidth);
            canvas.setAttribute("height", canvasHeight);
            ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
            var imgPixels;
            try {
                imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
            } catch (e) {
                return "";
            }
            var maxValueKey = null;
            var colorsContainer = {};
            var pixelColorData = new Array(4);
            var startY = options.bottomQuarter ? Math.round(.75 * imgPixels.height) : 0;
            var startX = options.rightHalf ? Math.round(imgPixels.width / 2) : 0;
            for (var y = startY; y < imgPixels.height; y++) for (var x = startX; x < imgPixels.width; x++) {
                var index = 4 * y * imgPixels.width + 4 * x;
                if (isAlmostTransparent(imgPixels.data[index + 3])) continue;
                pixelColorData[0] = imgPixels.data[index];
                pixelColorData[1] = imgPixels.data[index + 1];
                pixelColorData[2] = imgPixels.data[index + 2];
                pixelColorData[3] = imgPixels.data[index + 3];
                if (255 !== pixelColorData[3]) for (var z = 0; z < 3; z++) {
                    var colorStep = (255 - pixelColorData[z]) / 255;
                    pixelColorData[z] = Math.round(255 - colorStep * pixelColorData[3]);
                }
                if (!options.preventSkipColors && (isAlmostWhite(pixelColorData) || isAlmostBlack(pixelColorData) || isLightGrey(pixelColorData))) continue;
                var color = toRGB(pixelColorData[0]) + toRGB(pixelColorData[1]) + toRGB(pixelColorData[2]);
                colorsContainer[color] = colorsContainer[color] || 0;
                colorsContainer[color] += 1;
                if (null === maxValueKey || colorsContainer[maxValueKey] < colorsContainer[color]) maxValueKey = color;
            }
            if (maxValueKey) {
                var rgb = getRGBValues(maxValueKey);
                if (isAcidColor(rgb.red, rgb.green, rgb.blue)) {
                    rgb.red = Math.max(rgb.red, PASTEL_THRESHOLD);
                    rgb.green = Math.max(rgb.green, PASTEL_THRESHOLD);
                    rgb.blue = Math.max(rgb.blue, PASTEL_THRESHOLD);
                    maxValueKey = toRGB(rgb.red) + toRGB(rgb.green) + toRGB(rgb.blue);
                }
            }
            return maxValueKey || exports.DEFAULT_BGCOLOR;
        };
        function getIndexByXY(x, y, imgPixels) {
            return 4 * (imgPixels.width * y + x);
        }
        exports.isBlack = function(imgPixels) {
            var halfX = Math.floor(imgPixels.width / 2);
            var halfY = Math.floor(imgPixels.height / 2);
            var listToCheck = [];
            for (var x = 0; x < imgPixels.width - 1; x++) listToCheck.push(getIndexByXY(x, halfY, imgPixels));
            for (var y = 0; y < imgPixels.height - 1; y++) listToCheck.push(getIndexByXY(halfX, y, imgPixels));
            listToCheck.push(getIndexByXY(0, 0, imgPixels));
            listToCheck.push(getIndexByXY(imgPixels.width - 1, 0, imgPixels));
            listToCheck.push(getIndexByXY(0, imgPixels.height - 1, imgPixels));
            listToCheck.push(getIndexByXY(imgPixels.width - 1, imgPixels.height - 1, imgPixels));
            return listToCheck.every(function(index) {
                var red = imgPixels.data[index];
                var green = imgPixels.data[index + 1];
                var blue = imgPixels.data[index + 2];
                var opacity = imgPixels.data[index + 3];
                return 0 === red && 0 === green && 0 === blue && (255 === opacity || 0 === opacity);
            });
        };
        __webpack_require__(262).override(exports);
    },
    260: function(module, exports) {
        "use strict";
        module.exports = function(options, callback) {
            var img = new window.Image();
            img.onload = onLoad.bind(null, img, callback);
            img.onerror = onError.bind(null, img, callback);
            img.src = options.url;
            return img;
        };
        function onLoad(img, callback) {
            setTimeout(function() {
                callback(null, img);
            }, 0);
        }
        function onError(img, callback) {
            callback(new Error("Image load error: " + img.src), img);
        }
    },
    261: function(module, exports) {
        "use strict";
        module.exports = {
            aliceblue: "f0f8ff",
            antiquewhite: "faebd7",
            aqua: "00ffff",
            aquamarine: "7fffd4",
            azure: "f0ffff",
            beige: "f5f5dc",
            bisque: "ffe4c4",
            black: "000000",
            blanchedalmond: "ffebcd",
            blue: "0000ff",
            blueviolet: "8a2be2",
            brown: "a52a2a",
            burlywood: "deb887",
            cadetblue: "5f9ea0",
            chartreuse: "7fff00",
            chocolate: "d2691e",
            coral: "ff7f50",
            cornflowerblue: "6495ed",
            cornsilk: "fff8dc",
            crimson: "dc143c",
            cyan: "00ffff",
            darkblue: "00008b",
            darkcyan: "008b8b",
            darkgoldenrod: "b8860b",
            darkgray: "a9a9a9",
            darkgreen: "006400",
            darkgrey: "a9a9a9",
            darkkhaki: "bdb76b",
            darkmagenta: "8b008b",
            darkolivegreen: "556b2f",
            darkorange: "ff8c00",
            darkorchid: "9932cc",
            darkred: "8b0000",
            darksalmon: "e9967a",
            darkseagreen: "8fbc8f",
            darkslateblue: "483d8b",
            darkslategray: "2f4f4f",
            darkslategrey: "2f4f4f",
            darkturquoise: "00ced1",
            darkviolet: "9400d3",
            deeppink: "ff1493",
            deepskyblue: "00bfff",
            dimgray: "696969",
            dimgrey: "696969",
            dodgerblue: "1e90ff",
            firebrick: "b22222",
            floralwhite: "fffaf0",
            forestgreen: "228b22",
            fuchsia: "ff00ff",
            gainsboro: "dcdcdc",
            ghostwhite: "f8f8ff",
            gold: "ffd700",
            goldenrod: "daa520",
            gray: "808080",
            green: "008000",
            greenyellow: "adff2f",
            grey: "808080",
            honeydew: "f0fff0",
            hotpink: "ff69b4",
            indianred: "cd5c5c",
            indigo: "4b0082",
            ivory: "fffff0",
            khaki: "f0e68c",
            lavender: "e6e6fa",
            lavenderblush: "fff0f5",
            lawngreen: "7cfc00",
            lemonchiffon: "fffacd",
            lightblue: "add8e6",
            lightcoral: "f08080",
            lightcyan: "e0ffff",
            lightgoldenrodyellow: "fafad2",
            lightgray: "d3d3d3",
            lightgreen: "90ee90",
            lightgrey: "d3d3d3",
            lightpink: "ffb6c1",
            lightsalmon: "ffa07a",
            lightseagreen: "20b2aa",
            lightskyblue: "87cefa",
            lightslategray: "778899",
            lightslategrey: "778899",
            lightsteelblue: "b0c4de",
            lightyellow: "ffffe0",
            lime: "00ff00",
            limegreen: "32cd32",
            linen: "faf0e6",
            magenta: "ff00ff",
            maroon: "800000",
            mediumaquamarine: "66cdaa",
            mediumblue: "0000cd",
            mediumorchid: "ba55d3",
            mediumpurple: "9370db",
            mediumseagreen: "3cb371",
            mediumslateblue: "7b68ee",
            mediumspringgreen: "00fa9a",
            mediumturquoise: "48d1cc",
            mediumvioletred: "c71585",
            midnightblue: "191970",
            mintcream: "f5fffa",
            mistyrose: "ffe4e1",
            moccasin: "ffe4b5",
            navajowhite: "ffdead",
            navy: "000080",
            oldlace: "fdf5e6",
            olive: "808000",
            olivedrab: "6b8e23",
            orange: "ffa500",
            orangered: "ff4500",
            orchid: "da70d6",
            palegoldenrod: "eee8aa",
            palegreen: "98fb98",
            paleturquoise: "afeeee",
            palevioletred: "db7093",
            papayawhip: "ffefd5",
            peachpuff: "ffdab9",
            peru: "cd853f",
            pink: "ffc0cb",
            plum: "dda0dd",
            powderblue: "b0e0e6",
            purple: "800080",
            rebeccapurple: "663399",
            red: "ff0000",
            rosybrown: "bc8f8f",
            royalblue: "4169e1",
            saddlebrown: "8b4513",
            salmon: "fa8072",
            sandybrown: "f4a460",
            seagreen: "2e8b57",
            seashell: "fff5ee",
            sienna: "a0522d",
            silver: "c0c0c0",
            skyblue: "87ceeb",
            slateblue: "6a5acd",
            slategray: "708090",
            slategrey: "708090",
            snow: "fffafa",
            springgreen: "00ff7f",
            steelblue: "4682b4",
            tan: "d2b48c",
            teal: "008080",
            thistle: "d8bfd8",
            tomato: "ff6347",
            turquoise: "40e0d0",
            violet: "ee82ee",
            wheat: "f5deb3",
            white: "ffffff",
            whitesmoke: "f5f5f5",
            yellow: "ffff00",
            yellowgreen: "9acd32"
        };
    },
    262: function(module, exports, __webpack_require__) {
        "use strict";
        var _typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
        var events = __webpack_require__(69);
        var offscreenManager = __webpack_require__(70);
        exports.override = function(colors) {
            if ("object" !== ("undefined" === typeof colors ? "undefined" : _typeof(colors))) return;
            colors.calculateDominantColorByUrlOriginal = colors.calculateDominantColorByUrl.bind({});
            colors.calculateFontColorByUrlOriginal = colors.calculateFontColorByUrl.bind({});
            colors.calculateDominantColorByUrl = function(imgUrl, options, successCallback) {
                var callback = function(message) {
                    var errObj = message.errObj, color = message.color;
                    if (errObj) throw new Error(errObj.message); else return successCallback(color);
                };
                var msgBody = {
                    type: events.backend.COLORS_DOMINANT_COLOR_BY_URL,
                    data: {
                        imgUrl: imgUrl,
                        options: options
                    }
                };
                return offscreenManager.sendMessage(msgBody, "Colors calculateDominantColorByUrl timed out", callback);
            };
            colors.calculateFontColorByUrl = function(imgUrl, successCallback) {
                var callback = function(message) {
                    var errObj = message.errObj, color = message.color;
                    if (errObj) throw new Error(errObj.message); else return successCallback(color);
                };
                var msgBody = {
                    type: events.backend.COLORS_FONT_COLOR_BY_URL,
                    data: {
                        imgUrl: imgUrl
                    }
                };
                return offscreenManager.sendMessage(msgBody, "Colors calculateFontColorByUrl timed out", callback);
            };
        };
    },
    410: function(module, exports) {
        "use strict";
        exports.STATUS = {
            READY: 0,
            CONNECTING: 1,
            RECORD: 2,
            PROCESSING: 3,
            FINISHED: 4,
            INTERRUPTED: 5,
            ERROR: 6
        };
        exports.API_KEY = "ea0ff746-a756-4bd9-882d-0ab983fae8a8";
        exports.ERROR_REASON = {
            SILENCE: "silence"
        };
        exports.ANIMATION_TIMEOUT_MS = 1200;
        exports.UTTERANCE_SILENCE = 60;
        exports.SILENCE_TIMEOUT_MS = 1e3 * 8;
        exports.IS_VOICE_USED = "isVoiceUsed";
    },
    507: function(module, exports, __webpack_require__) {
        "use strict";
        var _createClass = function() {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }
        var colorUtils = __webpack_require__(259);
        var events = __webpack_require__(69);
        var ColorsHandler = function() {
            function ColorsHandler() {
                _classCallCheck(this, ColorsHandler);
            }
            _createClass(ColorsHandler, [ {
                key: "_calculateDominantColorByUrl",
                value: function(_ref) {
                    var imgUrl = _ref.imgUrl, options = _ref.options, sendResponse = _ref.sendResponse;
                    colorUtils.calculateDominantColorByUrlOriginal(imgUrl, options, function(color) {
                        sendResponse({
                            color: color
                        });
                    });
                }
            }, {
                key: "_calculateFontColorByUrl",
                value: function(_ref2) {
                    var imgUrl = _ref2.imgUrl, sendResponse = _ref2.sendResponse;
                    colorUtils.calculateFontColorByUrlOriginal(imgUrl, function(color) {
                        sendResponse({
                            color: color
                        });
                    });
                }
            }, {
                key: "handle",
                value: function(req, _sender) {
                    switch (req.type) {
                      case events.backend.COLORS_DOMINANT_COLOR_BY_URL:
                        this._calculateDominantColorByUrl(req.data);
                        break;

                      case events.backend.COLORS_FONT_COLOR_BY_URL:
                        this._calculateFontColorByUrl(req.data);
                        break;

                      default:
                        return;
                    }
                    return true;
                }
            } ]);
            return ColorsHandler;
        }();
        module.exports = new ColorsHandler();
    },
    508: function(module, exports, __webpack_require__) {
        "use strict";
        var _createClass = function() {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }
        var Filer = __webpack_require__(509);
        var events = __webpack_require__(69);
        var DATA_URI_REG_EXP = /^data:/;
        var FilerHandler = function() {
            function FilerHandler() {
                _classCallCheck(this, FilerHandler);
                this.filer = new Filer();
            }
            _createClass(FilerHandler, [ {
                key: "_isDataUri",
                value: function(url) {
                    return "string" === typeof url && DATA_URI_REG_EXP.test(url);
                }
            }, {
                key: "_getErrorHandler",
                value: function(sendResponse) {
                    return function(err) {
                        sendResponse({
                            errObj: {
                                name: err.name,
                                message: err.message
                            }
                        });
                    };
                }
            }, {
                key: "_init",
                value: function(_ref) {
                    var opt_initObj = _ref.opt_initObj, sendResponse = _ref.sendResponse;
                    this.filer.init(opt_initObj, function() {
                        sendResponse({});
                    }, this._getErrorHandler(sendResponse));
                }
            }, {
                key: "_ls",
                value: function(_ref2) {
                    var dirEntryOrPath = _ref2.dirEntryOrPath, sendResponse = _ref2.sendResponse;
                    this.filer.ls(dirEntryOrPath, function(entries) {
                        sendResponse({
                            entries: entries.map(function(entry) {
                                return {
                                    fullPath: entry.fullPath,
                                    name: entry.name
                                };
                            })
                        });
                    }, this._getErrorHandler(sendResponse));
                }
            }, {
                key: "_mkdir",
                value: function(_ref3) {
                    var path = _ref3.path, opt_exclusive = _ref3.opt_exclusive, sendResponse = _ref3.sendResponse;
                    this.filer.mkdir(path, opt_exclusive, function(entry) {
                        sendResponse({
                            entry: {
                                fullPath: entry.fullPath,
                                name: entry.name
                            }
                        });
                    }, this._getErrorHandler(sendResponse));
                }
            }, {
                key: "_open",
                value: function(_ref4) {
                    var entryOrPath = _ref4.entryOrPath, sendResponse = _ref4.sendResponse;
                    this.filer.open(entryOrPath, function(file) {
                        sendResponse({
                            file: Filer.fileToObjectURL(file)
                        });
                    }, this._getErrorHandler(sendResponse));
                }
            }, {
                key: "_pathToFilesystemURL",
                value: function(_ref5) {
                    var path = _ref5.path, sendResponse = _ref5.sendResponse;
                    this.filer.pathToFilesystemURL(path, function(path) {
                        sendResponse({
                            path: path
                        });
                    }, this._getErrorHandler(sendResponse));
                }
            }, {
                key: "_create",
                value: function(_ref6) {
                    var path = _ref6.path, opt_exclusive = _ref6.opt_exclusive, sendResponse = _ref6.sendResponse;
                    this.filer.create(path, opt_exclusive, function() {
                        sendResponse({});
                    }, this._getErrorHandler(sendResponse));
                }
            }, {
                key: "_mv",
                value: function(_ref7) {
                    var src = _ref7.src, dest = _ref7.dest, opt_newName = _ref7.opt_newName, sendResponse = _ref7.sendResponse;
                    this.filer.mv(src, dest, opt_newName, function(entry) {
                        sendResponse({
                            entry: {
                                fullPath: entry.fullPath,
                                name: entry.name
                            }
                        });
                    }, this._getErrorHandler(sendResponse));
                }
            }, {
                key: "_rm",
                value: function(_ref8) {
                    var entryOrPath = _ref8.entryOrPath, sendResponse = _ref8.sendResponse;
                    this.filer.rm(entryOrPath, function() {
                        sendResponse({});
                    }, this._getErrorHandler(sendResponse));
                }
            }, {
                key: "_cd",
                value: function(_ref9) {
                    var dirEntryOrPath = _ref9.dirEntryOrPath, sendResponse = _ref9.sendResponse;
                    this.filer.cd(dirEntryOrPath, function(entry) {
                        sendResponse({
                            entry: {
                                fullPath: entry.fullPath,
                                name: entry.name
                            }
                        });
                    }, this._getErrorHandler(sendResponse));
                }
            }, {
                key: "_cp",
                value: function(_ref10) {
                    var src = _ref10.src, dest = _ref10.dest, opt_newName = _ref10.opt_newName, sendResponse = _ref10.sendResponse;
                    this.filer.cp(src, dest, opt_newName, function(entry) {
                        sendResponse({
                            entry: {
                                fullPath: entry.fullPath,
                                name: entry.name
                            }
                        });
                    }, this._getErrorHandler(sendResponse));
                }
            }, {
                key: "_write",
                value: function(_ref11) {
                    var entryOrPath = _ref11.entryOrPath, writeData = _ref11.writeData, sendResponse = _ref11.sendResponse;
                    if (this._isDataUri(writeData)) writeData = Filer.dataURLToBlob(writeData);
                    this.filer.write(entryOrPath, writeData, function(entry) {
                        sendResponse({
                            entry: {
                                name: entry.name,
                                path: entry.fullPath
                            }
                        });
                    }, this._getErrorHandler(sendResponse));
                }
            }, {
                key: "_df",
                value: function(_ref12) {
                    var sendResponse = _ref12.sendResponse;
                    this.filer.df(function(byteUsed, byteLeft, byteCap) {
                        sendResponse({
                            data: {
                                byteUsed: byteUsed,
                                byteLeft: byteLeft,
                                byteCap: byteCap
                            }
                        });
                    }, this._getErrorHandler(sendResponse));
                }
            }, {
                key: "_getEntry",
                value: function(_ref13) {
                    var fileName = _ref13.fileName, sendResponse = _ref13.sendResponse;
                    this.filer.getEntry(fileName, function(entry) {
                        sendResponse({
                            entry: entry.toURL()
                        });
                    }, this._getErrorHandler(sendResponse));
                }
            }, {
                key: "handle",
                value: function(req, _sender) {
                    var _this = this;
                    if (!this.isFilerInitializing) this.isFilerInitializing = new Promise(function(resolve) {
                        _this.filer.init({
                            persistent: true,
                            size: 0
                        }, function() {
                            resolve();
                        });
                    });
                    var handler = null;
                    switch (req.type) {
                      case events.backend.FILER_CD:
                        handler = this._cd;
                        break;

                      case events.backend.FILER_CP:
                        handler = this._cp;
                        break;

                      case events.backend.FILER_CREATE:
                        handler = this._create;
                        break;

                      case events.backend.FILER_DF:
                        handler = this._df;
                        break;

                      case events.backend.FILER_GET_ENTRY:
                        handler = this._getEntry;
                        break;

                      case events.backend.FILER_INIT:
                        handler = this._init;
                        break;

                      case events.backend.FILER_LS:
                        handler = this._ls;
                        break;

                      case events.backend.FILER_MKDIR:
                        handler = this._mkdir;
                        break;

                      case events.backend.FILER_MV:
                        handler = this._mv;
                        break;

                      case events.backend.FILER_OPEN:
                        handler = this._open;
                        break;

                      case events.backend.FILER_PATH_TO_FILESYSTEM_URL:
                        handler = this._pathToFilesystemURL;
                        break;

                      case events.backend.FILER_RM:
                        handler = this._rm;
                        break;

                      case events.backend.FILER_WRITE:
                        handler = this._write;
                        break;

                      default:
                        return;
                    }
                    handler = handler.bind(this);
                    this.isFilerInitializing.then(function() {
                        handler(req.data);
                    });
                    return true;
                }
            } ]);
            return FilerHandler;
        }();
        module.exports = new FilerHandler();
    },
    509: function(module, exports) {
        "use strict";
        var _typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
        var self = window;
        self.requestFileSystem = self.requestFileSystem || self.webkitRequestFileSystem;
        self.resolveLocalFileSystemURL = self.resolveLocalFileSystemURL || self.webkitResolveLocalFileSystemURL;
        navigator.temporaryStorage = navigator.temporaryStorage || navigator.webkitTemporaryStorage;
        navigator.persistentStorage = navigator.persistentStorage || navigator.webkitPersistentStorage;
        self.BlobBuilder = self.BlobBuilder || self.MozBlobBuilder || self.WebKitBlobBuilder;
        if (void 0 === self.FileError) {
            var FileError = function() {};
            FileError.prototype.prototype = Error.prototype;
        } else FileError = self.FileError;
        var Util = {
            toArray: function(list) {
                return Array.prototype.slice.call(list || [], 0);
            },
            strToDataURL: function(str, contentType, opt_isBinary) {
                var isBinary = void 0 != opt_isBinary ? opt_isBinary : true;
                if (isBinary) return "data:" + contentType + ";base64," + self.btoa(str); else return "data:" + contentType + "," + str;
            },
            strToObjectURL: function(binStr, opt_contentType) {
                var ui8a = new Uint8Array(binStr.length);
                for (var i = 0; i < ui8a.length; ++i) ui8a[i] = binStr.charCodeAt(i);
                var blob = new Blob([ ui8a ], opt_contentType ? {
                    type: opt_contentType
                } : {});
                return self.URL.createObjectURL(blob);
            },
            fileToObjectURL: function(blob) {
                return self.URL.createObjectURL(blob);
            },
            fileToArrayBuffer: function(blob, callback, opt_errorCallback) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    callback(e.target.result);
                };
                reader.onerror = function(e) {
                    if (opt_errorCallback) opt_errorCallback(e);
                };
                reader.readAsArrayBuffer(blob);
            },
            dataURLToBlob: function(dataURL) {
                var BASE64_MARKER = ";base64,";
                if (dataURL.indexOf(BASE64_MARKER) == -1) {
                    var parts = dataURL.split(",");
                    var contentType = parts[0].split(":")[1];
                    var raw = decodeURIComponent(parts[1]);
                    return new Blob([ raw ], {
                        type: contentType
                    });
                }
                var parts = dataURL.split(BASE64_MARKER);
                var contentType = parts[0].split(":")[1];
                var raw = window.atob(parts[1]);
                var rawLength = raw.length;
                var uInt8Array = new Uint8Array(rawLength);
                for (var i = 0; i < rawLength; ++i) uInt8Array[i] = raw.charCodeAt(i);
                return new Blob([ uInt8Array ], {
                    type: contentType
                });
            },
            arrayBufferToBlob: function(buffer, opt_contentType) {
                var uInt8Array = new Uint8Array(buffer);
                return new Blob([ uInt8Array ], opt_contentType ? {
                    type: opt_contentType
                } : {});
            },
            arrayBufferToBinaryString: function(buffer, callback, opt_errorCallback) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    callback(e.target.result);
                };
                reader.onerror = function(e) {
                    if (opt_errorCallback) opt_errorCallback(e);
                };
                var uInt8Array = new Uint8Array(buffer);
                reader.readAsBinaryString(new Blob([ uInt8Array ]));
            },
            arrayToBinaryString: function(bytes) {
                if (("undefined" === typeof bytes ? "undefined" : _typeof(bytes)) != _typeof([])) return null;
                var i = bytes.length;
                var bstr = new Array(i);
                while (i--) bstr[i] = String.fromCharCode(bytes[i]);
                return bstr.join("");
            },
            getFileExtension: function(filename) {
                var idx = filename.lastIndexOf(".");
                return idx != -1 ? filename.substring(idx) : "";
            }
        };
        var MyFileError = function(obj) {
            this.prototype = FileError.prototype;
            this.code = obj.code;
            this.name = obj.name;
        };
        FileError.BROWSER_NOT_SUPPORTED = 1e3;
        FileError.prototype.__defineGetter__("name", function() {
            var keys = Object.keys(FileError);
            for (var key, i = 0; key = keys[i]; ++i) if (FileError[key] == this.code) return key;
            return "Unknown Error";
        });
        var Filer = new function() {
            var FS_INIT_ERROR_MSG = "Filesystem has not been initialized.";
            var NOT_IMPLEMENTED_MSG = "Not implemented.";
            var NOT_A_DIRECTORY = "Path was not a directory.";
            var INCORRECT_ARGS = "These method arguments are not supported.";
            var FS_URL_SCHEME = "filesystem:";
            var DEFAULT_FS_SIZE = 1024 * 1024;
            var fs_ = null;
            var cwd_ = null;
            var isOpen_ = false;
            var isFsURL_ = function(path) {
                return 0 == path.indexOf(FS_URL_SCHEME);
            };
            var pathToFsURL_ = function(path) {
                if (!isFsURL_(path)) if ("/" == path[0]) path = fs_.root.toURL() + path.substring(1); else if (0 == path.indexOf("./") || 0 == path.indexOf("../")) if ("../" == path && cwd_ != fs_.root) path = cwd_.toURL() + "/" + path; else path = cwd_.toURL() + path; else path = cwd_.toURL() + "/" + path;
                return path;
            };
            var getEntry_ = function(srcStr, destStr, callback, errback) {
                var onError = function(e) {
                    if (errback) errback(e);
                };
                var src = pathToFsURL_(srcStr);
                if (srcStr && destStr) {
                    var dest = pathToFsURL_(destStr);
                    self.resolveLocalFileSystemURL(src, function(srcEntry) {
                        self.resolveLocalFileSystemURL(dest, function(destEntry) {
                            callback(srcEntry, destEntry);
                        }, onError);
                    }, onError);
                } else self.resolveLocalFileSystemURL(src, callback, onError);
            };
            var copyOrMove_ = function(src, dest, opt_newName, opt_successCallback, opt_errorHandler, opt_deleteOrig) {
                if (!fs_) throw new Error(FS_INIT_ERROR_MSG);
                if (("undefined" === typeof src ? "undefined" : _typeof(src)) != ("undefined" === typeof dest ? "undefined" : _typeof(dest))) throw new Error(INCORRECT_ARGS);
                var newName = opt_newName || null;
                var deleteOrig = void 0 != opt_deleteOrig ? opt_deleteOrig : false;
                if ((src.isFile || dest.isDirectory) && dest.isDirectory) if (deleteOrig) src.moveTo(dest, newName, opt_successCallback, opt_errorHandler); else src.copyTo(dest, newName, opt_successCallback, opt_errorHandler); else getEntry_(src, dest, function(srcEntry, destDir) {
                    if (!destDir.isDirectory) {
                        var e = new Error('Oops! "' + destDir.name + " is not a directory!");
                        if (opt_errorHandler) opt_errorHandler(e); else throw e;
                        return;
                    }
                    if (deleteOrig) srcEntry.moveTo(destDir, newName, opt_successCallback, opt_errorHandler); else srcEntry.copyTo(destDir, newName, opt_successCallback, opt_errorHandler);
                }, opt_errorHandler);
            };
            function Filer(fs) {
                fs_ = fs || null;
                if (fs_) {
                    cwd_ = fs_.root;
                    isOpen_ = true;
                }
            }
            Filer.DEFAULT_FS_SIZE = DEFAULT_FS_SIZE;
            Filer.version = "0.4.3";
            Filer.prototype = {
                get fs() {
                    return fs_;
                },
                get isOpen() {
                    return isOpen_;
                },
                get cwd() {
                    return cwd_;
                }
            };
            Filer.prototype.pathToFilesystemURL = function(path) {
                return pathToFsURL_(path);
            };
            Filer.prototype.init = function(opt_initObj, opt_successCallback, opt_errorHandler) {
                if (!self.requestFileSystem) throw new MyFileError({
                    code: FileError.BROWSER_NOT_SUPPORTED,
                    name: "BROWSER_NOT_SUPPORTED"
                });
                var initObj = opt_initObj ? opt_initObj : {};
                var size = initObj.size || DEFAULT_FS_SIZE;
                this.type = self.TEMPORARY;
                if ("persistent" in initObj && initObj.persistent) this.type = self.PERSISTENT;
                var init = function(fs) {
                    this.size = size;
                    fs_ = fs;
                    cwd_ = fs_.root;
                    isOpen_ = true;
                    opt_successCallback && opt_successCallback(fs);
                };
                if (this.type == self.PERSISTENT && !!navigator.persistentStorage) navigator.persistentStorage.requestQuota(size, function(grantedBytes) {
                    self.requestFileSystem(this.type, grantedBytes, init.bind(this), opt_errorHandler);
                }.bind(this), opt_errorHandler); else self.requestFileSystem(this.type, size, init.bind(this), opt_errorHandler);
            };
            Filer.prototype.ls = function(dirEntryOrPath, successCallback, opt_errorHandler) {
                if (!fs_) throw new Error(FS_INIT_ERROR_MSG);
                var callback = function(dirEntry) {
                    var entries_ = [];
                    var reader = dirEntry.createReader();
                    var readEntries = function readEntries() {
                        reader.readEntries(function(results) {
                            if (!results.length) {
                                entries_.sort(function(a, b) {
                                    return a.name < b.name ? -1 : b.name < a.name ? 1 : 0;
                                });
                                successCallback(entries_);
                            } else {
                                entries_ = entries_.concat(Util.toArray(results));
                                readEntries();
                            }
                        }, opt_errorHandler);
                    };
                    readEntries();
                };
                if (dirEntryOrPath.isDirectory) callback(dirEntryOrPath); else if (isFsURL_(dirEntryOrPath)) getEntry_(dirEntryOrPath, null, callback, opt_errorHandler); else cwd_.getDirectory(dirEntryOrPath, {}, callback, opt_errorHandler);
            };
            Filer.prototype.mkdir = function(path, opt_exclusive, opt_successCallback, opt_errorHandler) {
                if (!fs_) throw new Error(FS_INIT_ERROR_MSG);
                var exclusive = null != opt_exclusive ? opt_exclusive : false;
                var folderParts = path.split("/");
                var createDir = function createDir(rootDir, folders) {
                    if ("." == folders[0] || "" == folders[0]) folders = folders.slice(1);
                    rootDir.getDirectory(folders[0], {
                        create: true,
                        exclusive: exclusive
                    }, function(dirEntry) {
                        if (dirEntry.isDirectory) {
                            if (folders.length && 1 != folderParts.length) createDir(dirEntry, folders.slice(1)); else if (opt_successCallback) opt_successCallback(dirEntry);
                        } else {
                            var e = new Error(path + " is not a directory");
                            if (opt_errorHandler) opt_errorHandler(e); else throw e;
                        }
                    }, function(e) {
                        if (e.code == FileError.INVALID_MODIFICATION_ERR) {
                            e.message = "'" + path + "' already exists";
                            if (opt_errorHandler) opt_errorHandler(e); else throw e;
                        }
                    });
                };
                createDir(cwd_, folderParts);
            };
            Filer.prototype.open = function(entryOrPath, successCallback, opt_errorHandler) {
                if (!fs_) throw new Error(FS_INIT_ERROR_MSG);
                if (entryOrPath.isFile) entryOrPath.file(successCallback, opt_errorHandler); else getEntry_(pathToFsURL_(entryOrPath), null, function(fileEntry) {
                    fileEntry.file(successCallback, opt_errorHandler);
                }, opt_errorHandler);
            };
            Filer.prototype.create = function(path, opt_exclusive, successCallback, opt_errorHandler) {
                if (!fs_) throw new Error(FS_INIT_ERROR_MSG);
                var exclusive = null != opt_exclusive ? opt_exclusive : true;
                cwd_.getFile(path, {
                    create: true,
                    exclusive: exclusive
                }, successCallback, function(e) {
                    if (e.code == FileError.INVALID_MODIFICATION_ERR) e.message = "'" + path + "' already exists";
                    if (opt_errorHandler) opt_errorHandler(e); else throw e;
                });
            };
            Filer.prototype.mv = function(src, dest, opt_newName, opt_successCallback, opt_errorHandler) {
                copyOrMove_.bind(this, src, dest, opt_newName, opt_successCallback, opt_errorHandler, true)();
            };
            Filer.prototype.rm = function(entryOrPath, successCallback, opt_errorHandler) {
                if (!fs_) throw new Error(FS_INIT_ERROR_MSG);
                var removeIt = function(entry) {
                    if (entry.isFile) entry.remove(successCallback, opt_errorHandler); else if (entry.isDirectory) entry.removeRecursively(successCallback, opt_errorHandler);
                };
                if (entryOrPath.isFile || entryOrPath.isDirectory) removeIt(entryOrPath); else getEntry_(entryOrPath, null, removeIt, opt_errorHandler);
            };
            Filer.prototype.cd = function(dirEntryOrPath, opt_successCallback, opt_errorHandler) {
                if (!fs_) throw new Error(FS_INIT_ERROR_MSG);
                if (dirEntryOrPath.isDirectory) {
                    cwd_ = dirEntryOrPath;
                    opt_successCallback && opt_successCallback(cwd_);
                } else {
                    dirEntryOrPath = pathToFsURL_(dirEntryOrPath);
                    getEntry_(dirEntryOrPath, null, function(dirEntry) {
                        if (dirEntry.isDirectory) {
                            cwd_ = dirEntry;
                            opt_successCallback && opt_successCallback(cwd_);
                        } else {
                            var e = new Error(NOT_A_DIRECTORY);
                            if (opt_errorHandler) opt_errorHandler(e); else throw e;
                        }
                    }, opt_errorHandler);
                }
            };
            Filer.prototype.cp = function(src, dest, opt_newName, opt_successCallback, opt_errorHandler) {
                copyOrMove_.bind(this, src, dest, opt_newName, opt_successCallback, opt_errorHandler)();
            };
            Filer.prototype.write = function(entryOrPath, dataObj, opt_successCallback, opt_errorHandler) {
                if (!fs_) throw new Error(FS_INIT_ERROR_MSG);
                var writeFile_ = function(fileEntry) {
                    fileEntry.createWriter(function(fileWriter) {
                        fileWriter.onerror = opt_errorHandler;
                        if (dataObj.append) {
                            fileWriter.onwriteend = function(e) {
                                if (opt_successCallback) opt_successCallback(fileEntry, this);
                            };
                            fileWriter.seek(fileWriter.length);
                        } else {
                            var truncated = false;
                            fileWriter.onwriteend = function(e) {
                                if (!truncated) {
                                    truncated = true;
                                    this.truncate(this.position);
                                    return;
                                }
                                if (opt_successCallback) opt_successCallback(fileEntry, this);
                            };
                        }
                        if (dataObj instanceof Blob) fileWriter.write(dataObj); else {
                            if (dataObj.data.__proto__ == ArrayBuffer.prototype) dataObj.data = new Uint8Array(dataObj.data);
                            var blob = new Blob([ dataObj.data ], dataObj.type ? {
                                type: dataObj.type
                            } : {});
                            fileWriter.write(blob);
                        }
                    }, opt_errorHandler);
                };
                if (entryOrPath.isFile) writeFile_(entryOrPath); else if (isFsURL_(entryOrPath)) getEntry_(entryOrPath, null, writeFile_, opt_errorHandler); else cwd_.getFile(entryOrPath, {
                    create: true,
                    exclusive: false
                }, writeFile_, opt_errorHandler);
            };
            Filer.prototype.df = function(successCallback, opt_errorHandler) {
                var queryCallback = function(byteUsed, byteCap) {
                    successCallback(byteUsed, byteCap - byteUsed, byteCap);
                };
                if (!(navigator.temporaryStorage.queryUsageAndQuota && navigator.persistentStorage.queryUsageAndQuota)) throw new Error(NOT_IMPLEMENTED_MSG);
                if (self.TEMPORARY == this.type) navigator.temporaryStorage.queryUsageAndQuota(queryCallback, opt_errorHandler); else if (self.PERSISTENT == this.type) navigator.persistentStorage.queryUsageAndQuota(queryCallback, opt_errorHandler);
            };
            Filer.prototype.getEntry = function(fileName, callback, errback) {
                getEntry_(fileName, null, callback, errback);
            };
            return Filer;
        }();
        module.exports = Filer;
        module.exports.dataURLToBlob = Util.dataURLToBlob.bind({});
        module.exports.fileToObjectURL = Util.fileToObjectURL.bind({});
    },
    510: function(module, exports, __webpack_require__) {
        "use strict";
        var _typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
        var _createClass = function() {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }
        var colorsHandler = __webpack_require__(507);
        var filerHandler = __webpack_require__(508);
        var speechkitHandler = __webpack_require__(511);
        var xmlHandler = __webpack_require__(513);
        var handlers = [ colorsHandler, filerHandler, speechkitHandler, xmlHandler ];
        var Messaging = function() {
            function Messaging() {
                _classCallCheck(this, Messaging);
            }
            _createClass(Messaging, [ {
                key: "init",
                value: function() {
                    this._handleConnection = this._getConnectionHandler().bind(this);
                    chrome.runtime.onConnect.addListener(this._handleConnection);
                }
            }, {
                key: "_getConnectionHandler",
                value: function() {
                    return function(port) {
                        if ("offscreen" === port.name) port.onMessage.addListener(function(req) {
                            if (req.data) {
                                req.data.sendResponse = function(message) {
                                    if ("object" === ("undefined" === typeof message ? "undefined" : _typeof(message))) message.id = req.id;
                                    port.postMessage(message);
                                };
                                var _iteratorNormalCompletion = true;
                                var _didIteratorError = false;
                                var _iteratorError = void 0;
                                try {
                                    for (var _step, _iterator = handlers[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                        var handler = _step.value;
                                        if (handler.handle(req, port.sender)) return;
                                    }
                                } catch (err) {
                                    _didIteratorError = true;
                                    _iteratorError = err;
                                } finally {
                                    try {
                                        if (!_iteratorNormalCompletion && _iterator.return) _iterator.return();
                                    } finally {
                                        if (_didIteratorError) throw _iteratorError;
                                    }
                                }
                            }
                        });
                    };
                }
            } ]);
            return Messaging;
        }();
        module.exports = new Messaging();
    },
    511: function(module, exports, __webpack_require__) {
        "use strict";
        var _createClass = function() {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }
        var speechkit = __webpack_require__(512).ya.speechkit;
        var _require = __webpack_require__(410), UTTERANCE_SILENCE = _require.UTTERANCE_SILENCE, API_KEY = _require.API_KEY;
        var events = __webpack_require__(69);
        var SpeechkitHandler = function() {
            function SpeechkitHandler() {
                _classCallCheck(this, SpeechkitHandler);
            }
            _createClass(SpeechkitHandler, [ {
                key: "_init",
                value: function(_ref) {
                    var sendResponse = _ref.sendResponse;
                    this.streamer = new speechkit.SpeechRecognition();
                    this.streamer.start({
                        apiKey: API_KEY,
                        initCallback: function() {
                            return sendResponse({});
                        },
                        errorCallback: function(error) {
                            sendResponse({
                                type: events.offscreen.SPEECHKIT_ERROR,
                                data: {
                                    reason: error.message
                                }
                            });
                        },
                        dataCallback: function(text, done) {
                            sendResponse({
                                type: events.offscreen.SPEECHKIT_DATA,
                                data: {
                                    text: text,
                                    done: done
                                }
                            });
                        },
                        utteranceSilence: UTTERANCE_SILENCE,
                        particialResults: true
                    });
                }
            }, {
                key: "_stop",
                value: function(_ref2) {
                    var sendResponse = _ref2.sendResponse;
                    try {
                        if (this.streamer) this.streamer.stop();
                    } catch (e) {} finally {
                        sendResponse({});
                    }
                }
            }, {
                key: "handle",
                value: function(req, _sender) {
                    switch (req.type) {
                      case events.backend.SPEECHKIT_INIT:
                        this._init(req.data);
                        break;

                      case events.backend.SPEECHKIT_STOP:
                        this._stop(req.data);
                        break;

                      default:
                        return;
                    }
                    return true;
                }
            } ]);
            return SpeechkitHandler;
        }();
        module.exports = new SpeechkitHandler();
    },
    512: function(module, exports) {
        var speechkitNamespace = {
            ya: {
                speechkit: {}
            }
        };
        !function(namespace) {
            "use strict";
            namespace.ya.speechkit.AudioContext = window.AudioContext || window.webkitAudioContext;
            namespace.ya.speechkit.FORMAT = {
                PCM8: {
                    format: "pcm",
                    sampleRate: 8e3,
                    mime: "audio/x-pcm;bit=16;rate=8000",
                    bufferSize: 1024
                },
                PCM16: {
                    format: "pcm",
                    sampleRate: 16e3,
                    mime: "audio/x-pcm;bit=16;rate=16000",
                    bufferSize: 2048
                },
                PCM44: {
                    format: "pcm",
                    sampleRate: 44100,
                    mime: "audio/x-pcm;bit=16;rate=44100",
                    bufferSize: 4096
                }
            };
            namespace.ya.speechkit._stream = null;
            namespace.ya.speechkit._extend = function(to, from) {
                var i;
                var toStr = Object.prototype.toString;
                var astr = "[object Array]";
                to = to || {};
                for (i in from) if (from.hasOwnProperty(i)) if ("object" === typeof from[i]) {
                    to[i] = toStr.call(from[i]) === astr ? [] : {};
                    namespace.ya.speechkit._extend(to[i], from[i]);
                } else if ("undefined" !== typeof from[i] || "undefined" === typeof to[i]) to[i] = from[i];
                return to;
            };
            var Recorder = function() {
                if (!namespace.ya.speechkit._stream) return null;
                if (!(this instanceof Recorder)) return new Recorder();
                this.worker = namespace.ya.speechkit.newWorker();
                this.recording = false;
                this.paused = false;
                this.lastDataOnPause = 0;
                this.nullsArray = [];
                this.currCallback = null;
                this.buffCallback = null;
                this.startCallback = null;
                this.worker.onmessage = function(e) {
                    if ("int16stream" == e.data.command) {
                        var data = e.data.buffer;
                        if (this.startCallback) this.startCallback(data);
                    } else if ("getBuffers" == e.data.command && this.buffCallback) this.buffCallback(e.data.blob); else if ("clear" == e.data.command && this.currCallback) this.currCallback(); else if (this.currCallback) this.currCallback(e.data.blob);
                }.bind(this);
            };
            Recorder.prototype = {
                _createNode: function(format) {
                    if (!namespace.ya.speechkit.audiocontext) namespace.ya.speechkit.audiocontext = new namespace.ya.speechkit.AudioContext();
                    this.audioInput = namespace.ya.speechkit.audiocontext.createMediaStreamSource(namespace.ya.speechkit._stream);
                    if (!namespace.ya.speechkit.audiocontext.createScriptProcessor) this.node = namespace.ya.speechkit.audiocontext.createJavaScriptNode(format.bufferSize, 2, 2); else this.node = namespace.ya.speechkit.audiocontext.createScriptProcessor(format.bufferSize, 2, 2);
                    this.audioInput.connect(this.node);
                    this.node.onaudioprocess = function(e) {
                        if (!this.recording) return;
                        if (this.paused) {
                            if (Number(new Date()) - this.lastDataOnPause > 2e3) {
                                this.lastDataOnPause = Number(new Date());
                                this.worker.postMessage({
                                    command: "record",
                                    buffer: [ this.nullsArray, this.nullsArray ]
                                });
                            }
                        } else this.worker.postMessage({
                            command: "record",
                            buffer: [ e.inputBuffer.getChannelData(0), e.inputBuffer.getChannelData(1) ]
                        });
                    }.bind(this);
                    this.node.connect(namespace.ya.speechkit.audiocontext.destination);
                },
                pause: function() {
                    this.paused = true;
                    this.lastDataOnPause = Number(new Date());
                },
                getAudioContext: function() {
                    return namespace.ya.speechkit.audiocontext;
                },
                getAnalyserNode: function() {
                    if (!namespace.ya.speechkit.audiocontext) namespace.ya.speechkit.audiocontext = new namespace.ya.speechkit.AudioContext();
                    var analyserNode = namespace.ya.speechkit.audiocontext.createAnalyser();
                    analyserNode.fftSize = 2048;
                    this.audioInput.connect(analyserNode);
                    return analyserNode;
                },
                isPaused: function() {
                    return this.paused;
                },
                start: function(cb, format) {
                    var backref = this;
                    if (!namespace.ya.speechkit._stream) return namespace.ya.speechkit.initRecorder(function() {
                        backref.start(cb, format);
                    }, console.log);
                    if (!this.node) this._createNode(format);
                    if (this.isPaused()) {
                        this.paused = false;
                        return;
                    }
                    if ("undefined" !== typeof cb) this.startCallback = cb; else this.startCallback = null;
                    this.worker.postMessage({
                        command: "init",
                        config: {
                            sampleRate: namespace.ya.speechkit.audiocontext.sampleRate,
                            format: format || namespace.ya.speechkit.FORMAT.PCM16,
                            channels: this.channelCount
                        }
                    });
                    this.nullsArray = [];
                    var bufferLen = (format || namespace.ya.speechkit.FORMAT.PCM16).bufferSize;
                    for (var i = 0; i < bufferLen; i++) this.nullsArray.push(0);
                    this.clear(function() {
                        this.recording = true;
                    }.bind(this));
                },
                stop: function(cb, channelCount) {
                    this.recording = false;
                    if (this.node) this.node.disconnect();
                    this.node = null;
                    this.startCallback = null;
                    if (namespace.ya.speechkit._stream && namespace.ya.speechkit._stream.getAudioTracks) namespace.ya.speechkit._stream.getAudioTracks()[0].stop(); else if (namespace.ya.speechkit._stream && "undefined" !== typeof namespace.ya.speechkit._stream.stop) namespace.ya.speechkit._stream.stop();
                    namespace.ya.speechkit._stream = null;
                    if ("undefined" !== typeof namespace.ya.speechkit.audiocontext && null !== namespace.ya.speechkit.audiocontext && "undefined" !== typeof namespace.ya.speechkit.audiocontext.close) {
                        namespace.ya.speechkit.audiocontext.close();
                        namespace.ya.speechkit.audiocontext = null;
                    }
                    if ("undefined" !== typeof cb) this.exportWav(function(blob) {
                        cb(blob);
                    }, channelCount || 2);
                },
                isRecording: function() {
                    return this.recording;
                },
                clear: function(cb) {
                    if ("undefined" !== typeof cb) this.currCallback = cb; else this.currCallback = null;
                    this.worker.postMessage({
                        command: "clear"
                    });
                },
                getBuffers: function(cb) {
                    if ("undefined" !== typeof cb) this.buffCallback = cb; else this.buffCallback = null;
                    this.worker.postMessage({
                        command: "getBuffers"
                    });
                },
                exportWav: function(cb, channelCount) {
                    if ("undefined" !== typeof cb) this.currCallback = cb; else this.currCallback = null;
                    var type = "audio/wav";
                    if (!this.currCallback) throw new Error("Callback not set");
                    var exportCommand = "export" + (2 != channelCount && "Mono" || "") + "WAV";
                    this.worker.postMessage({
                        command: exportCommand,
                        type: type
                    });
                }
            };
            namespace.ya.speechkit.Recorder = Recorder;
            namespace.ya.speechkit.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.webkitGetUserMedia;
            namespace.ya.speechkit.mediaDevices = navigator.mediaDevices && navigator.mediaDevices.getUserMedia ? navigator.mediaDevices : namespace.ya.speechkit.getUserMedia ? {
                getUserMedia: function(c) {
                    return new Promise(function(y, n) {
                        namespace.ya.speechkit.getUserMedia.call(navigator, c, y, n);
                    });
                }
            } : null;
            namespace.ya.speechkit._stream = null;
            namespace.ya.speechkit.audiocontext = null;
            namespace.ya.speechkit.initRecorder = function(initSuccess, initFail) {
                var badInitialization = function(err) {
                    namespace.ya.speechkit._stream = null;
                    if ("undefined" !== typeof initFail) initFail(err);
                };
                if (namespace.ya.speechkit.mediaDevices) namespace.ya.speechkit.mediaDevices.getUserMedia({
                    audio: true
                }).then(function(stream) {
                    namespace.ya.speechkit._stream = stream;
                    if ("undefined" !== typeof initSuccess) initSuccess();
                }).catch(function(err) {
                    badInitialization(err.message || err.name || err);
                }); else badInitialization("Your browser doesn't support Web Audio API. " + "Please, use Yandex.Browser: https://browser.yandex.ru");
            };
            namespace.ya.speechkit.isLanguageSupported = function(lang) {
                if (namespace.ya.speechkit.settings.langWhitelist.indexOf(lang) >= 0) return namespace.ya.speechkit.isSupported(); else return namespace.ya.speechkit.isWebAudioSupported();
            };
            namespace.ya.speechkit.isSupported = function() {
                var userAgent = navigator.userAgent.toLowerCase();
                return null !== namespace.ya.speechkit.mediaDevices && (/mozilla|firefox/.test(userAgent) && !/yabrowser/.test(userAgent) || !/iphone|ipod|ipad|android|blackberry/.test(userAgent));
            };
            namespace.ya.speechkit.isWebAudioSupported = function() {
                var userAgent = navigator.userAgent.toLowerCase();
                var SpeechRecognition = namespace.SpeechRecognition || namespace.webkitSpeechRecognition;
                return "undefined" !== typeof SpeechRecognition && !/yabrowser|opera|opr/.test(userAgent);
            };
        }(speechkitNamespace);
        !function(namespace) {
            "use strict";
            function _makeWorker(script) {
                var URL = window.URL || window.webkitURL;
                var Blob = window.Blob;
                var Worker = window.Worker;
                if (!URL || !Blob || !Worker || !script) return null;
                var blob = new Blob([ script ], {
                    type: "application/javascript"
                });
                var worker = new Worker(URL.createObjectURL(blob));
                return worker;
            }
            var inline_worker = "function iirFilter (sampleRate, cutoff, resonance, type) {" + "" + "    var\tself\t= this," + "            f\t= [0.0, 0.0, 0.0, 0.0]," + "            freq, damp," + "            prevCut, prevReso," + "            sin\t= Math.sin," + "            min\t= Math.min," + "            pow\t= Math.pow;" + "    self.cutoff = cutoff || 20000;" + "    self.resonance = resonance || 0.1;" + "    self.samplerate = sampleRate || 44100;" + "    self.type = type || 0;" + "    function calcCoeff () {" + "            freq = 2 * sin(Math.PI * min(0.25, self.cutoff / (self.samplerate * 2)));" + "            damp = min(2 * (1 - pow(self.resonance, 0.25)), min(2, 2 / freq - freq * 0.5));" + "    }" + "    self.pushSample = function (sample) {" + "            if (prevCut !== self.cutoff || prevReso !== self.resonance){" + "                    calcCoeff();" + "                    prevCut = self.cutoff;" + "                    prevReso = self.resonance;" + "            }" + "            f[3] = sample - damp * f[2];" + "            f[0] = f[0] + freq * f[2];" + "            f[1] = f[3] - f[0];" + "            f[2] = freq * f[1] + f[2];" + "            f[3] = sample - damp * f[2];" + "            f[0] = f[0] + freq * f[2];" + "            f[1] = f[3] - f[0];" + "            f[2] = freq * f[1] + f[2];" + "            return f[self.type];" + "    };" + "    self.getMix = function (type) {" + "            return f[type || self.type];" + "    };" + "}" + "var speex_loaded = false;" + "var recLength = 0;" + "var recBuffersL = [];" + "var recBuffersR = [];" + "var sampleRate;" + "var outSampleRate;" + "var tmp_buf = 0;" + "var need_buf_size = 4096;" + "var speex_converter = null;" + "    " + "this.onmessage = function (e) {" + "    switch (e.data.command) {" + "    case 'init':" + "        init(e.data.config);" + "        break;" + "    case 'record':" + "        record(e.data.buffer);" + "        break;" + "    case 'exportWAV':" + "        exportWAV(e.data.type);" + "        break;" + "    case 'exportMonoWAV':" + "        exportMonoWAV(e.data.type);" + "        break;" + "    case 'getBuffers':" + "        getBuffers();" + "        break;" + "    case 'clear':" + "        clear();" + "        break;" + "    }" + "};" + "    " + "function init(config) {" + "    sampleRate = config.sampleRate;" + "    outSampleRate = config.format.sampleRate || sampleRate;" + "    need_buf_size = config.format.bufferSize || 4096;" + "    speex_converter = null;" + "    /*if (config.format.format == 'speex') {" + "        if (!speex_loaded) {" + "            importScripts('./speex.min.js');" + "            speex_loaded = true;" + "        }" + "        need_buf_size /= 16;" + "        speex_converter = new SpeexConverter(outSampleRate);" + "    }*/" + "}" + "var resample = function (inbuf) {" + "    var speed = 1.0 * sampleRate / outSampleRate;" + "    var l = Math.ceil(inbuf.length / speed);" + "    var result = new Float32Array(l);" + "    var bin = 0;" + "    var num = 0;" + "    var indexIn = 0;" + "    var indexOut = 0;" + "    for (indexOut = 1, indexIn = speed; indexOut < l - 1; indexIn += speed, indexOut++) {" + "        var pos = Math.floor(indexIn);" + "        var dt = indexIn - pos;" + "        var second = (pos + 1 < inbuf.length) ? pos + 1 : inbuf.length - 1; " + "        result[indexOut] = inbuf[pos] * (1 - dt) + inbuf[second] * dt;" + "    }" + "    result[0] = inbuf[0];" + "    result[l - 1] = inbuf[inbuf.length - 1];" + "    return result;" + "};" + "    " + "function record(inputBuffer) {" + "    if (outSampleRate == sampleRate) {" + "        recBuffersL.push(inputBuffer[0]);" + "        recBuffersR.push(inputBuffer[1]);" + "        recLength += inputBuffer[0].length;" + "    " + "        var samples = inputBuffer[0];" + "        var buffer = new ArrayBuffer(samples.length * 2);" + "        var view = new DataView(buffer);" + "        floatTo16BitPCM(view, 0, samples);" + "        this.postMessage({command: 'int16stream', buffer: buffer});" + "    } else {" + "        var filter0 = new iirFilter(outSampleRate, outSampleRate * 0.125, 0.0); " + "        var filter1 = new iirFilter(outSampleRate, outSampleRate * 0.125, 0.0); " + "        for (var i =0; i < inputBuffer[0].length; i++) { " + "            inputBuffer[0][i] = filter0.pushSample(inputBuffer[0][i]); " + "            inputBuffer[1][i] = filter1.pushSample(inputBuffer[1][i]); " + "        }" + "        var resin0 = resample(inputBuffer[0], outSampleRate, sampleRate);" + "        var resin1 = resample(inputBuffer[1], outSampleRate, sampleRate);" + "    " + "        recBuffersL.push(resin0);" + "        recBuffersR.push(resin1);" + "        recLength += resin0.length;" + "    " + "        var result = new Int16Array(resin0.length);" + "    " + "        for (var i = 0 ; i < resin0.length ; i++) {" + "            result[i] = Math.floor(Math.min(Math.max((resin0[i] + resin1[i]) * 0.5, -1.0), 1.0) * 16383);" + "        }" + "    " + "        if (speex_converter) {" + "            result = speex_converter.convert(result);" + "        } else {" + "            result = result.buffer;" + "        }" + "    " + "        if (!tmp_buf) {" + "            tmp_buf = result;" + "        } else {" + "            var tmp = new DataView(new ArrayBuffer(tmp_buf.byteLength + result.byteLength));" + "            tmp_buf = new DataView(tmp_buf);" + "            result = new DataView(result);" + "    " + "            for (i = 0; i < tmp_buf.byteLength; i++) {" + "                tmp.setUint8(i, tmp_buf.getUint8(i));" + "            }" + "    " + "            for (i = 0; i < result.byteLength; i++) {" + "                tmp.setUint8(i + tmp_buf.byteLength, result.getUint8(i));" + "            }" + "    " + "            tmp_buf = tmp.buffer;" + "        }" + "    " + "        if (tmp_buf.byteLength >= need_buf_size) {" + "            this.postMessage({command: 'int16stream', buffer: tmp_buf});" + "            tmp_buf = false;" + "        }" + "    }" + "}" + "    " + "function exportWAV(type) {" + "    var bufferL = mergeBuffers(recBuffersL, recLength);" + "    var bufferR = mergeBuffers(recBuffersR, recLength);" + "    var interleaved = interleave(bufferL, bufferR);" + "    var dataview = encodeWAV(interleaved);" + "    var audioBlob = new Blob([dataview], {type: type});" + "    " + "    this.postMessage({command: 'exportWAV', blob: audioBlob});" + "}" + "    " + "function exportMonoWAV(type) {" + "    var bufferL = mergeBuffers(recBuffersL, recLength);" + "    var dataview = encodeWAV(bufferL, true);" + "    var audioBlob = new Blob([dataview], {type: type});" + "    " + "    this.postMessage({command: 'exportMonoWAV', blob: audioBlob});" + "}" + "    " + "function getBuffers() {" + "    var buffers = [];" + "    buffers.push(mergeBuffers(recBuffersL, recLength));" + "    buffers.push(mergeBuffers(recBuffersR, recLength));" + "    this.postMessage({command: 'getBuffers', blob: buffers});" + "}" + "    " + "function clear() {" + "    recLength = 0;" + "    recBuffersL = [];" + "    recBuffersR = [];" + "    if (speex_converter) {" + "        speex_converter.clear();" + "    }" + "    this.postMessage({command: 'clear'});" + "}" + "    " + "function mergeBuffers(recBuffers, recLength) {" + "    var result = new Float32Array(recLength);" + "    var offset = 0;" + "    for (var i = 0; i < recBuffers.length; i++){" + "        result.set(recBuffers[i], offset);" + "        offset += recBuffers[i].length;" + "    }" + "    return result;" + "}" + "    " + "function interleave(inputL, inputR) {" + "    var length = inputL.length + inputR.length;" + "    var result = new Float32Array(length);" + "    " + "    var index = 0;" + "    var inputIndex = 0;" + "    " + "    while (index < length){" + "        result[index++] = inputL[inputIndex];" + "        result[index++] = inputR[inputIndex];" + "        inputIndex++;" + "    }" + "    return result;" + "}" + "    " + "function floatTo16BitPCM(output, offset, input) {" + "    for (var i = 0; i < input.length; i++, offset += 2){" + "        var s = Math.max(-1, Math.min(1, input[i]));" + "        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);" + "    }" + "}" + "    " + "function writeString(view, offset, string) {" + "    for (var i = 0; i < string.length; i++){" + "        view.setUint8(offset + i, string.charCodeAt(i));" + "    }" + "}" + "    " + "function encodeWAV(samples, mono) {" + "    var buffer = new ArrayBuffer(44 + samples.length * 2);" + "    var view = new DataView(buffer);" + "    " + "    /* RIFF identifier */" + "    writeString(view, 0, 'RIFF');" + "    /* file length */" + "    view.setUint32(4, 32 + samples.length * 2, true);" + "    /* RIFF type */" + "    writeString(view, 8, 'WAVE');" + "    /* format chunk identifier */" + "    writeString(view, 12, 'fmt ');" + "    /* format chunk length */" + "    view.setUint32(16, 16, true);" + "    /* sample format (raw) */" + "    view.setUint16(20, 1, true);" + "    /* channel count */" + "    view.setUint16(22, mono ? 1 : 2, true);" + "    /* sample rate */" + "    view.setUint32(24, outSampleRate, true);" + "    /* block align (channel count * bytes per sample) */" + "    var block_align = mono ? 2 : 4;" + "    /* byte rate (sample rate * block align) */" + "    view.setUint32(28, outSampleRate * block_align, true);" + "    /* block align (channel count * bytes per sample) */" + "    view.setUint16(32, block_align, true);" + "    /* bits per sample */" + "    view.setUint16(34, 16, true);" + "    /* data chunk identifier */" + "    writeString(view, 36, 'data');" + "    /* data chunk length */" + "    view.setUint32(40, samples.length * 2, true);" + "    " + "    floatTo16BitPCM(view, 44, samples);" + "    " + "    return view;" + "}" + " ";
            namespace.ya.speechkit.newWorker = function() {
                return _makeWorker(inline_worker);
            };
        }(speechkitNamespace);
        !function(namespace) {
            "use strict";
            var SOCKET_CLOSED_ABNORMALLY = 1e3;
            var ERROR_MESSAGE_WAS_RECEIVED = 1001;
            var SOCKET_CLOSED_WITH_ERROR = 1002;
            var CANT_CREATE_SOCKET = 1003;
            var Recognizer = function(options) {
                if (!(this instanceof namespace.ya.speechkit.Recognizer)) return new namespace.ya.speechkit.Recognizer(options);
                this.options = namespace.ya.speechkit._extend({
                    apikey: namespace.ya.speechkit.settings.apikey,
                    uuid: namespace.ya.speechkit.settings.uuid,
                    applicationName: namespace.ya.speechkit.settings.applicationName,
                    url: namespace.ya.speechkit.settings.websocketProtocol + namespace.ya.speechkit.settings.asrUrl,
                    onInit: function() {},
                    onResult: function() {},
                    onError: function() {},
                    punctuation: true,
                    allowStrongLanguage: false
                }, options);
                this.options.key = this.options.apikey;
                this.options.format = this.options.format.mime;
                this.sessionId = null;
                this.socket = null;
                this.closed = false;
                this.buffered = [];
                this.totaldata = 0;
            };
            Recognizer.prototype = {
                _sendRaw: function(data) {
                    if (this.socket && this.socket.readyState === WebSocket.OPEN) try {
                        this.socket.send(data);
                    } catch (e) {
                        this.options.onError("Can't send data", SOCKET_CLOSED_ABNORMALLY);
                        this.close();
                    } else console.warn("Attempting to send message while socket is not open");
                },
                _sendJson: function(json) {
                    this._sendRaw(JSON.stringify({
                        type: "message",
                        data: json
                    }));
                },
                start: function() {
                    this.sessionId = null;
                    try {
                        this.socket = new WebSocket(this.options.url);
                    } catch (e) {
                        this.options.onError("Error on socket creation: " + e, CANT_CREATE_SOCKET);
                        this.options.stopCallback();
                        return;
                    }
                    this.socket.onopen = function() {
                        this._sendJson(this.options);
                    }.bind(this);
                    this.socket.onmessage = function(e) {
                        var message = JSON.parse(e.data);
                        if ("InitResponse" == message.type) {
                            this.sessionId = message.data.sessionId;
                            this.options.onInit(message.data.sessionId, message.data.code);
                        } else if ("AddDataResponse" == message.type) {
                            this.options.onResult(message.data.text, message.data.uttr, message.data.merge, message.data.words);
                            if ("undefined" !== typeof message.data.close && message.data.close) this.close();
                        } else if ("Error" == message.type) {
                            this.options.onError("Session " + this.sessionId + ": " + message.data, ERROR_MESSAGE_WAS_RECEIVED);
                            this.close();
                        } else {
                            this.options.onError("Session " + this.sessionId + ": " + message, ERROR_MESSAGE_WAS_RECEIVED);
                            this.close();
                        }
                    }.bind(this);
                    this.socket.onerror = function(error) {
                        this.options.onError("Socket error: " + error.message, SOCKET_CLOSED_WITH_ERROR);
                        this.close();
                    }.bind(this);
                    this.socket.onclose = function(event) {
                        if (!event.wasClean) {
                            this.options.onError("Socket closed abnormally", SOCKET_CLOSED_ABNORMALLY);
                            this.close();
                        }
                    }.bind(this);
                },
                addData: function(data) {
                    this.totaldata += data.byteLength;
                    if (!this.sessionId) {
                        this.buffered.push(data);
                        return;
                    }
                    for (var i = 0; i < this.buffered.length; i++) {
                        this._sendRaw(new Blob([ this.buffered[i] ], {
                            type: this.options.format
                        }));
                        this.totaldata += this.buffered[i].byteLength;
                    }
                    this.buffered = [];
                    this._sendRaw(new Blob([ data ], {
                        type: this.options.format
                    }));
                },
                finish: function() {
                    this._sendJson({
                        command: "finish"
                    });
                },
                close: function() {
                    if (this.closed) return;
                    this.closed = true;
                    this.options.onInit = function() {};
                    this.options.onResult = function() {};
                    this.options.onError = function() {};
                    if (this.isSocketAlive()) this.socket.close();
                    this.socket = null;
                    this.options.stopCallback();
                },
                isSocketAlive: function() {
                    if (!this.socket) return false;
                    var readyState = this.socket.readyState;
                    return readyState === WebSocket.OPEN || readyState === WebSocket.CONNECTING;
                }
            };
            namespace.ya.speechkit.Recognizer = Recognizer;
        }(speechkitNamespace);
        !function(namespace) {
            "use strict";
            function noop() {}
            namespace.ya.speechkit._defaultOptions = function() {
                return {
                    initCallback: noop,
                    errorCallback: noop,
                    dataCallback: noop,
                    infoCallback: noop,
                    stopCallback: noop,
                    punctuation: false,
                    allowStrongLanguage: false,
                    model: namespace.ya.speechkit.settings.model,
                    applicationName: namespace.ya.speechkit.settings.applicationName,
                    lang: namespace.ya.speechkit.settings.lang,
                    format: namespace.ya.speechkit.FORMAT.PCM16,
                    url: namespace.ya.speechkit.settings.websocketProtocol + namespace.ya.speechkit.settings.asrUrl,
                    vad: false,
                    speechStart: noop,
                    speechEnd: noop
                };
            };
            var SpeechRecognition = function() {
                if (!(this instanceof namespace.ya.speechkit.SpeechRecognition)) return new namespace.ya.speechkit.SpeechRecognition();
                this.send = 0;
                this.send_bytes = 0;
                this.proc = 0;
                this.recorder = null;
                this.recognizer = null;
                this.vad = null;
            };
            SpeechRecognition.prototype = {
                start: function(options) {
                    this.options = namespace.ya.speechkit._extend(namespace.ya.speechkit._extend({}, namespace.ya.speechkit._defaultOptions()), options);
                    if (namespace.ya.speechkit.settings.langWhitelist.indexOf(this.options.lang) >= 0) if (null !== namespace.ya.speechkit._stream) this._onstart(); else namespace.ya.speechkit.initRecorder(this._onstart.bind(this), this.options.errorCallback); else {
                        var old_error_callback = this.options.errorCallback;
                        this.recorder = namespace.ya.speechkit.WebAudioRecognition(namespace.ya.speechkit._extend(this.options, {
                            errorCallback: function(e) {
                                this.recorder = null;
                                old_error_callback(e);
                            }.bind(this)
                        }));
                        this.recorder.start();
                    }
                },
                _onstart: function() {
                    if (this.recorder && this.recorder.isPaused()) this.recorder.start();
                    if (this.recognizer) return;
                    this.send = 0;
                    this.send_bytes = 0;
                    this.proc = 0;
                    if (!this.recorder) {
                        this.recorder = new namespace.ya.speechkit.Recorder();
                        if (this.options.vad) this.vad = new namespace.ya.speechkit.Vad({
                            recorder: this.recorder,
                            speechStart: this.options.speechStart,
                            speechEnd: this.options.speechEnd
                        });
                    }
                    this.recognizer = new namespace.ya.speechkit.Recognizer(namespace.ya.speechkit._extend(this.options, {
                        onInit: function(sessionId, code) {
                            if (!this.recorder) return;
                            this.recorder.start(function(data) {
                                if (this.options.vad && this.vad) this.vad.update();
                                this.send++;
                                this.send_bytes += data.byteLength;
                                this.options.infoCallback({
                                    send_bytes: this.send_bytes,
                                    format: this.options.format,
                                    send_packages: this.send,
                                    processed: this.proc
                                });
                                this.recognizer.addData(data);
                            }.bind(this), this.options.format);
                            this.options.initCallback(sessionId, code, "yandex");
                        }.bind(this),
                        onResult: function(text, uttr, merge, words) {
                            this.proc += merge;
                            this.options.infoCallback({
                                send_bytes: this.send_bytes,
                                format: this.options.format,
                                send_packages: this.send,
                                processed: this.proc
                            });
                            this.options.dataCallback(text, uttr, merge, words);
                        }.bind(this),
                        onError: function(msg, code) {
                            if (this.recorder) this.recorder.stop(function() {
                                this.recorder = null;
                            }.bind(this));
                            if (this.recognizer) {
                                this.recognizer.close();
                                this.recognizer = null;
                            }
                            this.options.errorCallback(msg, code);
                        }.bind(this)
                    }));
                    this.recognizer.start();
                },
                stop: function() {
                    this.options.initCallback = noop;
                    this.options.dataCallback = noop;
                    this.options.errorCallback = noop;
                    if (this.recognizer) this.recognizer.finish();
                    if (this.recorder) this.recorder.stop(function() {
                        this.recognizer = null;
                        this.recorder = null;
                    }.bind(this));
                },
                abort: function() {
                    this.options.initCallback = noop;
                    this.options.dataCallback = noop;
                    this.options.errorCallback = noop;
                    if (this.recognizer) this.recognizer.close();
                    if (this.recorder) this.recorder.stop(function() {
                        this.recognizer = null;
                        this.recorder = null;
                    }.bind(this));
                },
                pause: function() {
                    if (this.recorder) this.recorder.pause();
                },
                isPaused: function() {
                    return !this.recorder || this.recorder.isPaused();
                }
            };
            namespace.ya.speechkit.SpeechRecognition = SpeechRecognition;
            namespace.ya.speechkit.recognize = function(options) {
                var dict = new namespace.ya.speechkit.SpeechRecognition();
                var opts = namespace.ya.speechkit._extend(namespace.ya.speechkit._extend({}, namespace.ya.speechkit._defaultOptions()), options);
                opts.doneCallback = options.doneCallback;
                opts.dataCallback = function(text, uttr, merge) {
                    if (uttr) {
                        if (opts.doneCallback) opts.doneCallback(text);
                        dict.stop();
                    }
                };
                opts.stopCallback = function() {
                    dict = null;
                };
                dict.start(opts);
            };
        }(speechkitNamespace);
        !function(namespace) {
            "use strict";
            var speakersCache = null;
            namespace.ya.speechkit.play = function(url, cb) {
                var audio = new Audio(url);
                audio.volume = 1;
                audio.onended = cb || function() {};
                audio.play();
            };
            var Tts = function(options) {
                if (!(this instanceof namespace.ya.speechkit.Tts)) return new namespace.ya.speechkit.Tts(options);
                this.options = namespace.ya.speechkit._extend({
                    apikey: namespace.ya.speechkit.settings.apikey,
                    uuid: namespace.ya.speechkit.settings.uuid,
                    url: namespace.ya.speechkit.settings.websocketProtocol + namespace.ya.speechkit.settings.ttsStreamUrl,
                    infoCallback: function() {},
                    errorCallback: function(msg) {
                        console.log(msg);
                    }
                }, options);
                this.sessionId = null;
                this.socket = null;
                this.buffered = [];
            };
            Tts.prototype = {
                _sendRaw: function(data) {
                    if (this.socket && this.socket.readyState === WebSocket.OPEN) this.socket.send(data); else console.warn("Attempting to send message while socket is not open");
                },
                _sendJson: function(json) {
                    this._sendRaw(JSON.stringify({
                        type: "message",
                        data: json
                    }));
                },
                say: function(text, cb, options) {
                    this.speak(text, namespace.ya.speechkit._extend(this.options, namespace.ya.speechkit._extend({
                        dataCallback: function(blob) {
                            var url = URL.createObjectURL(blob);
                            namespace.ya.speechkit.play(url, cb);
                        }
                    }, options)));
                },
                speak: function(text, options) {
                    var opts = namespace.ya.speechkit._extend(namespace.ya.speechkit._extend({
                        text: text
                    }, this.options), options);
                    try {
                        this.socket = new WebSocket(opts.url);
                    } catch (e) {
                        opts.errorCallback("Error on socket creation: " + e);
                        return;
                    }
                    var context = namespace.ya.speechkit.audiocontext || new namespace.ya.speechkit.AudioContext();
                    namespace.ya.speechkit.audiocontext = context;
                    this.socket.onopen = function() {
                        this._sendJson(opts);
                    }.bind(this);
                    var play_queue = [];
                    this.socket.binaryType = "arraybuffer";
                    this.socket.onmessage = function(e) {
                        var message = {};
                        if (e.data && "{" == e.data[0]) try {
                            message = JSON.parse(e.data);
                        } catch (ex) {
                            message = {
                                type: "Audio",
                                data: e.data
                            };
                        } else message = {
                            type: "Audio",
                            data: e.data
                        };
                        if ("InitResponse" == message.type) this.sessionId = message.data.sessionId; else if ("Error" == message.type) {
                            opts.errorCallback("Session " + this.sessionId + ": " + message.data);
                            this.socket.onclose = function() {};
                            this.socket.close();
                        } else if ("Phonemes" == message.type) opts.infoCallback(message.data); else if ("Audio" == message.type) play_queue.push(message.data); else {
                            opts.errorCallback("Session " + this.sessionId + ": " + message);
                            this.socket.onclose = function() {};
                            this.socket.close();
                        }
                    }.bind(this);
                    this.socket.onerror = function(error) {
                        opts.errorCallback("Socket error: " + error.message);
                    }.bind(this);
                    this.socket.onclose = function(event) {
                        var res = Array.prototype.concat.apply([], play_queue);
                        var blob = new Blob(res, {
                            type: "audio/x-wav"
                        });
                        if ("undefined" !== typeof opts.dataCallback) opts.dataCallback(blob); else {
                            var url = URL.createObjectURL(blob);
                            namespace.ya.speechkit.play(url, opts.stopCallback);
                        }
                    }.bind(this);
                },
                speakers: function(lang) {
                    return new Promise(function(resolve, reject) {
                        if (speakersCache) resolve(speakersCache); else {
                            var xhr = new XMLHttpRequest();
                            xhr.open("GET", this.options.url.replace("wss://", "https://").replace("ws://", "http://").replace("ttssocket.ws", "speakers?engine=ytcp&lang=" + (lang || "")));
                            xhr.onreadystatechange = function() {
                                if (4 == this.readyState) if (200 == this.status) try {
                                    speakersCache = JSON.parse(this.responseText);
                                    resolve(speakersCache);
                                } catch (ex) {
                                    reject(ex.message);
                                } else reject("Can't get speakers list!");
                            };
                            xhr.send();
                        }
                    }.bind(this));
                }
            };
            namespace.ya.speechkit.Tts = Tts;
        }(speechkitNamespace);
        !function(namespace) {
            "use strict";
            var WebAudioRecognition = function(options) {
                if (!(this instanceof namespace.ya.speechkit.WebAudioRecognition)) return new namespace.ya.speechkit.WebAudioRecognition(options);
                this.recognition = null;
                this.recorder = null;
                this.options = namespace.ya.speechkit._extend(namespace.ya.speechkit._extend(namespace.ya.speechkit._defaultOptions(), options), {
                    format: namespace.ya.speechkit.FORMAT.PCM44
                });
            };
            WebAudioRecognition.prototype = {
                _onstart: function() {
                    this.send = 0;
                    this.send_bytes = 0;
                    this.recognition = namespace.ya.speechkit._extend(this.recognition, {
                        interim_transcript: "",
                        lang: this.options.lang,
                        onend: this.stop.bind(this),
                        onresult: function(event) {
                            this.interim_transcript = "";
                            var arr = [];
                            for (var i = event.resultIndex; i < event.results.length; ++i) if (event.results[i].isFinal) {
                                arr.push({
                                    0: {
                                        transcript: event.results[i][0].transcript,
                                        confidence: event.results[i][0].confidence
                                    }
                                });
                                this.backref.options.dataCallback(event.results[i][0].transcript, true, 1);
                                this.interim_transcript = "";
                            } else this.interim_transcript += event.results[i][0].transcript;
                            if (arr.length) this.backref.recognizer._sendJson(arr);
                            this.backref.options.dataCallback(this.interim_transcript, false, 1);
                        },
                        continuous: true,
                        interimResults: true,
                        maxAlternatives: 5,
                        errorCallback: this.options.errorCallback,
                        onerror: function(e) {
                            this.errorCallback(e.error);
                        }
                    });
                    this.recognition.backref = this;
                    this.recorder = new namespace.ya.speechkit.Recorder();
                    this.recognizer = new namespace.ya.speechkit.Recognizer(namespace.ya.speechkit._extend(this.options, {
                        url: this.options.url.replace("asrsocket.ws", "logsocket.ws"),
                        samplerate: this.options.format.sampleRate,
                        onInit: function(sessionId, code) {
                            this.recorder.start(function(data) {
                                if (this.options.vad && this.vad) this.vad.update();
                                this.send++;
                                this.send_bytes += data.byteLength;
                                this.options.infoCallback({
                                    send_bytes: this.send_bytes,
                                    format: this.options.format,
                                    send_packages: this.send,
                                    processed: this.proc
                                });
                                this.recognizer.addData(data);
                            }.bind(this), this.options.format);
                            this.recognition.onstart = this.options.initCallback.bind(this, sessionId, code, "native");
                            this.recognition.start();
                        }.bind(this),
                        onResult: function() {},
                        onError: function(msg) {
                            this.recorder.stop(function() {});
                            this.recognizer.close();
                            this.recognizer = null;
                            this.options.errorCallback(msg);
                        }.bind(this)
                    }));
                    this.recognizer.start();
                },
                start: function() {
                    if ("undefined" !== typeof namespace.webkitSpeechRecognition) {
                        this.recognition = new namespace.webkitSpeechRecognition();
                        if (null !== namespace.ya.speechkit._stream) this._onstart(); else namespace.ya.speechkit.initRecorder(this._onstart.bind(this), this.options.errorCallback);
                    } else this.options.errorCallback("Your browser doesn't implement Web Speech API");
                },
                stop: function(cb) {
                    if (this.recognition) {
                        this.recognition.onend = function() {};
                        this.recognition.stop();
                    }
                    if (this.recorder) this.recorder.stop();
                    if (this.recognizer) this.recognizer.close();
                    this.options.stopCallback();
                    if ("undefined" !== typeof cb) if ("[object Function]" == Object.prototype.toString.call(cb)) cb();
                },
                pause: function() {},
                isPaused: function() {
                    return false;
                },
                getAnalyserNode: function() {
                    if (this.recorder) return this.recorder.getAnalyserNode();
                }
            };
            namespace.ya.speechkit.WebAudioRecognition = WebAudioRecognition;
        }(speechkitNamespace);
        !function(namespace) {
            "use strict";
            namespace.ya.speechkit.SpeakerId = function() {
                if (!(this instanceof namespace.ya.speechkit.SpeakerId)) return new namespace.ya.speechkit.SpeakerId();
                if (!namespace.ya.speechkit._recorderInited) namespace.ya.speechkit.initRecorder(this.onInited.bind(this), function(error) {
                    alert("Failed to init recorder: " + error);
                });
            };
            namespace.ya.speechkit.SpeakerId.prototype = {
                onInited: function() {
                    this.recorder = new namespace.ya.speechkit.Recorder();
                },
                startRecord: function() {
                    console.log("Start recording...");
                    this.recorder.start(function(data) {
                        console.log("Recorder callback, recorded data length: " + data.byteLength);
                    }, namespace.ya.speechkit.FORMAT.PCM8);
                },
                completeRecordAndRegister: function(userid, keepPrev, text, onRegister) {
                    console.log("completeRecordAndRegister");
                    this.recorder.stop(function(wav) {
                        console.log("Wav is ready:");
                        console.log(wav);
                        var fd = new FormData();
                        fd.append("name", userid);
                        fd.append("text", text);
                        fd.append("audio", wav);
                        fd.append("keepPrev", keepPrev ? "true" : "false");
                        var xhr = new XMLHttpRequest();
                        xhr.open("POST", namespace.ya.speechkit.settings.voicelabUrl + "register_voice");
                        xhr.onreadystatechange = function() {
                            if (4 == this.readyState) if (200 == this.status) {
                                console.log(this.responseText);
                                onRegister(this.responseText);
                            } else onRegister("Failed to register data, could not access " + namespace.ya.speechkit.settings.voicelabUrl + " Check out developer tools -> console for more details.");
                        };
                        xhr.send(fd);
                    });
                },
                completeRecordAndIdentify: function(onFoundUser) {
                    console.log("Indentify");
                    this.recorder.stop(function(wav) {
                        console.log("Wav is ready:");
                        console.log(wav);
                        var fd = new FormData();
                        fd.append("audio", wav);
                        var xhr = new XMLHttpRequest();
                        xhr.open("POST", namespace.ya.speechkit.settings.voicelabUrl + "detect_voice");
                        xhr.onreadystatechange = function() {
                            if (4 == this.readyState) if (200 == this.status) {
                                console.log(this.responseText);
                                var data = {};
                                try {
                                    data = JSON.parse(this.responseText);
                                } catch (e) {
                                    onFoundUser(false, "Failed to find user, internal server error: " + e);
                                    return;
                                }
                                onFoundUser(true, data);
                            } else onFoundUser(false, "Failed to find user, could not access " + namespace.ya.speechkit.settings.voicelabUrl + " Check out developer tools -> console for more details.");
                        };
                        xhr.send(fd);
                    }, 1);
                },
                feedback: function(requestId, feedback) {
                    console.log("Post feedback");
                    var fd = new FormData();
                    fd.append("requestId", requestId);
                    fd.append("feedback", feedback);
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", namespace.ya.speechkit.settings.voicelabUrl + "postFeedback");
                    xhr.onreadystatechange = function() {
                        if (4 == this.readyState) console.log(this.responseText);
                    };
                    xhr.send(fd);
                }
            };
        }(speechkitNamespace);
        !function(namespace) {
            "use strict";
            namespace.ya.speechkit.Equalizer = function(target, recorder) {
                this.recorder = recorder;
                this.element = document.getElementById(target);
                this.element.style.textAlign = "center";
                this.element.innerText = "";
                this.graf = document.createElement("canvas");
                this.graf.style.width = "100%";
                this.graf.style.height = "100%";
                this.graf.width = 1e3;
                this.element.appendChild(this.graf);
                if (!navigator.cancelAnimationFrame) navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
                if (!navigator.requestAnimationFrame) navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;
                this.refID = null;
                this.startDrawRealtime();
            };
            namespace.ya.speechkit.Equalizer.prototype = {
                destroy: function() {
                    this.stopDrawRealtime();
                    this.element.removeChild(this.graf);
                },
                stopDrawRealtime: function() {
                    window.cancelAnimationFrame(this.rafID);
                    this.rafID = null;
                },
                startDrawRealtime: function() {
                    var _this = this;
                    function updateAnalysers(time) {
                        if (!_this.analyserNode) if (_this.recorder) {
                            _this.analyserNode = _this.recorder.getAnalyserNode();
                            _this.context = _this.recorder.context;
                        } else return;
                        var canvasWidth = _this.graf.width;
                        var canvasHeight = _this.graf.height;
                        var analyserContext = _this.graf.getContext("2d");
                        var SPACING = 2;
                        var BAR_WIDTH = 1;
                        var numBars = Math.round(canvasWidth / SPACING);
                        var freqByteData = new Uint8Array(_this.analyserNode.frequencyBinCount);
                        _this.analyserNode.getByteFrequencyData(freqByteData);
                        analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);
                        analyserContext.fillStyle = "#F6D565";
                        analyserContext.lineCap = "round";
                        var multiplier = _this.analyserNode.frequencyBinCount / numBars;
                        for (var i = 0; i < numBars; ++i) {
                            var magnitude = 0;
                            var offset = Math.floor(i * multiplier);
                            for (var j = 0; j < multiplier; j++) magnitude += freqByteData[offset + j];
                            magnitude = magnitude / multiplier / 2;
                            analyserContext.fillStyle = "hsl( " + Math.round(60 * i / numBars) + ", 100%, 50%)";
                            analyserContext.fillRect(i * SPACING, canvasHeight, BAR_WIDTH, -magnitude);
                        }
                        _this.rafID = window.requestAnimationFrame(updateAnalysers);
                    }
                    this.rafID = window.requestAnimationFrame(updateAnalysers);
                }
            };
        }(speechkitNamespace);
        !function(namespace) {
            "use strict";
            namespace.ya.speechkit._mic_on = '<svg version="1.1" id="Layer_1" ' + ' xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"' + ' xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ' + ' x="0px" y="0px" viewBox="0 0 112 112"' + ' enable-background="new 0 0 112 112" xml:space="preserve">' + ' <g id="tuts" sketch:type="MSPage">' + ' <g id="mic_ff" sketch:type="MSLayerGroup">' + ' <g sketch:type="MSShapeGroup">' + ' <circle id="path-1" fill="rgb(255, 204, 0)" cx="56" cy="56" r="56"/>' + " </g>" + ' <g id="speechkit_vector-9" transform="translate(39.000000, 32.000000)" ' + ' sketch:type="MSShapeGroup" opacity="0.9">' + ' <path id="Shape" d="M17,4c2.8,0,5,2.3,5,5.2v15.6c0,2.9-2.2,5.2-5,5.2s-5-2.3-5-5.2V9.2C12,6.3,14.2,4,17,4 M17,0' + ' c-5,0-9,4.1-9,9.2v15.6c0,5.1,4,9.2,9,9.2s9-4.1,9-9.2V9.2C26,4.1,22,0,17,0L17,0z"/>' + ' <path id="Shape_1_" ' + ' d="M34,23v1.1C34,34,26.4,42,17,42S0,34,0,24.1V23h4v0.1C4,31.3,9.8,38,17,38s13-6.7,13-14.9V23H34z"/>' + ' <rect id="Rectangle-311" x="15" y="41" width="4" height="10"/>' + " </g>" + " </g>" + " </g>" + " </svg>";
            namespace.ya.speechkit._mic_off = '<svg version="1.1" id="Layer_1" ' + ' xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"' + ' xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ' + ' x="0px" y="0px" viewBox="0 0 112 112"' + ' enable-background="new 0 0 112 112" xml:space="preserve">' + ' <g id="tuts" sketch:type="MSPage">' + ' <g id="mic_ff" sketch:type="MSLayerGroup">' + ' <g id="speechkit_vector-9" transform="translate(39.000000, 32.000000)" ' + ' sketch:type="MSShapeGroup" opacity="0.9">' + ' <path id="Shape" d="M17,4c2.8,0,5,2.3,5,5.2v15.6c0,2.9-2.2,5.2-5,5.2s-5-2.3-5-5.2V9.2C12,6.3,14.2,4,17,4 M17,0' + ' c-5,0-9,4.1-9,9.2v15.6c0,5.1,4,9.2,9,9.2s9-4.1,9-9.2V9.2C26,4.1,22,0,17,0L17,0z"/>' + ' <path id="Shape_1_" ' + ' d="M34,23v1.1C34,34,26.4,42,17,42S0,34,0,24.1V23h4v0.1C4,31.3,9.8,38,17,38s13-6.7,13-14.9V23H34z"/>' + ' <rect id="Rectangle-311" x="15" y="41" width="4" height="10"/>' + " </g>" + " </g>" + " </g>" + " </svg>";
            namespace.ya.speechkit.Textline = function(target, options) {
                if (!(this instanceof namespace.ya.speechkit.Textline)) return new namespace.ya.speechkit.Textline(target, options);
                var el = document.getElementById(target);
                if ("INPUT" != el.tagName) {
                    this.element = el;
                    this.textinput = document.createElement("input");
                    this.textinput.style.height = "100%";
                    this.textinput.style.width = "100%";
                } else {
                    this.textinput = el;
                    this.element = null;
                }
                this.textinput.style.backgroundImage = "url('data:image/svg+xml;utf8," + namespace.ya.speechkit._mic_off + "')";
                this.textinput.style.backgroundRepeat = "no-repeat";
                this.textinput.style.backgroundPosition = "right center";
                if (this.element) this.element.appendChild(this.textinput);
                this.dict = null;
                this.final_result = "";
                var _this = this;
                this.textinput.onmousemove = function(event) {
                    var rect = _this.textinput.getBoundingClientRect();
                    if (event.clientX - rect.x > rect.width - rect.height) _this.textinput.style.cursor = "pointer"; else _this.textinput.style.cursor = "text";
                };
                options = options || {};
                options.dataCallback = function(text, uttr, merge) {
                    _this.textinput.value = text;
                    if (uttr) {
                        if (options.onInputFinished) {
                            _this.final_result = text;
                            options.onInputFinished(text);
                        }
                        _this.dict.abort();
                    }
                };
                options.initCallback = function() {
                    _this.textinput.style.backgroundImage = "url('data:image/svg+xml;utf8," + ya.speechkit._mic_on + "')";
                };
                options.stopCallback = function() {
                    _this.textinput.style.backgroundImage = "url('data:image/svg+xml;utf8," + ya.speechkit._mic_off + "')";
                    _this.dict = null;
                };
                this.textinput.onmousedown = function(event) {
                    var rect = _this.textinput.getBoundingClientRect();
                    if (event.clientX <= rect.width - rect.height) return;
                    if (!_this.dict) _this.dict = new ya.speechkit.SpeechRecognition();
                    if (_this.dict.isPaused()) _this.dict.start(options); else _this.dict.stop();
                };
                return {
                    destroy: function() {
                        if (_this.dict) _this.dict.stop();
                        _this.textinput.style.backgroundImage = "";
                        _this.textinput.onmousedown = function() {};
                        _this.textinput.onmousemove = function() {};
                        if (_this.element) _this.element.removeChild(_this.textinput);
                    },
                    value: function() {
                        return _this.final_result;
                    }
                };
            };
        }(speechkitNamespace);
        !function(namespace) {
            "use strict";
            if ("undefined" === typeof namespace.ya) namespace.ya = {};
            if ("undefined" === typeof namespace.ya.speechkit) namespace.ya.speechkit = {};
            var settings = {
                websocketProtocol: "wss://",
                asrUrl: "webasr.yandex.net/asrsocket.ws",
                ttsUrl: "https://tts.voicetech.yandex.net",
                ttsStreamUrl: "webasr.yandex.net/ttssocket.ws",
                lang: "ru-RU",
                langWhitelist: [ "ru-RU", "tr-TR", "en-US", "en-GB", "uk-UA", "ru", "tr", "en", "uk", "en-EN" ],
                model: "notes",
                applicationName: "jsapi",
                apikey: "",
                uuid: "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
                    var r = 16 * Math.random() | 0;
                    var v = "x" == c ? r : 3 & r | 8;
                    return v.toString(16);
                })
            };
            if ("undefined" === typeof namespace.ya.speechkit._extend) namespace.ya.speechkit.settings = settings; else namespace.ya.speechkit.settings = namespace.ya.speechkit._extend(settings, namespace.ya.speechkit.settings);
        }(speechkitNamespace);
        module.exports = speechkitNamespace;
    },
    513: function(module, exports, __webpack_require__) {
        "use strict";
        var _createClass = function() {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }
        var xml = __webpack_require__(61);
        var events = __webpack_require__(69);
        var XMLHandler = function() {
            function XMLHandler() {
                _classCallCheck(this, XMLHandler);
            }
            _createClass(XMLHandler, [ {
                key: "_toXML",
                value: function(string) {
                    return xml.fromStringOriginal(string);
                }
            }, {
                key: "_getAttr",
                value: function(_ref) {
                    var xmlString = _ref.xmlString, selector = _ref.selector, attr = _ref.attr, sendResponse = _ref.sendResponse;
                    if ("string" === typeof xmlString) {
                        var xmlDoc = this._toXML(xmlString);
                        sendResponse({
                            attr: xml.getAttrOriginal(xmlDoc, selector, attr)
                        });
                    } else {
                        var errObj = {
                            message: "No serialized xml found."
                        };
                        sendResponse({
                            errObj: errObj
                        });
                    }
                }
            }, {
                key: "_getText",
                value: function(_ref2) {
                    var xmlString = _ref2.xmlString, selector = _ref2.selector, sendResponse = _ref2.sendResponse;
                    if ("string" === typeof xmlString) {
                        var xmlDoc = this._toXML(xmlString);
                        sendResponse({
                            text: xml.getTextOriginal(xmlDoc, selector)
                        });
                    } else {
                        var errObj = {
                            message: "No serialized xml found."
                        };
                        sendResponse({
                            errObj: errObj
                        });
                    }
                }
            }, {
                key: "_selectAll",
                value: function(_ref3) {
                    var selector = _ref3.selector, parent = _ref3.parent, sendResponse = _ref3.sendResponse;
                    if ("string" === typeof parent) {
                        var xmlDoc = this._toXML(parent);
                        sendResponse({
                            selection: xml.selectAllOriginal(selector, xmlDoc)
                        });
                    } else {
                        var errObj = {
                            message: "No serialized xml found."
                        };
                        sendResponse({
                            errObj: errObj
                        });
                    }
                }
            }, {
                key: "handle",
                value: function(req, _sender) {
                    switch (req.type) {
                      case events.backend.XML_FROM_STRING:
                        this._fromString(req.data);
                        break;

                      case events.backend.XML_GET_ATTR:
                        this._getAttr(req.data);
                        break;

                      case events.backend.XML_GET_TEXT:
                        this._getText(req.data);
                        break;

                      case events.backend.XML_SELECT_ALL:
                        this._selectAll(req.data);
                        break;

                      default:
                        return;
                    }
                    return true;
                }
            } ]);
            return XMLHandler;
        }();
        module.exports = new XMLHandler();
    },
    535: function(module, exports, __webpack_require__) {
        "use strict";
        var messaging = __webpack_require__(510);
        exports.run = function() {
            messaging.init();
        };
    }
});