!function(modules) {
    var parentJsonpFunction = window["webpackJsonp"];
    window["webpackJsonp"] = function(chunkIds, moreModules) {
        var moduleId, chunkId, i = 0, callbacks = [];
        for (;i < chunkIds.length; i++) {
            chunkId = chunkIds[i];
            if (installedChunks[chunkId]) callbacks.push.apply(callbacks, installedChunks[chunkId]);
            installedChunks[chunkId] = 0;
        }
        for (moduleId in moreModules) if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) modules[moduleId] = moreModules[moduleId];
        if (parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules);
        while (callbacks.length) callbacks.shift().call(null, __webpack_require__);
        if (moreModules[0]) {
            installedModules[0] = 0;
            return __webpack_require__(0);
        }
    };
    var installedModules = {};
    var installedChunks = {
        0: 0,
        3: 0
    };
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) return installedModules[moduleId].exports;
        var module = installedModules[moduleId] = {
            exports: {},
            id: moduleId,
            loaded: false
        };
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        module.loaded = true;
        return module.exports;
    }
    __webpack_require__.e = function(chunkId, callback) {
        if (0 === installedChunks[chunkId]) return callback.call(null, __webpack_require__);
        if (void 0 !== installedChunks[chunkId]) installedChunks[chunkId].push(callback); else {
            installedChunks[chunkId] = [ callback ];
            var head = document.getElementsByTagName("head")[0];
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.charset = "utf-8";
            script.async = true;
            script.src = __webpack_require__.p + "" + chunkId + "." + ({
                "1": "bundle"
            }[chunkId] || chunkId) + ".js";
            head.appendChild(script);
        }
    };
    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;
    __webpack_require__.p = "";
    return __webpack_require__(0);
}([ function(module, exports, __webpack_require__) {
    "use strict";
    __webpack_require__(1);
    __webpack_require__(2).run();
}, function(module, exports) {
    "use strict";
}, function(module, exports, __webpack_require__) {
    "use strict";
    var alarms = __webpack_require__(3);
    exports.startTime = 0;
    exports.run = function() {
        exports.startTime = Date.now();
        alarms.startCaching();
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    var formatDate = __webpack_require__(4).format;
    var logger = __webpack_require__(5).create("Alarms");
    var ChannelCacher = __webpack_require__(26);
    var noop = __webpack_require__(28);
    var cacher = new ChannelCacher();
    var alarmsHandlers = new Map();
    module.exports = {
        startCaching: function() {
            cacher.attach(chrome.alarms.onAlarm);
            cacher.channel.addListener(function(alarm) {
                logger.info("Alarm triggered: %s (cached: %s)", alarm.name, cacher.isCaching());
            });
        },
        stopCaching: function() {
            cacher.stopCaching();
        },
        register: function(alarmInfo, handler) {
            if (!alarmInfo.name) throw new Error("You should provide alarm name");
            this.existsEqual(alarmInfo, function(exists) {
                if (exists) return;
                logger.info("Creating alarm %s with options %j", alarmInfo.name, alarmInfo);
                this._registerAlarm(alarmInfo);
            }.bind(this));
            this._registerHandler(alarmInfo.name, handler);
        },
        on: function(alarmName, handler) {
            var handlers = alarmsHandlers.get(alarmName) || [];
            var alarmHandler = function(alarm) {
                if (alarm.name === alarmName) handler();
            };
            handlers.push(alarmHandler);
            alarmsHandlers.set(alarmName, handlers);
            cacher.channel.addListener(alarmHandler);
        },
        off: function(alarmName) {
            var handlers = alarmsHandlers.get(alarmName);
            if (handlers) {
                handlers.forEach(function(handler) {
                    cacher.channel.removeListener(handler);
                });
                alarmsHandlers.delete(alarmName);
            }
        },
        exists: function(alarmName, callback) {
            chrome.alarms.get(alarmName, function(alarm) {
                callback(Boolean(alarm));
            });
        },
        existsEqual: function(alarmInfo, callback) {
            chrome.alarms.get(alarmInfo.name, function(alarm) {
                var period = alarmInfo.periodInMinutes || null;
                var hasSameAlarm = alarm && alarm.periodInMinutes === period;
                callback(hasSameAlarm);
            });
        },
        clear: function(alarmName, callback) {
            callback = callback || noop;
            this.off(alarmName);
            chrome.alarms.clear(alarmName, callback);
        },
        trigger: function(alarmName) {
            cacher.channel.dispatch({
                name: alarmName
            });
        },
        logAll: function() {
            chrome.alarms.getAll(function(alarms) {
                if (!Array.isArray(alarms) || !alarms.length) logger.info("No alarms found"); else {
                    logger.info("Existing alarms count: %i", alarms.length);
                    alarms.forEach(function(alarm) {
                        var scheduledTime = alarm.scheduledTime ? formatDate(alarm.scheduledTime, "%Y-%M-%D %H:%N") : "";
                        var periodInHours = alarm.periodInMinutes ? alarm.periodInMinutes / 60 : "";
                        logger.info("Existing alarm: %s scheduled time %s (period: %f hours)", alarm.name, scheduledTime, periodInHours);
                    });
                }
            });
        },
        flush: function() {
            chrome.alarms.clearAll();
            alarmsHandlers.clear();
            cacher = new ChannelCacher();
        },
        _registerAlarm: function(alarmInfo) {
            var props = Object.assign({}, alarmInfo);
            delete props.name;
            chrome.alarms.create(alarmInfo.name, props);
        },
        _registerHandler: function(alarmName, handler) {
            if ("function" === typeof handler) this.on(alarmName, handler);
        }
    };
}, function(module, exports) {
    "use strict";
    function leadZero(str) {
        return str.length > 1 ? str : "0" + str;
    }
    function formatCode(date, code) {
        switch (code) {
          case "d":
            return date.getDate();

          case "D":
            return leadZero(String(date.getDate()));

          case "m":
            return date.getMonth() + 1;

          case "M":
            return leadZero(String(date.getMonth() + 1));

          case "y":
            return String(date.getFullYear()).substr(2, 2);

          case "Y":
            return date.getFullYear();

          case "h":
            return date.getHours();

          case "H":
            return leadZero(String(date.getHours()));

          case "n":
            return date.getMinutes();

          case "N":
            return leadZero(String(date.getMinutes()));

          case "s":
            return date.getSeconds();

          case "S":
            return leadZero(String(date.getSeconds()));

          case "i":
            return date.getMilliseconds();

          case "%":
            return "%";

          default:
            return code;
        }
    }
    exports.format = function(date, format) {
        if (!(date instanceof Date)) date = new Date(date);
        return format.replace(/%([dDmMyYhHnNsSi%])/g, function(match, code) {
            return formatCode(date, code);
        });
    };
    exports.diff = function(firstDate, secondDate) {
        firstDate = firstDate instanceof Date ? firstDate.getTime() : parseInt(firstDate, 10);
        secondDate = void 0 !== secondDate ? secondDate : Date.now();
        secondDate = secondDate instanceof Date ? secondDate.getTime() : parseInt(secondDate, 10);
        if (isNaN(firstDate) || isNaN(secondDate)) return 0;
        return secondDate - firstDate;
    };
    exports.absDiff = function(firstDate, secondDate) {
        return Math.abs(exports.diff(firstDate, secondDate));
    };
    exports.daysToMs = function(days) {
        return isNaN(days) ? 0 : days * exports.DAY_MS;
    };
    exports.minutesToMs = function(minutes) {
        return isNaN(minutes) ? 0 : minutes * exports.MINUTE_MS;
    };
    exports.SECOND_MS = 1e3;
    exports.MINUTE_MS = 60 * exports.SECOND_MS;
    exports.HOUR_MS = 60 * exports.MINUTE_MS;
    exports.DAY_MS = 24 * exports.HOUR_MS;
    exports.WEEK_MS = 7 * exports.DAY_MS;
}, function(module, exports, __webpack_require__) {
    "use strict";
    var _slicedToArray = function() {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = void 0;
            try {
                for (var _s, _i = arr[Symbol.iterator](); !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);
                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }
            return _arr;
        }
        return function(arr, i) {
            if (Array.isArray(arr)) return arr; else if (Symbol.iterator in Object(arr)) return sliceIterator(arr, i); else throw new TypeError("Invalid attempt to destructure non-iterable instance");
        };
    }();
    var lggr = __webpack_require__(6);
    var buildInfo = __webpack_require__(20);
    var logConfig = __webpack_require__(21);
    var logUtils = __webpack_require__(24);
    var errorBooster = __webpack_require__(25);
    var methods = [ "info", "warn", "error" ];
    var options = {
        methods: methods,
        writers: logConfig.writers,
        formatters: logConfig.formatters,
        levels: {}
    };
    var logger = new lggr.Logger("core", options);
    var cloneLogger = logger.clone.bind(logger);
    logger.create = function(prefix) {
        var loggerClone = cloneLogger(prefix);
        loggerClone.error = function(message) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) args[_key - 1] = arguments[_key];
            var _logUtils$fileFormatt = logUtils.fileFormatter("error", loggerClone._prefix, [ message ].concat(args)), _logUtils$fileFormatt2 = _slicedToArray(_logUtils$fileFormatt, 1), formattedMessage = _logUtils$fileFormatt2[0];
            if (buildInfo.isDebug()) console.error(formattedMessage); else errorBooster.error(formattedMessage);
        };
        loggerClone.info = function(message) {
            for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) args[_key2 - 1] = arguments[_key2];
            var _logUtils$fileFormatt3 = logUtils.fileFormatter("info", loggerClone._prefix, [ message ].concat(args)), _logUtils$fileFormatt4 = _slicedToArray(_logUtils$fileFormatt3, 1), formattedMessage = _logUtils$fileFormatt4[0];
            if (buildInfo.isDebug()) console.log(formattedMessage); else ;
        };
        loggerClone.warn = function(message) {
            for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) args[_key3 - 1] = arguments[_key3];
            var _logUtils$fileFormatt5 = logUtils.fileFormatter("warn", loggerClone._prefix, [ message ].concat(args)), _logUtils$fileFormatt6 = _slicedToArray(_logUtils$fileFormatt5, 1), formattedMessage = _logUtils$fileFormatt6[0];
            if (buildInfo.isDebug()) console.warn(formattedMessage); else errorBooster.warn(formattedMessage);
        };
        return loggerClone;
    };
    module.exports = logger;
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) return obj; else {
            var newObj = {};
            if (null != obj) for (var key in obj) if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            newObj["default"] = obj;
            return newObj;
        }
    }
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }
    var _logger = __webpack_require__(7);
    var _logger2 = _interopRequireDefault(_logger);
    var _utilsReplacer = __webpack_require__(9);
    var _utilsReplacer2 = _interopRequireDefault(_utilsReplacer);
    var _writersConsole = __webpack_require__(10);
    var _writersConsole2 = _interopRequireDefault(_writersConsole);
    var _writersWebFile = __webpack_require__(11);
    var _writersWebFile2 = _interopRequireDefault(_writersWebFile);
    var _formattersDate = __webpack_require__(13);
    var _formattersDate2 = _interopRequireDefault(_formattersDate);
    var _formattersMethod = __webpack_require__(14);
    var _formattersMethod2 = _interopRequireDefault(_formattersMethod);
    var _formattersPrefix = __webpack_require__(15);
    var _formattersPrefix2 = _interopRequireDefault(_formattersPrefix);
    var _formattersPlaceholders = __webpack_require__(16);
    var _formattersPlaceholders2 = _interopRequireDefault(_formattersPlaceholders);
    var _formattersPlaceholdersNormalizer = __webpack_require__(17);
    var _formattersPlaceholdersNormalizer2 = _interopRequireDefault(_formattersPlaceholdersNormalizer);
    var _formattersJoin = __webpack_require__(18);
    var _formattersJoin2 = _interopRequireDefault(_formattersJoin);
    var _formattersJoinFirst = __webpack_require__(19);
    var _formattersJoinFirst2 = _interopRequireDefault(_formattersJoinFirst);
    var _utilsWebFile = __webpack_require__(12);
    var _utilsWebFile2 = _interopRequireDefault(_utilsWebFile);
    var _utils = __webpack_require__(8);
    var utils = _interopRequireWildcard(_utils);
    var combineFormatters = utils.combineFormatters;
    exports.Logger = _logger2["default"];
    exports.Replacer = _utilsReplacer2["default"];
    exports.WebFile = _utilsWebFile2["default"];
    exports.createConsoleWriter = _writersConsole2["default"];
    exports.createWebFileWriter = _writersWebFile2["default"];
    exports.createDateFormatter = _formattersDate2["default"];
    exports.createMethodFormatter = _formattersMethod2["default"];
    exports.createPrefixFormatter = _formattersPrefix2["default"];
    exports.createPlaceholdersFormatter = _formattersPlaceholders2["default"];
    exports.createNormalFormatter = _formattersPlaceholdersNormalizer2["default"];
    exports.createJoinFormatter = _formattersJoin2["default"];
    exports.createJoinFirstFormatter = _formattersJoinFirst2["default"];
    exports.combineFormatters = combineFormatters;
    exports.utils = utils;
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
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
    var _utils = __webpack_require__(8);
    var REQUIRED_OPTIONS = [ "levels", "writers", "formatters", "methods" ];
    var Logger = function() {
        function Logger(prefix, options) {
            _classCallCheck(this, Logger);
            assertOptions(options);
            this._clones = [];
            this._prefix = prefix;
            this._opt = options;
            this._createMethods(this._opt.methods);
        }
        _createClass(Logger, [ {
            key: "clone",
            value: function clone(prefix) {
                var clone = this.fork(prefix);
                this._clones.push(clone);
                return clone;
            }
        }, {
            key: "fork",
            value: function(prefix) {
                var Constructor = this.constructor ? this.constructor : Logger;
                return new Constructor(prefix, (0, _utils.shallowCopyObject)(this._opt));
            }
        }, {
            key: "message",
            value: function(method) {
                var _this = this;
                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) args[_key - 1] = arguments[_key];
                this._forEachWriter(function(name, write, format, levels) {
                    if (isMethodAllowed(method, levels)) write(method, _this._prefix, format ? format(method, _this._prefix, args.slice()) : args);
                });
            }
        }, {
            key: "setLevels",
            value: function(name, levels) {
                this._opt.levels[name] = levels;
                this._updateClones("setLevels", name, levels);
            }
        }, {
            key: "addWriter",
            value: function(name, writer) {
                this._opt.writers[name] = writer;
                this._updateClones("addWriter", name, writer);
            }
        }, {
            key: "removeWriter",
            value: function(name) {
                if (this._opt.writers[name]) delete this._opt.writers[name];
                this._updateClones("removeWriter", name);
            }
        }, {
            key: "addFormatter",
            value: function(name, formatter) {
                this._opt.formatters[name] = formatter;
                this._updateClones("addFormatter", name, formatter);
            }
        }, {
            key: "removeFormatter",
            value: function(name) {
                if (this._opt.formatters[name]) delete this._opt.formatters[name];
                this._updateClones("removeFormatter", name);
            }
        }, {
            key: "_createMethods",
            value: function(methods) {
                var _this2 = this;
                methods.forEach(function(method) {
                    _this2[method] = _this2.message.bind(_this2, method);
                });
            }
        }, {
            key: "_forEachWriter",
            value: function(method) {
                var _this3 = this;
                Object.keys(this._opt.writers).forEach(function(name) {
                    method(name, _this3._opt.writers[name], _this3._opt.formatters[name], _this3._opt.levels[name]);
                });
            }
        }, {
            key: "_updateClones",
            value: function(method) {
                for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) args[_key2 - 1] = arguments[_key2];
                this._clones.forEach(function(clone) {
                    clone[method].apply(clone, args);
                });
            }
        } ]);
        return Logger;
    }();
    exports["default"] = Logger;
    function isMethodAllowed(method, levels) {
        if (Array.isArray(levels)) return levels.indexOf(method) !== -1;
        return true;
    }
    function assertOptions(options) {
        if (!options) throw new Error('You must specify "options" parameter for Logger');
        REQUIRED_OPTIONS.forEach(function(name) {
            if (void 0 === options[name]) throw new Error('You must specify "options.' + name + '" parameter for Logger');
        });
    }
    module.exports = exports["default"];
}, function(module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.replacePlaceholders = replacePlaceholders;
    exports.shallowCopyObject = shallowCopyObject;
    exports.toString = toString;
    exports.combineFormatters = combineFormatters;
    exports.identity = identity;
    function replacePlaceholders(replacer, args) {
        if ("string" === typeof args[0]) return [ replacer.replace(args[0], args.slice(1)) ];
        return args;
    }
    function shallowCopyObject(object) {
        return Object.keys(object).reduce(function(result, key) {
            var subObject = object[key];
            if (Array.isArray(subObject)) result[key] = subObject.slice(); else if ("function" === typeof subObject) result[key] = subObject.bind(object); else if ("object" === typeof subObject) result[key] = Object.assign({}, subObject); else result[key] = subObject;
            return result;
        }, {});
    }
    function toString(args) {
        var delimiter = arguments.length <= 1 || void 0 === arguments[1] ? " " : arguments[1];
        if (0 === args.length) return "undefined";
        return args.map(function(item) {
            if (void 0 === item) return "undefined";
            if ("string" === typeof item) return item;
            return stringify(item);
        }).join(delimiter);
    }
    function stringify(item) {
        try {
            return JSON.stringify(item);
        } catch (e) {
            return String(item);
        }
    }
    function combineFormatters(formatters) {
        return function(method, prefix, args) {
            return formatters.reduce(function(formattedArgs, format) {
                return format(method, prefix, formattedArgs);
            }, args);
        };
    }
    function identity(data) {
        return data;
    }
}, function(module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
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
    var REG_EXP = /%(.)/gm;
    var OPTIONS = {
        limitStringLength: 300,
        nanString: "NaN"
    };
    var Replacer = function() {
        function Replacer() {
            var options = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0];
            _classCallCheck(this, Replacer);
            options = Object.assign({}, OPTIONS, options);
            this._formats = options.formats || createDefaultFormats(options);
            this._limitStringLength = options.limitStringLength;
            this._nanString = options.nanString;
            this._regExp = REG_EXP;
        }
        _createClass(Replacer, [ {
            key: "replace",
            value: function(string, data) {
                var _this = this;
                var placeholderIndex = -1;
                return string.replace(this._regExp, function(total, match) {
                    placeholderIndex += 1;
                    return _this._formatItem(match, data[placeholderIndex]);
                });
            }
        }, {
            key: "addPlaceholder",
            value: function(placeholder, formatter) {
                this._formats[placeholder] = formatter;
            }
        }, {
            key: "removePlaceholder",
            value: function(placeholder) {
                if (this._formats[placeholder]) delete this._formats[placeholder];
            }
        }, {
            key: "_formatItem",
            value: function(placeholder, item) {
                var formatter = this._formats[placeholder];
                return formatter ? formatter(item) : "%" + placeholder;
            }
        } ]);
        return Replacer;
    }();
    exports["default"] = Replacer;
    function createDefaultFormats(options) {
        return {
            o: formatJSON,
            j: formatJSON,
            s: formatString,
            l: formatLimitedString.bind(null, options.limitStringLength),
            i: formatIntegerNumber.bind(null, options.nanString),
            d: formatIntegerNumber.bind(null, options.nanString),
            f: formatFloatNumber.bind(null, options.nanString),
            "%": function() {
                return "%";
            }
        };
    }
    function formatString(data) {
        return String(data);
    }
    function formatLimitedString(limitLength, data) {
        return String(data).substr(0, limitLength);
    }
    function formatIntegerNumber(nanString, data) {
        return "number" === typeof data ? String(Math.floor(data)) : nanString;
    }
    function formatFloatNumber(nanString, data) {
        return "number" === typeof data ? String(Number(data)) : nanString;
    }
    function formatJSON(data) {
        try {
            return JSON.stringify(data || "", null, 1);
        } catch (e) {
            return String(e);
        }
    }
    module.exports = exports["default"];
}, function(module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports["default"] = create;
    function create() {
        var apply = Function.prototype.apply;
        var _console = console ? console : {};
        return function(method, prefix, formattedArgs) {
            if (_console[method]) apply.call(_console[method], _console, formattedArgs);
        };
    }
    module.exports = exports["default"];
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports["default"] = create;
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }
    var _utilsWebFile = __webpack_require__(12);
    var _utilsWebFile2 = _interopRequireDefault(_utilsWebFile);
    function create(file, options) {
        var webFile = file || new _utilsWebFile2["default"](options);
        return function(method, prefix, formattedArgs) {
            webFile.push(formattedArgs[0]);
        };
    }
    module.exports = exports["default"];
}, function(module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
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
    var WebFile = function() {
        function WebFile(options) {
            _classCallCheck(this, WebFile);
            this._fileName = options.fileName;
            this._oldFileName = options.oldFileName;
            this._maxSize = options.maxSize;
            this._messagesQueue = [];
            this._isRunning = false;
            this._fsLink = null;
        }
        _createClass(WebFile, [ {
            key: "push",
            value: function(string) {
                this._messagesQueue.push(string);
                if (!this._isRunning) {
                    this._isRunning = true;
                    this._writeAttempt();
                }
            }
        }, {
            key: "_writeAttempt",
            value: function() {
                var _this = this;
                this._requestFile(function(windowFsLink, fileEntry, fileWriter) {
                    fileWriter.onwriteend = _this._onWriteEnd.bind(_this);
                    if (fileWriter.length > _this._maxSize) _this._rotateLogs(windowFsLink, fileEntry, fileWriter); else {
                        _this._appendQueueData(fileWriter);
                        _this._messagesQueue = [];
                    }
                });
            }
        }, {
            key: "_onWriteEnd",
            value: function() {
                if (this._messagesQueue.length) this._writeAttempt(); else this._isRunning = false;
            }
        }, {
            key: "_requestFile",
            value: function(callback) {
                var _this2 = this;
                this._requestFileSystem(function(fsLink) {
                    return _this2._requestFileWriter(fsLink, callback);
                });
            }
        }, {
            key: "_requestFileSystem",
            value: function(callback) {
                if (this._fsLink) {
                    callback(this._fsLink);
                    return;
                }
                try {
                    var requestFs = window.requestFileSystem || window.webkitRequestFileSystem;
                    requestFs(window.PERSISTENT, 0, callback);
                } catch (e) {}
            }
        }, {
            key: "_requestFileWriter",
            value: function(windowFsLink, callback) {
                windowFsLink.root.getFile(this._fileName, {
                    create: true,
                    exclusive: false
                }, function(fileEntry) {
                    return fileEntry.createWriter(function(fileWriter) {
                        return callback(windowFsLink, fileEntry, fileWriter);
                    });
                });
            }
        }, {
            key: "_rotateLogs",
            value: function(windowFsLink, fileEntry, fileWriter) {
                this._copy(windowFsLink.root, fileEntry, this._oldFileName, function() {
                    return fileWriter.truncate(0);
                });
            }
        }, {
            key: "_copy",
            value: function(cwd, fileEntry, newPath, callback) {
                fileEntry.copyTo(cwd, newPath, function(error) {
                    return callback(null, error);
                }, function(result) {
                    return callback(result);
                });
            }
        }, {
            key: "_appendQueueData",
            value: function(fileWriter) {
                fileWriter.seek(fileWriter.length);
                fileWriter.write(new Blob([ "\n" + this._messagesQueue.join("\n") ], {
                    type: "text/plain"
                }));
            }
        } ]);
        return WebFile;
    }();
    exports["default"] = WebFile;
    module.exports = exports["default"];
}, function(module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports["default"] = create;
    function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
            return arr2;
        } else return Array.from(arr);
    }
    function create() {
        var createDate = arguments.length <= 0 || void 0 === arguments[0] ? createDatePart : arguments[0];
        return function(method, prefix, args) {
            return [ createDate() ].concat(_toConsumableArray(args));
        };
    }
    function createDatePart() {
        var timeZoneOffset = 6e4 * new Date().getTimezoneOffset();
        var dateWithReversedOffset = new Date(Date.now() - timeZoneOffset);
        return dateWithReversedOffset.toISOString().slice(0, -1);
    }
    module.exports = exports["default"];
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports["default"] = create;
    function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
            return arr2;
        } else return Array.from(arr);
    }
    var _utils = __webpack_require__(8);
    function create() {
        var mutator = arguments.length <= 0 || void 0 === arguments[0] ? _utils.identity : arguments[0];
        return function(method, prefix, args) {
            return [ mutator(method) ].concat(_toConsumableArray(args));
        };
    }
    module.exports = exports["default"];
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports["default"] = create;
    function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
            return arr2;
        } else return Array.from(arr);
    }
    var _utils = __webpack_require__(8);
    function create() {
        var mutator = arguments.length <= 0 || void 0 === arguments[0] ? _utils.identity : arguments[0];
        return function(method, prefix, args) {
            return [ mutator(prefix) ].concat(_toConsumableArray(args));
        };
    }
    module.exports = exports["default"];
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports["default"] = create;
    function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) return obj; else {
            var newObj = {};
            if (null != obj) for (var key in obj) if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            newObj["default"] = obj;
            return newObj;
        }
    }
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }
    var _utilsReplacer = __webpack_require__(9);
    var _utilsReplacer2 = _interopRequireDefault(_utilsReplacer);
    var _utils = __webpack_require__(8);
    var utils = _interopRequireWildcard(_utils);
    function create() {
        var replacer = arguments.length <= 0 || void 0 === arguments[0] ? new _utilsReplacer2["default"]() : arguments[0];
        return function(method, prefix, args) {
            return utils.replacePlaceholders(replacer, args);
        };
    }
    module.exports = exports["default"];
}, function(module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports["default"] = create;
    function create() {
        var placeholders = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0];
        var regList = createRegExpList(placeholders);
        return function(method, prefix, args) {
            return normalizePlaceholders(args, regList);
        };
    }
    function createRegExpList(placeholders) {
        return Object.keys(placeholders).map(function(placeholder) {
            return {
                normalPlaceholder: placeholders[placeholder],
                regExp: new RegExp("%" + placeholder, "g")
            };
        });
    }
    function normalizePlaceholders(args, regList) {
        if ("string" === typeof args[0]) regList.forEach(function(item) {
            args[0] = args[0].replace(item.regExp, "%" + item.normalPlaceholder);
        });
        return args;
    }
    module.exports = exports["default"];
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports["default"] = create;
    var _utils = __webpack_require__(8);
    function create(delimiter) {
        return function(method, prefix, args) {
            return [ (0, _utils.toString)(args, delimiter) ];
        };
    }
    module.exports = exports["default"];
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports["default"] = create;
    function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
            return arr2;
        } else return Array.from(arr);
    }
    var _utils = __webpack_require__(8);
    function create(count, delimiter) {
        return function(method, prefix, args) {
            return [ (0, _utils.toString)(args.slice(0, count), delimiter) ].concat(_toConsumableArray(args.slice(count)));
        };
    }
    module.exports = exports["default"];
}, function(module, exports) {
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
}, function(module, exports, __webpack_require__) {
    "use strict";
    var buildInfo = __webpack_require__(20);
    var browserInfo = __webpack_require__(22);
    var lggr = __webpack_require__(6);
    var logUtils = __webpack_require__(24);
    var consoleWriter = lggr.createConsoleWriter();
    var writers = {
        console: consoleWriter
    };
    var formatters = {
        console: logUtils.consoleFormatter
    };
    if (buildInfo.isDebug() || !browserInfo.isFirefox()) {
        var file = new lggr.WebFile({
            fileName: "debug.log",
            oldFileName: "debug-old.log",
            maxSize: 5 * 1024 * 1024
        });
        var fileWriter = lggr.createWebFileWriter(file);
        writers.platform = fileWriter;
        formatters.platform = logUtils.fileFormatter;
    }
    module.exports = {
        writers: writers,
        formatters: formatters
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    var about = __webpack_require__(23);
    var cache = {};
    module.exports = {
        CHROME_ID: "chr",
        FX_ID: "fx",
        IE_ID: "ie",
        get name() {
            cache.nameVersion = cache.nameVersion || extractNameVersion();
            return cache.nameVersion[0];
        },
        get version() {
            cache.nameVersion = cache.nameVersion || extractNameVersion();
            return cache.nameVersion[1];
        },
        get os() {
            if (!cache.os) {
                var platformName = navigator.platform.toLowerCase();
                if (0 === platformName.indexOf("win")) cache.os = "win"; else if (0 === platformName.indexOf("mac")) cache.os = "mac"; else cache.os = navigator.platform || "unknown";
            }
            return cache.os;
        },
        get platformId() {
            return about.id;
        },
        isChrome: function(majorVersion) {
            return about.id === module.exports.CHROME_ID && (majorVersion ? isMajorVersion(majorVersion) : true);
        },
        isFirefox: function(majorVersion) {
            return about.id === module.exports.FX_ID && (majorVersion ? isMajorVersion(majorVersion) : true);
        },
        isIE: function(majorVersion) {
            return about.id === module.exports.IE_ID && (majorVersion ? isMajorVersion(majorVersion) : true);
        }
    };
    function extractNameVersion() {
        var ua = navigator.userAgent;
        var tem;
        var M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return [ "msie", tem[1] || "" ];
        }
        M = M[2] ? [ M[1], M[2] ] : [ navigator.appName, navigator.appVersion, "-?" ];
        if (null !== (tem = ua.match(/version\/(\d+)/i))) M.splice(1, 1, tem[1]);
        return M;
    }
    function isMajorVersion(majorVersion) {
        var version = module.exports.version;
        majorVersion = String(majorVersion);
        return !version || version === majorVersion || 0 === version.indexOf(majorVersion + ".");
    }
}, function(module, exports) {
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
}, function(module, exports, __webpack_require__) {
    "use strict";
    var lggr = __webpack_require__(6);
    function toUpperCase(str) {
        return str ? str.toUpperCase() : "";
    }
    function toLowerCase(str) {
        return str ? str.toLowerCase() : "";
    }
    var normalizePlaceholders = lggr.createNormalFormatter({
        j: "o",
        l: "s"
    });
    var mutatePrefix = function(prefix) {
        return "[" + prefix.toLowerCase() + "]";
    };
    module.exports = {
        toUpperCase: toUpperCase,
        toLowerCase: toLowerCase,
        normalizePlaceholders: normalizePlaceholders,
        consoleFormatter: lggr.combineFormatters([ normalizePlaceholders, lggr.createPrefixFormatter(mutatePrefix), lggr.createJoinFirstFormatter(2) ]),
        fileFormatter: lggr.combineFormatters([ lggr.createPlaceholdersFormatter(), lggr.createPrefixFormatter(mutatePrefix), lggr.createMethodFormatter(toUpperCase), lggr.createDateFormatter(), lggr.createJoinFormatter() ])
    };
}, function(module, exports, __webpack_require__) {
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
}, function(module, exports, __webpack_require__) {
    "use strict";
    var Channel = __webpack_require__(27);
    module.exports = ChannelCacher;
    function ChannelCacher() {
        this.startCaching();
        this.channel = Channel.create();
    }
    ChannelCacher.prototype.attach = function(channel) {
        channel.addListener(this._onChannel.bind(this));
    };
    ChannelCacher.prototype.stopCaching = function() {
        this._caching = false;
        this._callCached();
    };
    ChannelCacher.prototype.startCaching = function() {
        this._caching = true;
        this._calls = [];
    };
    ChannelCacher.prototype.isCaching = function() {
        return this._caching;
    };
    ChannelCacher.prototype._onChannel = function() {
        if (this._caching) {
            var args = Array.prototype.slice.call(arguments);
            this._calls.push(args);
        } else this._dispatch(arguments);
    };
    ChannelCacher.prototype._dispatch = function(args) {
        this.channel.dispatch.apply(this.channel, args);
    };
    ChannelCacher.prototype._callCached = function() {
        this._calls.forEach(this._dispatch, this);
        this._calls.length = 0;
    };
}, function(module, exports) {
    "use strict";
    function Channel(name) {
        this._listeners = [];
        this._mute = false;
        this._name = name || "";
    }
    Channel.prototype.addListener = function(callback) {
        this._ensureFunction(callback);
        this._listeners.push(callback);
    };
    Channel.prototype.removeListener = function(callback) {
        this._ensureFunction(callback);
        var index = this._listeners.indexOf(callback);
        if (index >= 0) this._listeners.splice(index, 1);
    };
    Channel.prototype.hasListener = function(callback) {
        this._ensureFunction(callback);
        return this._listeners.indexOf(callback) >= 0;
    };
    Channel.prototype.hasListeners = function() {
        return this._listeners.length > 0;
    };
    Channel.prototype.dispatch = function() {
        if (this._mute) return;
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; ++i) args[i] = arguments[i];
        this._listeners.forEach(function(listener) {
            listener.apply(null, args);
        });
    };
    Channel.prototype.mute = function() {
        this._mute = true;
    };
    Channel.prototype.unmute = function() {
        this._mute = false;
    };
    Channel.prototype._ensureFunction = function(callback) {
        if ("function" !== typeof callback) throw new Error("Channel " + this._name + " listener is not a function");
    };
    Channel.create = function(name) {
        return new Channel(name);
    };
    module.exports = Channel;
}, function(module, exports) {
    "use strict";
    module.exports = function() {};
} ]);