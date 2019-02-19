chatease = function() {
	if (chatease.api) {
		return chatease.api.getInstance.apply(this, arguments);
	}
};

chatease.version = '1.2.00';

(function(chatease) {
	var utils = chatease.utils = {};
	
	utils.exists = function(item) {
		switch (utils.typeOf(item)) {
			case 'string':
				return (item.length > 0);
			case 'object':
				return (item !== null);
			case 'null':
				return false;
		}
		return true;
	};
	
	utils.extend = function() {
		var args = Array.prototype.slice.call(arguments, 0),
			obj = args[0];
		if (args.length > 1) {
			for (var i = 1; i < args.length; i++) {
				utils.foreach(args[i], function(key, val) {
					if (val !== undefined && val !== null) {
						obj[key] = val;
					}
				});
			}
		}
		return obj;
	};
	
	utils.foreach = function(data, fn) {
		for (var key in data) {
			if (data.hasOwnProperty && utils.typeOf(data.hasOwnProperty) === 'function') {
				if (data.hasOwnProperty(key)) {
					fn(key, data[key]);
				}
			} else {
				// IE8 has a problem looping through XML nodes
				fn(key, data[key]);
			}
		}
	};
	
	utils.getCookie = function(key) {
		var arr, reg=new RegExp('(^| )' + key + '=([^;]*)(;|$)');
		if (arr = document.cookie.match(reg))
			return unescape(arr[2]);
		return null;
	};
	
	utils.formatTime = function(date) {
		var hours = date.getHours() + 1;
		var minutes = date.getMinutes();
		var seconds = date.getSeconds();
		return date.toLocaleDateString() + ' ' + utils.pad(hours, 2) + ':' + utils.pad(minutes, 2) + ':' + utils.pad(seconds, 2);
	};
	
	utils.pad = function(val, len) {
		var str = val + '';
		while (str.length < len) {
			str = '0' + str;
		}
		
		return str;
	};
	
	utils.typeOf = function(value) {
		if (value === null || value === undefined) {
			return 'null';
		}
		
		var typeofString = typeof value;
		if (typeofString === 'object') {
			try {
				var str = value.toString();
				var arr = str.match(/^\[object ([a-z]+)\]$/i);
				if (arr && arr.length > 1 && arr[1]) {
					return arr[1].toLowerCase();
				}
			} catch (err) {
				/* void */
			}
		}
		
		return typeofString;
	};
	
	utils.isInt = function(value) {
		return parseFloat(value) % 1 === 0;
	};
	
	utils.trim = function(inputString) {
		return inputString.replace(/^\s+|\s+$/g, '');
	};
	
	utils.indexOf = function(array, item) {
		if (array == null) {
			return -1;
		}
		
		for (var i = 0; i < array.length; i++) {
			if (array[i] === item) {
				return i;
			}
		}
		
		return -1;
	};
	
	
	/* DOM */
	utils.createElement = function(elem, className) {
		var newElement = document.createElement(elem);
		if (className) {
			newElement.className = className;
		}
		return newElement;
	};
	
	utils.addClass = function(element, classes) {
		var originalClasses = utils.typeOf(element.className) === 'string' ? element.className.split(' ') : [];
		var addClasses = utils.typeOf(classes) === 'array' ? classes : classes.split(' ');
		
		utils.foreach(addClasses, function(n, c) {
			if (utils.indexOf(originalClasses, c) === -1) {
				originalClasses.push(c);
			}
		});
		
		element.className = utils.trim(originalClasses.join(' '));
	};
	
	utils.removeClass = function(element, c) {
		var originalClasses = utils.typeOf(element.className) === 'string' ? element.className.split(' ') : [];
		var removeClasses = utils.typeOf(c) === 'array' ? c : c.split(' ');
		
		utils.foreach(removeClasses, function(n, c) {
			var index = utils.indexOf(originalClasses, c);
			if (index >= 0) {
				originalClasses.splice(index, 1);
			}
		});
		
		element.className = utils.trim(originalClasses.join(' '));
	};
	
	utils.emptyElement = function(element) {
		while (element.firstChild) {
			element.removeChild(element.firstChild);
		}
	};
	
	
	/* Browser */
	utils.isMSIE = function(version) {
		version = version || '';
		return _userAgentMatch(new RegExp('msie\\s*' + version, 'i'));
	};
	
	utils.isSafari = function() {
		return (_userAgentMatch(/safari/i) && !_userAgentMatch(/chrome/i) && !_userAgentMatch(/chromium/i) && !_userAgentMatch(/android/i));
	};
	
	utils.isIOS = function(version) {
		if (version) {
			return _userAgentMatch(new RegExp('iP(hone|ad|od).+\\sOS\\s' + version, 'i'));
		}
		
		return _userAgentMatch(/iP(hone|ad|od)/i);
	};
	
	utils.isAndroid = function(version, excludeChrome) {
		//Android Browser appears to include a user-agent string for Chrome/18
		if (excludeChrome && _userAgentMatch(/chrome\/[123456789]/i) && !_userAgentMatch(/chrome\/18/)) {
			return false;
		}
		
		if (version) {
			// make sure whole number version check ends with point '.'
			if (utils.isInt(version) && !/\./.test(version)) {
				version = '' + version + '.';
			}
			
			return _userAgentMatch(new RegExp('Android\\s*' + version, 'i'));
		}
		
		return _userAgentMatch(/Android/i);
	};
	
	utils.isMobile = function() {
		return utils.isIOS() || utils.isAndroid();
	};
	
	function _userAgentMatch(regex) {
		var agent = navigator.userAgent.toLowerCase();
		return (agent.match(regex) !== null);
	};
	
	
	/* protocol & extension */
	utils.getProtocol = function(url) {
		var protocol = 'http';
		
		var arr = url.match(/^([a-z]+)\:\/\//i);
		if (arr && arr.length > 1) {
			protocol = arr[1];
		}
		
		return protocol;
	};
	
	utils.getFileName = function(file) {
		var name = '';
		
		var arr = file.match(/\/([a-z0-9\(\)\[\]\{\}\s\-_%]*(\.[a-z0-9]+)?)$/i);
		if (arr && arr.length > 1) {
			name = arr[1];
		}
		
		return name;
	};
	
	utils.getExtension = function(file) {
		var extension = '';
		
		var arr = file.match(/\/?([a-z0-9\(\)\[\]\{\}\s\-_%]*(\.([a-z0-9]+))*)\??([a-z0-9\-_%&=]*)$/i);
		if (arr && arr.length > 3) {
			extension = arr[3];
		}
		
		return extension;
	};
	
	
	/* Logger */
	var console = window.console = window.console || {
		log: function() {}
	};
	utils.log = function() {
		var args = Array.prototype.slice.call(arguments, 0);
		if (utils.typeOf(console.log) === 'object') {
			console.log(args);
		} else {
			console.log.apply(console, args);
		}
	};
})(chatease);

(function(chatease) {
	var utils = chatease.utils;
	
	var crypt = utils.crypt = {};
	
	/**
	 * Turns a string into an array of bytes; a "byte" being a JS number in the
	 * range 0-255.
	 * @param {string} str String value to arrify.
	 * @return {!Array<number>} Array of numbers corresponding to the
	 *     UCS character codes of each character in str.
	 */
	crypt.stringToByteArray = function(str) {
		var output = [], p = 0;
		for (var i = 0; i < str.length; i++) {
			var c = str.charCodeAt(i);
			while (c > 0xff) {
				output[p++] = c & 0xff;
				c >>= 8;
			}
			output[p++] = c;
		}
		
		return output;
	};
	
	/**
	 * Turns an array of numbers into the string given by the concatenation of the
	 * characters to which the numbers correspond.
	 * @param {!Uint8Array|!Array<number>} bytes Array of numbers representing characters.
	 * @return {string} Stringification of the array.
	 */
	crypt.byteArrayToString = function(bytes) {
		var CHUNK_SIZE = 8192;
		
		// Special-case the simple case for speed's sake.
		if (bytes.length <= CHUNK_SIZE) {
			return String.fromCharCode.apply(null, bytes);
		}
		
		// The remaining logic splits conversion by chunks since
		// Function#apply() has a maximum parameter count.
		// See discussion: http://goo.gl/LrWmZ9
		
		var str = '';
		for (var i = 0; i < bytes.length; i += CHUNK_SIZE) {
			var chunk = Array.slice(bytes, i, i + CHUNK_SIZE);
			str += String.fromCharCode.apply(null, chunk);
		}
		
		return str;
	};
	
	/**
	 * Turns an array of numbers into the hex string given by the concatenation of
	 * the hex values to which the numbers correspond.
	 * @param {Uint8Array|Array<number>} array Array of numbers representing characters.
	 * @return {string} Hex string.
	 */
	crypt.byteArrayToHex = function(array) {
		return Array.map(array, function(numByte) {
			var hexByte = numByte.toString(16);
			return hexByte.length > 1 ? hexByte : '0' + hexByte;
		}).join('');
	};
	
	/**
	 * Converts a hex string into an integer array.
	 * @param {string} hexString Hex string of 16-bit integers (two characters per integer).
	 * @return {!Array<number>} Array of {0,255} integers for the given string.
	 */
	crypt.hexToByteArray = function(hexString) {
		if (hexString.length % 2 !== 0) {
			utils.log('Key string length must be multiple of 2.');
			return null;
		}
		
		var arr = [];
		for (var i = 0; i < hexString.length; i += 2) {
			arr.push(parseInt(hexString.substring(i, i + 2), 16));
		}
		
		return arr;
	};
	
	/**
	 * Converts a JS string to a UTF-8 "byte" array.
	 * @param {string} str 16-bit unicode string.
	 * @return {!Array<number>} UTF-8 byte array.
	 */
	crypt.stringToUTF8ByteArray = function(str) {
		// TODO(user): Use native implementations if/when available
		var out = [], p = 0;
		for (var i = 0; i < str.length; i++) {
			var c = str.charCodeAt(i);
			if (c < 128) {
				out[p++] = c;
			} else if (c < 2048) {
				out[p++] = (c >> 6) | 192;
				out[p++] = (c & 63) | 128;
			} else if (((c & 0xFC00) == 0xD800) && (i + 1) < str.length && ((str.charCodeAt(i + 1) & 0xFC00) == 0xDC00)) {
				// Surrogate Pair
				c = 0x10000 + ((c & 0x03FF) << 10) + (str.charCodeAt(++i) & 0x03FF);
				out[p++] = (c >> 18) | 240;
				out[p++] = ((c >> 12) & 63) | 128;
				out[p++] = ((c >> 6) & 63) | 128;
				out[p++] = (c & 63) | 128;
			} else {
				out[p++] = (c >> 12) | 224;
				out[p++] = ((c >> 6) & 63) | 128;
				out[p++] = (c & 63) | 128;
			}
		}
		
		return out;
	};
	
	/**
	 * Converts a UTF-8 byte array to JavaScript's 16-bit Unicode.
	 * @param {Uint8Array|Array<number>} bytes UTF-8 byte array.
	 * @return {string} 16-bit Unicode string.
	 */
	crypt.UTF8ByteArrayToString = function(bytes) {
		// TODO(user): Use native implementations if/when available
		var out = [], pos = 0, c = 0;
		while (pos < bytes.length) {
			var c1 = bytes[pos++];
			if (c1 < 128) {
				out[c++] = String.fromCharCode(c1);
			} else if (c1 > 191 && c1 < 224) {
				var c2 = bytes[pos++];
				out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
			} else if (c1 > 239 && c1 < 365) {
				// Surrogate Pair
				var c2 = bytes[pos++];
				var c3 = bytes[pos++];
				var c4 = bytes[pos++];
				var u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 0x10000;
				out[c++] = String.fromCharCode(0xD800 + (u >> 10));
				out[c++] = String.fromCharCode(0xDC00 + (u & 1023));
			} else {
				var c2 = bytes[pos++];
				var c3 = bytes[pos++];
				out[c++] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
			}
		}
		
		return out.join('');
	};
	
	/**
	 * XOR two byte arrays.
	 * @param {!Uint8Array|!Int8Array|!Array<number>} bytes1 Byte array 1.
	 * @param {!Uint8Array|!Int8Array|!Array<number>} bytes2 Byte array 2.
	 * @return {!Array<number>} Resulting XOR of the two byte arrays.
	 */
	crypt.XORByteArray = function(bytes1, bytes2) {
		if (bytes1.length !== bytes2.length) {
			utils.log('XOR array lengths must match.');
			return 
		}
		
		var result = [];
		for (var i = 0; i < bytes1.length; i++) {
			result.push(bytes1[i] ^ bytes2[i]);
		}
		
		return result;
	};
})(chatease);

(function(chatease) {
	var utils = chatease.utils,
		sheet;
	
	function createStylesheet() {
		var styleSheet = document.createElement('style');
		styleSheet.type = 'text/css';
		document.getElementsByTagName('head')[0].appendChild(styleSheet);
		return styleSheet.sheet || styleSheet.styleSheet;
	}
	
	var css = utils.css = function(selector, styles) {
		if (!sheet) {
			sheet = createStylesheet();
		}
		
		var _styles = '';
		utils.foreach(styles, function(style, value) {
			_styles += style + ': ' + value + '; ';
		});
		
		try {
			if (sheet.insertRule) 
				sheet.insertRule(selector + ' { ' + _styles + '}', sheet.cssRules.length);
			else 
				sheet.addRule(selector, _styles, sheet.rules.length);
		} catch (e) {
			utils.log('Failed to insert css rule: ' + selector);
		}
	};
	
	css.style = function(elements, styles, immediate) {
		if (elements === undefined || elements === null) {
			return;
		}
		if (elements.length === undefined) {
			elements = [elements];
		}
		
		var rules = utils.extend({}, styles);
		for (var i = 0; i < elements.length; i++) {
			var element = elements[i];
			if (element === undefined || element === null) {
				continue;
			}
			
			utils.foreach(rules, function(style, value) {
				var name = _getStyleName(style);
				if (element.style[name] !== value) {
					element.style[name] = value;
				}
			});
		}
	};
	
	function _getStyleName(name) {
		name = name.split('-');
		for (var i = 1; i < name.length; i++) {
			name[i] = name[i].charAt(0).toUpperCase() + name[i].slice(1);
		}
		return name.join('');
	}
})(chatease);

(function(chatease) {
	var utils = chatease.utils;
	
	utils.filter = function(keywords) {
		var _this = this,
			_re,
			_keywords = ''; // 'keyword1|keyword2|...'
		
		function _init() {
			if (utils.typeOf(keywords) == 'string' && keywords) {
				_keywords = keywords;
				_re = new RegExp(_keywords, 'ig');
			}
		}
		
		_this.replace = function(txt) {
			if (!_keywords || !_re) 
				return txt;
			return txt.replace(_re, '**');
		};
		
		_init();
	};
})(chatease);

(function(chatease) {
	chatease.events = {
		// General Events
		ERROR: 'error',
		
		// API Events
		CHATEASE_READY: 'chateaseReady',
		CHATEASE_SETUP_ERROR: 'chateaseSetupError',
		CHATEASE_RENDER_ERROR: 'chateaseRenderError',
		
		CHATEASE_STATE: 'chateaseState',
		CHATEASE_PROPERTY: 'chateaseProperty',
		
		CHATEASE_CONNECT: 'chateaseConnect',
		CHATEASE_INFO: 'chateaseInfo',
		CHATEASE_MESSAGE: 'chateaseMessage',
		CHATEASE_USER: 'chateaseUser',
		CHATEASE_JOIN: 'chateaseJoin',
		CHATEASE_LEFT: 'chateaseLeft',
		CHATEASE_CTRL: 'chateaseCtrl',
		CHATEASE_EXTERN: 'chateaseExtern',
		CHATEASE_NICKCLICK: 'chateaseNickClick',
		CHATEASE_CLOSE: 'chateaseClose',
		
		// View Events
		CHATEASE_VIEW_SEND: 'chateaseViewSend',
		CHATEASE_VIEW_PROPERTY: 'chateaseViewProperty',
		CHATEASE_VIEW_SHOWMORE: 'chateaseViewShowMore',
		CHATEASE_VIEW_CLEARSCREEN: 'chateaseViewClearScreen',
		CHATEASE_VIEW_NICKCLICK: 'chateaseViewNickClick',
		
		// Timer Events
		CHATEASE_TIMER: 'chateaseTimer',
		CHATEASE_TIMER_COMPLETE: 'chateaseTimerComplete'
	};
})(chatease);

(function(chatease) {
	var utils = chatease.utils,
		events = chatease.events;
	
	events.eventdispatcher = function(id) {
		var _id = id,
			_listeners = {},
			_globallisteners = [];
		
		this.addEventListener = function(type, listener, count) {
			try {
				if (!utils.exists(_listeners[type])) {
					_listeners[type] = [];
				}
				
				if (utils.typeOf(listener) === 'string') {
					listener = (new Function('return ' + listener))();
				}
				_listeners[type].push({
					listener: listener,
					count: count || null
				});
			} catch (err) {
				utils.log('error', err);
			}
			return false;
		};
		
		this.removeEventListener = function(type, listener) {
			if (!_listeners[type]) {
				return;
			}
			try {
				if (listener === undefined) {
					_listeners[type] = [];
					return;
				}
				var i;
				for (i = 0; i < _listeners[type].length; i++) {
					if (_listeners[type][i].listener.toString() === listener.toString()) {
						_listeners[type].splice(i, 1);
						break;
					}
				}
			} catch (err) {
				utils.log('error', err);
			}
			return false;
		};
		
		this.addGlobalListener = function(listener, count) {
			try {
 				if (utils.typeOf(listener) === 'string') {
					listener = (new Function('return ' + listener))();
				}
				_globallisteners.push({
					listener: listener,
					count: count || null
				});
			} catch (err) {
				utils.log('error', err);
			}
			return false;
		};
		
		this.removeGlobalListener = function(listener) {
			if (!listener) {
				return;
			}
			try {
				var i;
				for (i = _globallisteners.length - 1; i >= 0; i--) {
					if (_globallisteners[i].listener.toString() === listener.toString()) {
						_globallisteners.splice(i, 1);
					}
				}
			} catch (err) {
				utils.log('error', err);
			}
			return false;
		};
		
		
		this.dispatchEvent = function(type, data) {
			if (!data) {
				data = {};
			}
			utils.extend(data, {
				id: _id,
				version: chatease.version,
				type: type
			});
			if (chatease.debug === 'events') {
				utils.log(type, data);
			}
			_dispatchEvent(_listeners[type], data, type);
			_dispatchEvent(_globallisteners, data, type);
		};
		
		function _dispatchEvent(listeners, data, type) {
			if (!listeners) {
				return;
			}
			for (var index = 0; index < listeners.length; index++) {
				var listener = listeners[index];
				if (listener) {
					if (listener.count !== null && --listener.count === 0) {
						delete listeners[index];
					}
					try {
						listener.listener(data);
					} catch (err) {
						utils.log('Error handling "' + type +
							'" event listener [' + index + ']: ' + err.toString(), listener.listener, data);
					}
				}
			}
		}
	};
})(chatease);

(function(chatease) {
	var utils = chatease.utils,
		events = chatease.events;
	
	utils.timer = function(delay, repeatCount) {
		var _this = utils.extend(this, new events.eventdispatcher('utils.timer')),
			_intervalId,
			_currentCount = 0,
			_running = false;
		
		function _init() {
			_this.delay = delay || 50;
			_this.repeatCount = repeatCount || 0;
		}
		
		_this.start = function() {
			if (_running === false) {
				_intervalId = setInterval(_onTimer, _this.delay);
				_running = true;
			}
		};
		
		function _onTimer() {
			_currentCount++;
			_this.dispatchEvent(events.CHATEASE_TIMER);
			
			if (_this.repeatCount > 0 && _currentCount >= _this.repeatCount) {
				_this.stop();
				_this.dispatchEvent(events.CHATEASE_TIMER_COMPLETE);
			}
		}
		
		_this.stop = function() {
			if (_running) {
				clearInterval(_intervalId);
				_intervalId = 0;
				_running = false;
			}
		};
		
		_this.reset = function() {
			_this.stop();
			_currentCount = 0;
		};
		
		_this.currentCount = function() {
			return _currentCount;
		};
		
		_this.running = function() {
			return _running;
		};
		
		_init();
	};
})(chatease);

(function(chatease) {
	var utils = chatease.utils,
		events = chatease.events;
	
	var _insts = {},
		_eventMapping = {
		onError: events.ERROR,
		onReady: events.CHATEASE_READY,
		onConnect: events.CHATEASE_CONNECT,
		onIdent: events.CHATEASE_INFO,
		onMessage: events.CHATEASE_MESSAGE,
		onJoin: events.CHATEASE_JOIN,
		onLeft: events.CHATEASE_LEFT,
		onUser: events.CHATEASE_USER,
		onExtern: events.CHATEASE_EXTERN,
		onNickClick: events.CHATEASE_VIEW_NICKCLICK,
		onClose: events.CHATEASE_CLOSE
	};
	
	chatease.api = function(container) {
		var _this = utils.extend(this, new events.eventdispatcher('api')),
			_entity;
		
		_this.container = container;
		_this.id = container.id;
		
		function _init() {
			utils.foreach(_eventMapping, function(name, type) {
				_this[name] = function(callback) {
					_this.addEventListener(type, callback);
				};
			});
		}
		
		_this.setup = function(options) {
			utils.emptyElement(_this.container);
			
			chatease.debug = !!options.debug;
			
			_this.config = options;
			_this.config.id = _this.id;
			
			_this.embedder = new chatease.embed(_this);
			_this.embedder.addGlobalListener(_onEvent);
			_this.embedder.embed();
			
			return _this;
		};
		
		_this.setEntity = function(entity, renderName) {
			_entity = entity;
			
			_this.onSWFLoaded = _entity.setup;
			_this.onSWFOpen = _entity.onSWFOpen;
			_this.onSWFMessage = _entity.onSWFMessage;
			_this.onSWFError = _entity.onSWFError;
			_this.onSWFClose = _entity.onSWFClose;
			
			_this.send = _entity.send;
			_this.close = _entity.close;
			_this.getState = _entity.getState;
			_this.resize = _entity.resize;
		};
		
		function _onEvent(e) {
			_forward(e);
		}
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
		
		_init();
	};
	
	chatease.api.getInstance = function(identifier) {
		var _container;
		
		if (identifier == null) {
			identifier = 0;
		} else if (identifier.nodeType) {
			_container = identifier;
		} else if (utils.typeOf(identifier) === 'string') {
			_container = document.getElementById(identifier);
		}
		
		if (_container) {
			var inst = _insts[_container.id];
			if (!inst) {
				_insts[identifier] = inst = new chatease.api(_container);
			}
			return inst;
		} else if (utils.typeOf(identifier) === 'number') {
			return _insts[identifier];
		}
		
		return null;
	};
	
	chatease.api.displayError = function(message, config) {
		
	};
})(chatease);

(function(chatease) {
	chatease.core = {};
})(chatease);

(function(chatease) {
	chatease.core.states = {
		CONNECTED: 'connected',
		CLOSED: 'closed',
		ERROR: 'error'
	};
})(chatease);

(function(chatease) {
	chatease.core.message = {};
	
	var message = chatease.core.message;
	
	message.keys = {
		CMD:     'cmd',
		SEQ:     'seq',
		DATA:    'data',
		MODE:    'mode',
		USER:    'user',
		SUB:     'sub',
		CHANNEL: 'channel',
		GROUP:   'group',
		ERROR:   'error',
		
		ID:      'id',
		NAME:    'name',
		ICON:    'icon',
		ROLE:    'role',
		STAT:    'stat',
		STATUS:  'status',
		CODE:    'code'
	};
	
	message.cmds = {
		INFO:   'info',
		TEXT:   'text',
		USER:   'user',
		JOIN:   'join',
		LEFT:   'left',
		CTRL:   'ctrl',
		EXTERN: 'extern',
		PING:   'ping',
		PONG:   'pong',
		ERROR:  'error'
	};
	
	message.opts = {
		MUTE:   'mute',
		FORBID: 'forbid'
	};
	
	message.modes = {
		UNI:       0x00,
		MULTI:     0x01,
		BROADCAST: 0x02,
		OUTDATED:  0x80
	};
	
	message.roles = {
		VISITOR:   0x00,
		NORMAL:    0x01,
		VIP:       0x0E,
		ASSISTANT: 0x10,
		SECRETARY: 0x20,
		ANCHOR:    0x30,
		ADMIN:     0x40,
		SU_ADMIN:  0x80,
		SYSTEM:    0xC0
	};
	
	message.status = {
		BadRequest:          400,
		Unauthorized:        401,
		Forbidden:           403,
		NotFound:            404,
		MethodNotAllowed:    405,
		NotAcceptable:       406,
		ProxyAuthRequired:   407,
		RequestTimeout:      408,
		TooManyRequests:     429,
		
		InternalServerError: 500,
		NotImplemented:      501,
		BadGateway:          502,
		ServiceUnavailable:  503,
		GatewayTimeout:      504
	};
	
	message.parseControl = function(data) {
		var reg = new RegExp('^([a-z]+):([0-9]+)$', 'i')
		var arr = reg.exec(data);
		if (arr == null) {
			return null
		}
		
		return [arr[1], parseInt(arr[2])];
	};
})(chatease);

(function(chatease) {
	var core = chatease.core,
		skins = core.skins = {};
	
	skins.modes = {
		DEFAULT: 'def',
		MOBILE: 'mobile'
	};
})(chatease);

(function(chatease) {
	var utils = chatease.utils,
		events = chatease.events,
		core = chatease.core,
		message = core.message,
		roles = message.roles,
		skins = chatease.core.skins,
		skinModes = skins.modes,
		css = utils.css,
		
		WRAP_CLASS = 'cha-wrapper',
		SKIN_CLASS = 'cha-skin',
		RENDER_CLASS = 'cha-render',
		TITLE_CLASS = 'cha-title',
		CONSOLE_CLASS = 'cha-console',
		CONTROLS_CLASS = 'cha-controls',
		DIALOG_CLASS = 'cha-dialog',
		
		CHECKBOX_CLASS = 'cha-checkbox',
		BUTTON_CLASS = 'cha-button',
		
		AREA_CLASS = 'area',
		USER_CLASS = 'user',
		ICON_CLASS = 'icon',
		ROLE_CLASS = 'role',
		NICK_CLASS = 'nick',
		CONTEXT_CLASS = 'context',
		
		AREAS_CLASS = {
			0: 'uni',
			1: '',
			2: '',
			3: 'outdated'
		},
		ROLES_CLASS = {
			0:   'r-visitor',
			1:   'r-normal',
			14:  'r-vip',
			16:  'r-assistant',
			32:  'r-secretary',
			48:  'r-anchor',
			64:  'r-admin',
			128: 'r-suadmin',
			192: 'r-system'
		},
		
		// For all api instances
		CSS_SMOOTH_EASE = 'opacity .25s ease',
		CSS_100PCT = '100%',
		CSS_ABSOLUTE = 'absolute',
		CSS_RELATIVE = 'relative',
		CSS_NORMAL = 'normal',
		CSS_IMPORTANT = ' !important',
		CSS_HIDDEN = 'hidden',
		CSS_NONE = 'none',
		CSS_BLOCK = 'block',
		CSS_INLINE = 'inline',
		CSS_INLINE_BLOCK = 'inline-block';
	
	skins.def = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('skins.def'));
		
		function _init() {
			_this.name = skinModes.DEFAULT;
			_this.config = utils.extend({}, config);
			
			SKIN_CLASS += '-' + _this.name;
			
			css('.' + WRAP_CLASS, {
				width: CSS_100PCT,
				height: CSS_100PCT,
				'background-color': '#171717'
			});
			css('.' + WRAP_CLASS + ' *', {
				margin: '0',
				padding: '0',
				'font-family': 'Microsoft YaHei,arial,sans-serif',
				'font-size': '14px',
				'font-weight': CSS_NORMAL,
				'box-sizing': 'content-box'
			});
			
			css('.' + SKIN_CLASS + ' .' + CHECKBOX_CLASS, {
				color: '#E6E6E6',
				cursor: 'pointer'
			});
			css('.' + SKIN_CLASS + ' .' + CHECKBOX_CLASS + ' .icon', {
				'float': 'left',
				padding: '0 5px',
				width: '14px',
				height: '14px',
				'background-repeat': 'no-repeat',
				'background-position': 'center',
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOAgMAAABiJsVCAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAJUExURUxpcebm5ubm5kbBEu0AAAACdFJOUwCgoEVu0AAAABpJREFUCNdjYAABqVWrHBi0Vq1qII0AawMBACnPF0kf/g8sAAAAAElFTkSuQmCC)',
				display: CSS_INLINE_BLOCK
			});
			css('.' + SKIN_CLASS + ' .' + CHECKBOX_CLASS + '.checked .icon', {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAA40lEQVQ4T52SvXHCQBCF3wuUKDHp7QXYFZgOrBKgAqADOsDuRK7ALoEOGDqwk1UoSHSBZrTMMWhGY358w0YbvG9/3i7xYDByqloCmKfUMLPSe7/sQUuADmfNk4gwCTSzXZZli7ZtS5KvSWCE8jwvmqZZkVzHrv+CPRRCKAB89etcA38BjM+CA8lJzLuu25Ic3QJ/RORl4PBMRL5VdQPgbWjeRUcz+/Dev1dVVTjnNqo6HY54b1SQXDrnyrquRyGELYDnv6e6Z87MzCa9i8mgme2jeGjIrR2TXw7Ap4gsTp/zSBwBq1l6D5ci9L8AAAAASUVORK5CYII=)'
			});
			
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS, {
				padding: '0 10px',
				'font-style': CSS_NORMAL,
				'font-weight': CSS_NORMAL,
				'text-align': 'center',
				'text-transform': 'uppercase',
				'white-space': 'nowrap',
				'word-spacing': CSS_NORMAL,
				border: CSS_NONE,
				'border-radius': '2px',
				cursor: 'pointer',
				display: CSS_INLINE_BLOCK,
				'-webkit-font-smoothing': 'subpixel-antialiased',
				'-moz-osx-font-smoothing': 'grayscale',
				transition: '150ms ease-in-out',
				'transition-property': 'background-color, color'
			});
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS + '.red', {
				color: '#FFFFFF',
				'background-color': '#FF0046'
			});
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS + '.red:hover', {
				'background-color': '#97052D'
			});
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS + '.blue', {
				color: '#FFFFFF',
				'background-color': '#0B7EF4'
			});
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS + '.blue:hover', {
				'background-color': '#0966C3'
			});
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS + '.white', {
				color: '#000000',
				'background-color': '#FFFFFF'
			});
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS + '.white:hover', {
				'background-color': '#E0E0E0'
			});
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS + '.gray', {
				color: '#000000',
				'background-color': '#E0E0E0'
			});
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS + '.gray:hover', {
				'background-color': '#96A0B4'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS, {
				width: CSS_100PCT,
				height: CSS_100PCT,
				position: CSS_RELATIVE
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' object', {
				width: '0',
				height: '0',
				position: CSS_ABSOLUTE
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + TITLE_CLASS, {
				width: CSS_100PCT,
				height: '40px',
				'font-family': 'inherit',
				'font-weight': CSS_NORMAL,
				'text-align': 'center',
				'line-height': '40px',
				color: '#E6E6E6',
				'background-color': 'inherit',
				cursor: 'default',
				'pointer-events': CSS_NONE
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS, {
				color: '#242424',
				top: (_this.config.title ? 40 : 0) + 'px',
				right: '0',
				bottom: '100px',
				left: '0',
				position: CSS_ABSOLUTE,
				'background-color': '#F8F8F8',
				'overflow-x': CSS_HIDDEN,
				'overflow-y': _this.config.smoothing ? CSS_HIDDEN : 'scroll'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div', {
				padding: '0 6px ' + (_this.config.smoothing ? '6px' : '0') + ' 6px'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > div', {
				margin: '6px 0',
				'line-height': '20px'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + USER_CLASS, {
				cursor: 'pointer'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + AREA_CLASS, {
				'margin-right': '2px',
				'vertical-align': 'middle'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + AREA_CLASS + '.uni', {
				color: '#F76767'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + AREA_CLASS + '.outdated', {
				color: '#F76767'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ICON_CLASS, {
				'margin-right': '4px',
				width: '20px',
				height: '20px',
				display: CSS_INLINE_BLOCK,
				'vertical-align': 'middle'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLE_CLASS, {
				'margin-right': '2px',
				padding: '0 2px',
				font: 'normal 12px Microsoft YaHei,arial,sans-serif',
				'white-space': 'nowrap',
				'word-spacing': CSS_NORMAL,
				border: '1px solid #3CAFAB',
				'border-radius': '2px',
				'vertical-align': 'middle'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.VISITOR] + ' .' + ROLE_CLASS +
				', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.NORMAL] + ' .' + ROLE_CLASS +
				', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.SYSTEM] + ' .' + ROLE_CLASS, {
				display: CSS_NONE
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.VIP] + '1' + ' .' + ROLE_CLASS +
				', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.VIP] + '2' + ' .' + ROLE_CLASS +
				', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.VIP] + '3' + ' .' + ROLE_CLASS, {
				color: '#3CAFAB',
				'border-color': '#3CAFAB'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.VIP] + '4' + ' .' + ROLE_CLASS +
				', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.VIP] + '5' + ' .' + ROLE_CLASS +
				', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.VIP] + '6' + ' .' + ROLE_CLASS +
				', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.VIP] + '7' + ' .' + ROLE_CLASS, {
				color: '#77C773',
				'border-color': '#77C773'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.ASSISTANT] + ' .' + ROLE_CLASS +
				', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.SECRETARY] + ' .' + ROLE_CLASS +
				', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.ANCHOR] + ' .' + ROLE_CLASS, {
				color: '#5382E2',
				'border-color': '#5382E2'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.ADMIN] + ' .' + ROLE_CLASS +
				', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.SU_ADMIN] + ' .' + ROLE_CLASS, {
				color: '#F76767',
				'border-color': '#F76767'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + NICK_CLASS, {
				color: '#5382E2',
				'text-decoration': CSS_NONE
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.SYSTEM] +
				', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.SYSTEM] + ' .' + NICK_CLASS, {
				color: '#33CC00',
				cursor: 'default',
				'pointer-events': CSS_NONE
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + CONTEXT_CLASS, {
				'word-wrap': 'break-word',
				display: CSS_INLINE
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS, {
				height: '40px',
				right: '0',
				bottom: '60px',
				left: '0',
				position: CSS_ABSOLUTE,
				overflow: CSS_HIDDEN,
				'line-height': CSS_100PCT,
				'background-color': 'inherit'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' > *', {
				margin: '8px 0',
				'text-align': 'center',
				'line-height': '24px',
				display: CSS_BLOCK
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' .shieldtext', {
				'float': 'left'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' .shieldtext .icon', {
				padding: '5px'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' .clearscreen', {
				'float': 'right',
				width: '50px'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DIALOG_CLASS, {
				height: '60px',
				right: '0',
				bottom: '0',
				left: '0',
				position: CSS_ABSOLUTE,
				overflow: CSS_HIDDEN,
				'background-color': '#E0E0E0'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DIALOG_CLASS + ' .more', {
				display: CSS_NONE
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DIALOG_CLASS + ' textarea', {
				padding: '6px 10px',
				width: _this.config.width - 90 + 'px',
				height: '48px',
				resize: CSS_NONE,
				border: '0 none',
				'background-color': '#E6E6E6'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DIALOG_CLASS + ' .send', {
				width: '50px',
				height: CSS_100PCT,
				top: '0',
				right: '0',
				position: CSS_ABSOLUTE
			});
		}
		
		_this.resize = function(width, height) {
			var wrapper = document.getElementById(_this.config.id);
			var textInput = document.getElementById(_this.config.id + '-input');
			
			css.style(textInput, {
				width: wrapper.clientWidth - 90 + 'px'
			});
		};
		
		_init();
	};
})(chatease);

(function(chatease) {
	var utils = chatease.utils,
		events = chatease.events,
		core = chatease.core,
		message = core.message,
		roles = message.roles,
		skins = chatease.core.skins,
		skinModes = skins.modes,
		css = utils.css,
		
		WRAP_CLASS = 'cha-wrapper',
		SKIN_CLASS = 'cha-skin',
		RENDER_CLASS = 'cha-render',
		TITLE_CLASS = 'cha-title',
		CONSOLE_CLASS = 'cha-console',
		CONTROLS_CLASS = 'cha-controls',
		DIALOG_CLASS = 'cha-dialog',
		
		CHECKBOX_CLASS = 'cha-checkbox',
		BUTTON_CLASS = 'cha-button',
		
		AREA_CLASS = 'area',
		USER_CLASS = 'user',
		ICON_CLASS = 'icon',
		ROLE_CLASS = 'role',
		NICK_CLASS = 'nick',
		CONTEXT_CLASS = 'context',
		
		AREAS_CLASS = {
			0: 'uni',
			1: '',
			2: '',
			3: 'outdated'
		},
		ROLES_CLASS = {
			0:   'r-visitor',
			1:   'r-normal',
			14:  'r-vip',
			16:  'r-assistant',
			32:  'r-secretary',
			48:  'r-anchor',
			64:  'r-admin',
			128: 'r-suadmin',
			192: 'r-system'
		},
		
		// For all api instances
		CSS_SMOOTH_EASE = 'opacity .25s ease',
		CSS_100PCT = '100%',
		CSS_ABSOLUTE = 'absolute',
		CSS_RELATIVE = 'relative',
		CSS_NORMAL = 'normal',
		CSS_IMPORTANT = ' !important',
		CSS_HIDDEN = 'hidden',
		CSS_NONE = 'none',
		CSS_BLOCK = 'block',
		CSS_INLINE = 'inline',
		CSS_INLINE_BLOCK = 'inline-block';
	
	skins.mobile = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('skins.mobile'));
		
		function _init() {
			_this.name = skinModes.MOBILE;
			_this.config = utils.extend({}, config);
			
			SKIN_CLASS += '-' + _this.name;
			
			css('.' + WRAP_CLASS, {
				width: CSS_100PCT,
				height: CSS_100PCT,
				'background-color': '#171717'
			});
			css('.' + WRAP_CLASS + ' *', {
				margin: '0',
				padding: '0',
				'font-family': 'Microsoft YaHei,arial,sans-serif',
				'font-size': '14px',
				'font-weight': CSS_NORMAL,
				'box-sizing': 'content-box'
			});
			
			css('.' + SKIN_CLASS + ' .' + CHECKBOX_CLASS, {
				color: '#E6E6E6',
				cursor: 'pointer'
			});
			css('.' + SKIN_CLASS + ' .' + CHECKBOX_CLASS + ' .icon', {
				'float': 'left',
				padding: '0 5px',
				width: '14px',
				height: '14px',
				'background-repeat': 'no-repeat',
				'background-position': 'center',
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOAgMAAABiJsVCAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAJUExURUxpcebm5ubm5kbBEu0AAAACdFJOUwCgoEVu0AAAABpJREFUCNdjYAABqVWrHBi0Vq1qII0AawMBACnPF0kf/g8sAAAAAElFTkSuQmCC)',
				display: CSS_INLINE_BLOCK
			});
			css('.' + SKIN_CLASS + ' .' + CHECKBOX_CLASS + '.checked .icon', {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAA40lEQVQ4T52SvXHCQBCF3wuUKDHp7QXYFZgOrBKgAqADOsDuRK7ALoEOGDqwk1UoSHSBZrTMMWhGY358w0YbvG9/3i7xYDByqloCmKfUMLPSe7/sQUuADmfNk4gwCTSzXZZli7ZtS5KvSWCE8jwvmqZZkVzHrv+CPRRCKAB89etcA38BjM+CA8lJzLuu25Ic3QJ/RORl4PBMRL5VdQPgbWjeRUcz+/Dev1dVVTjnNqo6HY54b1SQXDrnyrquRyGELYDnv6e6Z87MzCa9i8mgme2jeGjIrR2TXw7Ap4gsTp/zSBwBq1l6D5ci9L8AAAAASUVORK5CYII=)'
			});
			
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS, {
				padding: '0 10px',
				'font-style': CSS_NORMAL,
				'font-weight': CSS_NORMAL,
				'text-align': 'center',
				'text-transform': 'uppercase',
				'white-space': 'nowrap',
				'word-spacing': CSS_NORMAL,
				border: CSS_NONE,
				'border-radius': '2px',
				cursor: 'pointer',
				display: CSS_INLINE_BLOCK,
				'-webkit-font-smoothing': 'subpixel-antialiased',
				'-moz-osx-font-smoothing': 'grayscale',
				transition: '150ms ease-in-out',
				'transition-property': 'background-color, color'
			});
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS + '.red', {
				color: '#FFFFFF',
				'background-color': '#FF0046'
			});
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS + '.red:hover', {
				'background-color': '#97052D'
			});
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS + '.blue', {
				color: '#FFFFFF',
				'background-color': '#0B7EF4'
			});
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS + '.blue:hover', {
				'background-color': '#0966C3'
			});
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS + '.white', {
				color: '#000000',
				'background-color': '#FFFFFF'
			});
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS + '.white:hover', {
				'background-color': '#E0E0E0'
			});
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS + '.gray', {
				color: '#000000',
				'background-color': '#E0E0E0'
			});
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS + '.gray:hover', {
				'background-color': '#96A0B4'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS, {
				width: CSS_100PCT,
				height: CSS_100PCT,
				position: CSS_RELATIVE,
				overflow: CSS_HIDDEN
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' object', {
				width: '0',
				height: '0',
				position: CSS_ABSOLUTE
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + TITLE_CLASS, {
				width: CSS_100PCT,
				height: '40px',
				'font-family': 'inherit',
				'font-weight': CSS_NORMAL,
				'text-align': 'center',
				'line-height': '40px',
				color: '#E6E6E6',
				'background-color': 'inherit',
				cursor: 'default',
				'pointer-events': CSS_NONE
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS, {
				color: '#242424',
				top: (_this.config.title ? 40 : 0) + 'px',
				right: '0',
				bottom: '40px',
				left: '0',
				position: CSS_ABSOLUTE,
				'background-color': '#F8F8F8',
				'overflow-x': CSS_HIDDEN,
				'overflow-y': _this.config.smoothing ? CSS_HIDDEN : 'scroll'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + '.more .' + CONSOLE_CLASS, {
				bottom: '130px'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div', {
				padding: '0 6px ' + (_this.config.smoothing ? '6px' : '0') + ' 6px'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > div', {
				margin: '6px 0',
				'line-height': '20px'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + USER_CLASS, {
				cursor: 'pointer'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + AREA_CLASS, {
				'margin-right': '2px',
				'vertical-align': 'middle'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + AREA_CLASS + '.uni', {
				color: '#F76767'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + AREA_CLASS + '.outdated', {
				color: '#F76767'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ICON_CLASS, {
				'margin-right': '4px',
				width: '20px',
				height: '20px',
				display: CSS_INLINE_BLOCK,
				'vertical-align': 'middle'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLE_CLASS, {
				'margin-right': '2px',
				padding: '0 2px',
				font: 'normal 12px Microsoft YaHei,arial,sans-serif',
				'white-space': 'nowrap',
				'word-spacing': CSS_NORMAL,
				border: '1px solid #3CAFAB',
				'border-radius': '2px',
				'vertical-align': 'middle'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.VISITOR] + ' .' + ROLE_CLASS +
				', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.NORMAL] + ' .' + ROLE_CLASS +
				', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.SYSTEM] + ' .' + ROLE_CLASS, {
				display: CSS_NONE
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.VIP] + '1' + ' .' + ROLE_CLASS +
				', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.VIP] + '2' + ' .' + ROLE_CLASS +
				', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.VIP] + '3' + ' .' + ROLE_CLASS, {
				color: '#3CAFAB',
				'border-color': '#3CAFAB'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.VIP] + '4' + ' .' + ROLE_CLASS +
				', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.VIP] + '5' + ' .' + ROLE_CLASS +
				', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.VIP] + '6' + ' .' + ROLE_CLASS +
				', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.VIP] + '7' + ' .' + ROLE_CLASS, {
				color: '#77C773',
				'border-color': '#77C773'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.ASSISTANT] + ' .' + ROLE_CLASS +
				', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.SECRETARY] + ' .' + ROLE_CLASS +
				', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.ANCHOR] + ' .' + ROLE_CLASS, {
				color: '#5382E2',
				'border-color': '#5382E2'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.ADMIN] + ' .' + ROLE_CLASS +
				', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.SU_ADMIN] + ' .' + ROLE_CLASS, {
				color: '#F76767',
				'border-color': '#F76767'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + NICK_CLASS, {
				color: '#5382E2',
				'text-decoration': CSS_NONE
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.SYSTEM] +
				', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.SYSTEM] + ' .' + NICK_CLASS, {
				color: '#33CC00',
				cursor: 'default',
				'pointer-events': CSS_NONE
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + CONTEXT_CLASS, {
				'word-wrap': 'break-word',
				display: CSS_INLINE
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS, {
				margin: '0',
				padding: '0',
				height: '90px',
				bottom: '-90px',
				right: '0',
				left: '0',
				position: CSS_ABSOLUTE,
				overflow: CSS_HIDDEN,
				'background-color': '#F8F8F8'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + '.more .' + CONTROLS_CLASS, {
				bottom: '0'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' > *', {
				'float': 'left',
				margin: '8px 0 0 8px',
				padding: '0',
				width: '60px',
				color: '#8A8A8A',
				'font-size': '12px',
				'text-align': 'center',
				'white-space': CSS_NORMAL,
				'background-color': 'transparent'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' > *:hover', {
				'background-color': 'transparent'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' > * .icon', {
				'float': CSS_NONE,
				margin: '0 4px',
				padding: '0',
				width: '50px',
				height: '50px',
				border: '1px solid #E6E6E6',
				'border-radius': '5px',
				'background-repeat': 'no-repeat',
				'background-position': 'center',
				display: CSS_INLINE_BLOCK
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' .shieldtext .icon', {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACeklEQVRYR8VX0XUTMRAcVQAdQCrAVJCkAkIFkAqyqSChAg8VkFQAqQCnApwKEiqIXYF4c0h6ynG6k87mWe/dl6Td2dHu7J7DgZc7sH9UAzCzhXPu2Hv/GoC+BYCVAnDOrb33DySfWgMaBWBmbwFcATgLTqfsr51zXC6Xt1MH4/4gADNThEsAn2sN9c6JiUuSP6bu/wPAzE4AfK+MeMq+AJyT3JQOvgBgZor425TVxv01gNMSiATAzPTOivx/rBXJ0yHDHYDw5o97or0UwBeS1/3NCIAALvYQ+l0oTdGeL+WVGD7rl6oL0T/v6PwrgOuxZCsmoZlZKLk5GB5UqiRTxBIsAB9SnTu38d7flURKDEjNjmd4l/OTGHWoIImWxGtoyY/yoFPPBNDMhP5dI4CtHMl5eMKfQZprzNyQPM8B+JpbvTOq69UM59FMAqEnkEq9agBxT1JZrfKV0qX3brCho5JqzsmBj9L4INmifu5S4EcC0BLFlqQa1a7RR9CXAiA6ayPJ6e8/3W8AU/OAKuRNRtl9VEJdzDdKtHZyGuYESXdc73MtGHuTXs/ZRAC1jSgCyFlLrNQmg5mlysu7YU0/iACkdr9mMpDf3fbngSlVlKSKLSVhrh/Kh34DKhHSlXBYf3MgX2Z2A+BT4fYTyaO9VsGQo4kG1SVcY/UMuZGcL4pT8QgTtyS7YXWHRqbrXT6NARjTh8iCREkl3CLlcp4qZwzA0JygeV85olzoRCdogtS0tqPKhsU2Xvov6I/mUjldGpzzQ1cUYH0lNmRDU5MCSGuoCiSXGh5Fr0prXfODES0GpVOty47KU5+m4heDSDxf/W9Yq3Kt5w4O4A9JNgxutXqzoAAAAABJRU5ErkJggg==)'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' .shieldtext.checked .icon', {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB0klEQVRYR81X0VHCUBDcV4F0oHYgFQAVqBUIFXh2YAdZKhA7wAqECsQOpAOtIM4ySSZ5JOQBedGbyUcyye3e3r27i8Mfm/tjfAQTMLOBc26UpukYwA2Aq+xSDF/ZtXHOrdI0XZP8DgmulYCZCegBgAEYhDgFIHACeCUpco12kICZCTQJBK19zTlnSZLMm3zUEpDcAF4A3J0DXvp2CWBWl5Y9Ahn4e5bnjvB3blYkJ77DOgKLLOddgue+FiRnZccVAmamClf0MW1CcpUD+ARUsZcx0XVcSV7vEegp+hx3SHKjm0IBM4uZe1/UOUkd8QoB5WUUWf7cvTql6q1CoI/85wQ2JIc+AbXPi54U2JJUi/9fKVC7vO1JAQ2pqa+AHqj/92H3JBVwJQUaQCrE2HXwQ7IY634n1Ax/jCzBE0nh7MwnIGbqULHacXH+awnooZlp3fqIoMIngLG/EzQtJCKhzthVPWy13OT9vxxc40qWKaFKPTcdbwCmTUtq2054znxYA3guz/66tHZNQHkW6WUbcGMRllmama/ATs7sHdVJbloyDq7fTUUdqoCKSHksVqmuTkkIAYGqdwT96RxLrI3AIBZwUA0cG80p77f+G57i9JhvfgHYZaIhgJsBwwAAAABJRU5ErkJggg==)'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' .clearscreen .icon', {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACx0lEQVRYR8WWjXETQQyF31YAHWAqACogqYBQAaEClAogFVhUAFRAqICkAkgFmA5CBcd8N6ubvb0/nwmOZjyJz7e7T9J7T5v0wJEe+HwdFYCZnUj6Lsnd/YLkjw3gWtJLSb/dfXNUAGZ2JulrbvlHd7djA9hJepIBvHD3nz0AZvZc0lbSF3f/fJ/kNLNzSZ/ynrfuzlltdBwwsztJj/Lzp+6+y6DeSaJkLeJDwszK7C9g4BgADngm6Y+kjbvfmdkHSe8lXbo7/6+OYo9Y2yY3BuCxJIhxFdmaWTwDNBVaFXn9L0nsQ3xzd8jYxX+VoZkhNSr3Jp/4tubXJADQp5Roibbb7c0+qWepwRmCMtM6uBRArK7kKIBcOhwr2Hrt7qdzICqml69iPgDh7yCmAMDSyCQW9dhb75RtlnLjdGMBAPboqWkKQFhmudGkEqhYlDZLFzJH38s9IDImNFRB+ZaZsQGmVMZrd78ayZw2/ZCEeZFhq5bcdwyIvcJf+KmzYb7MkZA2sAGBDAc+kLOFK8jsxt2Zdr3IfEJ6rMeKe1I8WIaZ8dgrh99KOlnyiryGbLpKrgaQyYY7RraLh5ccqSs0C4A+ppQo26ZpGg6klOFqbT8p7R6ZhxnR/24OTHKgmt01aGYFhGOvjs0T0msfF8NoIOUpGdYqoMxIs/0sZVwpKq5h3ZArf59TAVlOejjt2acCZhaewj0jVNVhWOIAbH2V36bXl5mEVOi8rkSWHKbUtiZ7AdOQ6G5Be1UgXjKzshLxeLBZPox3zwozirWjHjFrRFUfKR3sDUdj45h0qIK5QVUYt63Giys4X09XDaMxRucMAREt4TX6ixUDoudwRe8Hl5BVLRixVlg9NvWYclcppV3TNDH/Wd67gq0yogVtkzmtwZziul0vWbxLrrbiifYABiBkzoc7wSTx/qkFc1U55Ld7qcAhB8eav3TZQDD7fopnAAAAAElFTkSuQmCC)'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DIALOG_CLASS, {
				height: '40px',
				right: '0',
				bottom: '0',
				left: '0',
				position: CSS_ABSOLUTE,
				'background-color': '#E0E0E0'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + '.more .' + DIALOG_CLASS, {
				bottom: '90px'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DIALOG_CLASS + ' .more', {
				'float': 'left',
				margin: '8px 5px',
				padding: '0',
				width: '24px',
				height: '24px',
				'background-repeat': 'no-repeat',
				'background-position': 'center',
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABpklEQVRIS7VW7VHCQBTc68AS0gGxA6xAS8AKfFYgVuBagXRAqEA6ECogJdjBOZt5lzlDEkDJm8nkRy5v9+37uoARM7MihHAfY5wDKACUfnwHoA4hbGOMG5L1kJvQ90GOAbwAuANQAdjqIfmt82Z2A0Cgeh4AfAJ47QM6AjAz/UAAK72T0yGGDmYAFsImKUKt/QIwMx1aihVJyXC2mZnkk/MlSZFrrAXImJdDrF06hdWruUcjYm0kDYD/KJ1HmZtZEz5JydhrWSRzEUkACqkmKXkGzcxEQgBK7tg5+SlILkLGflCa5OkCAFWZZCwFoAoQmt6jdi6Ayy5VdgKQrqtuefUhXQigPDUSKetKSNNE18hBVjiVACLJvFzVxW8ApGPX8lHR/SaCz3kJy/cQgDr5LwCq/7ZHEsDkEk2e5MnLVElVh1670Q4AbqcfFVnNTjfsHCQtmv+O6y/vh2byXnvhrH11Hi+cbGKmSD4AvJ8aIb5kngA8nlyZGYgqSzNdc3/tt4d96lK/bcxijCKjZ+Or8mjT9d4qOkBykK4tM/+293mvwqjGri0/+EslZhJDzTgAAAAASUVORK5CYII=)',
				display: CSS_BLOCK
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DIALOG_CLASS + ' textarea', {
				margin: '5px 0',
				padding: '5px',
				width: _this.config.width - 114 + 'px',
				height: '20px',
				resize: CSS_NONE,
				border: '0 none',
				'line-height': '20px',
				'background-color': '#F8F8F8'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DIALOG_CLASS + ' .send', {
				'float': 'right',
				margin: '5px',
				padding: '0 5px',
				width: '50px',
				height: '30px',
				top: '0',
				right: '0',
				position: CSS_ABSOLUTE
			});
		}
		
		_this.resize = function(width, height) {
			var wrapper = document.getElementById(_this.config.id);
			var textInput = document.getElementById(_this.config.id + '-input');
			
			css.style(textInput, {
				width: wrapper.clientWidth - 114 + 'px'
			});
		};
		
		_init();
	};
})(chatease);

(function(chatease) {
	var core = chatease.core,
		renders = core.renders = {};
	
	renders.modes = {
		DEFAULT: 'def',
		NONE: 'none'
	};
})(chatease);

(function(chatease) {
	var utils = chatease.utils,
		events = chatease.events,
		core = chatease.core,
		message = core.message,
		modes = message.modes,
		roles = message.roles,
		renders = core.renders,
		renderModes = renders.modes,
		css = utils.css,
		
		RENDER_CLASS = 'cha-render',
		TITLE_CLASS = 'cha-title',
		CONSOLE_CLASS = 'cha-console',
		CONTENT_CLASS = 'cha-content',
		CONTROLS_CLASS = 'cha-controls',
		DIALOG_CLASS = 'cha-dialog',
		
		CHECKBOX_CLASS = 'cha-checkbox',
		BUTTON_CLASS = 'cha-button',
		
		AREA_CLASS = 'area',
		USER_CLASS = 'user',
		ICON_CLASS = 'icon',
		ROLE_CLASS = 'role',
		NICK_CLASS = 'nick',
		CONTEXT_CLASS = 'context',
		
		AREAS_CLASS = {
			0: 'uni',
			1: '',
			2: ''
		},
		ROLES_CLASS = {
			0:   'r-visitor',
			1:   'r-normal',
			2:   'r-vip1',
			4:   'r-vip2',
			6:   'r-vip3',
			8:   'r-vip4',
			10:  'r-vip5',
			12:  'r-vip6',
			14:  'r-vip7',
			16:  'r-assistant',
			32:  'r-secretary',
			48:  'r-anchor',
			64:  'r-admin',
			128: 'r-suadmin',
			192: 'r-system'
		},
		
		areas = {
			0: '[密语]',
			1: '',
			2: ''
		},
		titles = {
			0:   '',
			1:   '',
			2:   'VIP1',
			4:   'VIP2',
			6:   'VIP3',
			8:   'VIP4',
			10:  'VIP5',
			12:  'VIP6',
			14:  'VIP7',
			16:  '助理',
			32:  '秘书',
			48:  '主播',
			64:  '管理员',
			128: '超管',
			192: ''
		}
		
		// For all api instances
		CSS_SMOOTH_EASE = 'opacity .25s ease',
		CSS_100PCT = '100%',
		CSS_ABSOLUTE = 'absolute',
		CSS_IMPORTANT = ' !important',
		CSS_HIDDEN = 'hidden',
		CSS_NONE = 'none',
		CSS_BLOCK = 'block';
	
	renders.def = function(layer, config) {
		var _this = utils.extend(this, new events.eventdispatcher('renders.def')),
			_defaults = {
				title: 'CHATEASE ' + chatease.version
			},
			_titleLayer,
			_consoleLayer,
			_contentLayer,
			_controlsLayer,
			_dialogLayer,
			_moreLayer,
			_shieldButton,
			_clearButton,
			_moreButton,
			_textInput,
			_sendButton,
			_bscroll;
		
		function _init() {
			_this.name = renderModes.DEFAULT;
			_this.config = utils.extend({}, _defaults, config);
			
			if (utils.isMSIE('(8|9)')) {
				layer.innerHTML = ''
					+ '<object id="cha-swf" name="cha-swf" align="middle" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000">'
						+ '<param name="movie" value="' + _this.config.swf + '">'
						+ '<param name="quality" value="high">'
						+ '<param name="bgcolor" value="#ffffff">'
						+ '<param name="allowscriptaccess" value="sameDomain">'
						+ '<param name="allowfullscreen" value="true">'
						+ '<param name="wmode" value="transparent">'
						+ '<param name="FlashVars" value="id=' + _this.config.id + '">'
					+ '</object>';
				
				_object = _this.WebSocket = layer.firstChild;
			}/* else { 
				_object = utils.createElement('object');
				_object.id = _object.name = 'cha-swf';
				_object.align = 'middle';
				_object.innerHTML = ''
					+ '<param name="quality" value="high">'
					+ '<param name="bgcolor" value="#ffffff">'
					+ '<param name="allowscriptaccess" value="sameDomain">'
					+ '<param name="allowfullscreen" value="true">'
					+ '<param name="wmode" value="transparent">'
					+ '<param name="FlashVars" value="id=' + _this.config.id + '">';
				
				if (utils.isMSIE()) {
					_object.classid = 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000';
					_object.movie = _this.config.swf;
				} else {
					_object.type = 'application/x-shockwave-flash';
					_object.data = _this.config.swf;
				}
				
				_this.WebSocket = _object;
				_object.style.width = _object.style.height = '0';
				layer.appendChild(_object);
			}*/
			
			_buildComponents();
		}
		
		function _buildComponents() {
			// title
			if (_this.config.title) {
				_titleLayer = utils.createElement('div', TITLE_CLASS);
				layer.appendChild(_titleLayer);
				
				_titleLayer.innerHTML = _this.config.title;
			}
			
			// console
			_consoleLayer = utils.createElement('div', CONSOLE_CLASS);
			_consoleLayer.id = _this.config.id + '-console';
			layer.appendChild(_consoleLayer);
			
			_contentLayer = utils.createElement('div', CONTENT_CLASS);
			_consoleLayer.appendChild(_contentLayer);
			
			if (_this.config.smoothing) {
				_bscroll = new BScroll(_consoleLayer);
			}
			
			// controls
			_controlsLayer = utils.createElement('div', CONTROLS_CLASS);
			layer.appendChild(_controlsLayer);
			
			_shieldButton = _getCheckBox('屏蔽消息', CHECKBOX_CLASS + ' shieldtext', events.CHATEASE_VIEW_PROPERTY, { key: 'shield' }, false);
			_shieldButton.id = _this.config.id + '-shieldtext';
			_controlsLayer.appendChild(_shieldButton);
			
			_clearButton = _getButton('清屏', BUTTON_CLASS + ' white clearscreen', events.CHATEASE_VIEW_CLEARSCREEN, null);
			_controlsLayer.appendChild(_clearButton);
			
			// dialog
			_dialogLayer = utils.createElement('div', DIALOG_CLASS);
			layer.appendChild(_dialogLayer);
			
			_moreButton = _getCheckBox('', 'more', events.CHATEASE_VIEW_PROPERTY, { key: 'more' }, false);
			_dialogLayer.appendChild(_moreButton);
			
			_textInput = utils.createElement('textarea');
			_textInput.id = _this.config.id + '-input';
			_dialogLayer.appendChild(_textInput);
			
			_sendButton = utils.createElement('button', BUTTON_CLASS + ' blue send');
			_dialogLayer.appendChild(_sendButton);
			
			// textarea
			_textInput.setAttribute('placeholder', '输入聊天内容');
			if (_this.config.maxLength) {
				_textInput.setAttribute('maxlength', _this.config.maxLength);
			}
			
			var handler = (function() {
				return function(event) {
					var e = window.event || event;
					if (e.keyCode != 13) {
						return;
					}
					
					if (e.ctrlKey) {
						_textInput.value += '\r\n';
						return;
					}
					
					_this.send();
					
					if (window.event) {
						e.returnValue = false;
					} else {
						e.preventDefault();
					}
				};
			})();
			
			try {
				_textInput.addEventListener('keypress', handler);
			} catch (err) {
				_textInput.attachEvent('onkeypress', handler);
			}
			
			// send button
			_sendButton.innerHTML = '发送';
			
			var clickHandler = (function() {
				return function() {
					_this.send();
				};
			})();
			
			try {
				_sendButton.addEventListener('click', clickHandler);
			} catch (err) {
				_sendButton.attachEvent('onclick', clickHandler);
			}
		}
		
		function _getCheckBox(label, clazz, event, data, checked) {
			var box = utils.createElement('div', clazz);
			box.setAttribute('value', !!checked);
			box.innerHTML = '<span class="icon"></span>' + label;
			
			var handler = (function(event, data) {
				return function(e) {
					var value = box.getAttribute('value');
					var checked = value == 'true' ? false : true;
					
					box.setAttribute('value', checked);
					if (checked) {
						utils.addClass(box, 'checked');
					} else {
						utils.removeClass(box, 'checked');
					}
					
					_this.dispatchEvent(event, utils.extend({ value: checked }, data));
				};
			})(event, data);
			
			try {
				box.addEventListener('click', handler);
			} catch (err) {
				box.attachEvent('onclick', handler);
			}
			
			return box;
		}
		
		function _getButton(label, clazz, event, data) {
			var box = utils.createElement('div', clazz);
			box.innerHTML = '<span class="icon"></span>' + label;
			
			var handler = (function(event, data) {
				return function(e) {
					_this.dispatchEvent(event, data);
				};
			})(event, data);
			
			try {
				box.addEventListener('click', handler);
			} catch (err) {
				box.attachEvent('onclick', handler);
			}
			
			return box;
		}
		
		_this.setup = function() {
			if (utils.isMSIE('(8|9)')) {
				if (_object.setup) {
					_object.setup(_this.config);
					_this.dispatchEvent(events.CHATEASE_READY, { id: _this.config.id });
				}
			} else {
				_this.dispatchEvent(events.CHATEASE_READY, { id: _this.config.id });
			}
		};
		
		_this.show = function(user, text, mode) {
			var role = _parseRole(user.role);
			
			// create box
			var box = utils.createElement('div', ROLES_CLASS[role]);
			
			// area
			var area = areas[mode & 0x7F];
			if (area && role != roles.SYSTEM) {
				var span = utils.createElement('span', AREA_CLASS + ' ' + AREAS_CLASS[mode & 0x7F]);
				span.innerHTML = area;
				box.appendChild(span);
			}
			
			var tmp = utils.createElement('span', USER_CLASS);
			box.appendChild(tmp);
			
			// icon
			if (user.icon) {
				var icon = utils.createElement('img', ICON_CLASS);
				icon.src = user.icon;
				tmp.appendChild(icon);
			}
			
			// title
			var title = titles[role];
			if (title) {
				var span = utils.createElement('span', ROLE_CLASS);
				span.innerHTML = title;
				tmp.appendChild(span);
			}
			
			// nickname
			var a = utils.createElement('a', NICK_CLASS);
			a.innerHTML = user.name + ': ';
			tmp.appendChild(a);
			
			var nickHandler = (function(user) {
				return function(e) {
					_textInput.value = '/r ' + user.name + ' ';
					_this.dispatchEvent(events.CHATEASE_VIEW_NICKCLICK, { user: user });
				};
			})(user);
			
			try {
				tmp.addEventListener('click', nickHandler);
			} catch (err) {
				tmp.attachEvent('onclick', nickHandler);
			}
			
			// context
			var ctx = utils.createElement('div', CONTEXT_CLASS);
			ctx.innerHTML = '<span>' + text + '</span>';
			box.appendChild(ctx);
			
			// check records
			if (_contentLayer.childNodes.length >= _this.config.maxRecords) {
				_contentLayer.removeChild(_contentLayer.childNodes[0]);
			}
			
			// append this box
			if (mode & modes.OUTDATED) {
				_contentLayer.insertBefore(box, _contentLayer.childNodes[0]);
			} else {
				_contentLayer.appendChild(box);
			}
			
			if (_this.config.smoothing) {
				_this.refresh();
			} else {
				_consoleLayer.scrollTop = _consoleLayer.scrollHeight;
			}
		};
		
		function _parseRole(role) {
			var r = 0;
			
			if (utils.typeOf(role) != 'number') {
				role = parseInt(role);
				if (role == NaN || role < 0) {
					return r;
				}
			}
			
			if (role & roles.SYSTEM) {
				r = role & roles.SYSTEM;
			} else if (role & roles.ANCHOR) {
				r = role & roles.ANCHOR;
			} else if (role & roles.VIP) {
				r = role & roles.VIP;
			} else if (role & roles.NORMAL) {
				r = roles.NORMAL;
			}
			
			return r;
		}
		
		_this.send = function() {
			_this.dispatchEvent(events.CHATEASE_VIEW_SEND, { data: {
				data: _textInput.value,
				mode: modes.MULTI
			}});
			
			_this.clearInput();
		};
		
		_this.refresh = function() {
			if (_this.config.smoothing) {
				if (_consoleLayer.clientHeight < _contentLayer.clientHeight) {
					css.style(_contentLayer, {
						'transition-timing-function': 'cubic-bezier(0.165, 0.84, 0.44, 1)',
						'transition-duration': '100ms',
						'transform': 'translate(0px, ' + (_consoleLayer.clientHeight - _contentLayer.clientHeight) + 'px) translateZ(0px)'
					});
				}
				
				_bscroll.refresh();
			} else {
				_consoleLayer.scrollTop = _consoleLayer.scrollHeight;
			}
		};
		
		_this.clearInput = function() {
			_textInput.value = '';
		};
		
		_this.clearScreen = function() {
			utils.emptyElement(_contentLayer);
		};
		
		_this.element = function() {
			return _object;
		};
		
		_this.resize = function(width, height) {
			
		};
		
		_this.destroy = function() {
			
		};
		
		_init();
	};
})(chatease);

(function(chatease) {
	var utils = chatease.utils,
		events = chatease.events,
		core = chatease.core,
		message = core.message,
		roles = message.roles,
		renders = core.renders,
		renderModes = renders.modes,
		css = utils.css,
		
		RENDER_CLASS = 'cha-render',
		TITLE_CLASS = 'cha-title',
		CONSOLE_CLASS = 'cha-console',
		CONTROLS_CLASS = 'cha-controls',
		DIALOG_CLASS = 'cha-dialog',
		
		CHECKBOX_CLASS = 'cha-checkbox',
		BUTTON_CLASS = 'cha-button',
		
		INPUT_CLASS = 'cha-input',
		
		NICK_SYSTEM_CLASS = 'cha-system',
		NICK_MYSELF_CLASS = 'cha-myself',
		
		TITLE_VISITOR_CLASS = 'ttl-visitor',
		TITLE_NORMAL_CLASS = 'ttl-normal',
		TITLE_VIP_CLASS = 'ttl-vip',
		
		TITLE_ASSISTANT_CLASS = 'ttl-assistant',
		TITLE_SECRETARY_CLASS = 'ttl-secretary',
		TITLE_ANCHOR_CLASS = 'ttl-anchor',
		
		TITLE_ADMIN_CLASS = 'ttl-admin',
		TITLE_SU_ADMIN_CLASS = 'ttl-suadmin',
		TITLE_SYSTEM_CLASS = 'ttl-system',
		
		// For all api instances
		CSS_SMOOTH_EASE = 'opacity .25s ease',
		CSS_100PCT = '100%',
		CSS_ABSOLUTE = 'absolute',
		CSS_IMPORTANT = ' !important',
		CSS_HIDDEN = 'hidden',
		CSS_NONE = 'none',
		CSS_BLOCK = 'block';
	
	renders.none = function(layer, config) {
		var _this = utils.extend(this, new events.eventdispatcher('renders.none')),
			_defaults = {},
			_titleLayer,
			_consoleLayer,
			_controlsLayer,
			_dialogLayer,
			_textInput,
			_sendButton;
		
		function _init() {
			_this.name = renderModes.NONE;
			_this.config = utils.extend({}, _defaults, config);
			
			if (utils.isMSIE('(8|9)')) {
				layer.innerHTML = ''
					+ '<object id="cha-swf" name="cha-swf" align="middle" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000">'
						+ '<param name="movie" value="' + _this.config.swf + '">'
						+ '<param name="quality" value="high">'
						+ '<param name="bgcolor" value="#ffffff">'
						+ '<param name="allowscriptaccess" value="sameDomain">'
						+ '<param name="allowfullscreen" value="true">'
						+ '<param name="wmode" value="transparent">'
						+ '<param name="FlashVars" value="id=' + _this.config.id + '">'
					+ '</object>';
				
				_object = _this.WebSocket = layer.firstChild;
			}/* else {
				_object = utils.createElement('object');
				_object.id = _object.name = 'cha-swf';
				_object.align = 'middle';
				_object.innerHTML = ''
					+ '<param name="quality" value="high">'
					+ '<param name="bgcolor" value="#ffffff">'
					+ '<param name="allowscriptaccess" value="sameDomain">'
					+ '<param name="allowfullscreen" value="true">'
					+ '<param name="wmode" value="transparent">'
					+ '<param name="FlashVars" value="id=' + _this.config.id + '">';
				
				if (utils.isMSIE()) {
					_object.classid = 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000';
					_object.movie = _this.config.swf;
				} else {
					_object.type = 'application/x-shockwave-flash';
					_object.data = _this.config.swf;
				}
				
				_this.WebSocket = _object;
				_object.style.width = _object.style.height = '0';
				layer.appendChild(_object);
			}*/
		}
		
		_this.setup = function() {
			if (utils.isMSIE('(8|9)')) {
				if (_object.setup) {
					_this.config.debug = true;
					_object.setup(_this.config);
					_this.dispatchEvent(events.CHATEASE_READY, { id: _this.config.id });
				}
			} else {
				_this.dispatchEvent(events.CHATEASE_READY, { id: _this.config.id });
			}
		};
		
		_this.show = function(text, user, mode) {
			
		};
		
		_this.send = function() {
			
		};
		
		_this.clearInput = function() {
			
		};
		
		_this.clearScreen = function() {
			
		};
		
		_this.element = function() {
			return _object;
		};
		
		_this.resize = function(width, height) {
			
		};
		
		_this.destroy = function() {
			
		};
		
		_init();
	};
})(chatease);

(function(chatease) {
	chatease.core.components = {};
})(chatease);

(function(chatease) {
	var utils = chatease.utils,
		css = utils.css,
		events = chatease.events,
		core = chatease.core,
		message = core.message,
		roles = message.roles,
		components = core.components,
		skins = chatease.core.skins,
		skinModes = skins.modes,
		
		SKIN_CLASS = 'cha-skin',
		BUBBLE_CLASS = 'cha-bubble',
		RENDER_CLASS = 'cha-render',
		CONSOLE_CLASS = 'cha-console',
		
		AREA_CLASS = 'area',
		USER_CLASS = 'user',
		ICON_CLASS = 'icon',
		ROLE_CLASS = 'role',
		NICK_CLASS = 'nick',
		CONTEXT_CLASS = 'context',
		
		ROLES_CLASS = {
			0:   'r-visitor',
			1:   'r-normal',
			14:  'r-vip',
			16:  'r-assistant',
			32:  'r-secretary',
			48:  'r-anchor',
			64:  'r-admin',
			128: 'r-suadmin',
			192: 'r-system'
		},
		
		// For all api instances
		CSS_SMOOTH_EASE = 'opacity .25s ease',
		CSS_100PCT = '100%',
		CSS_ABSOLUTE = 'absolute',
		CSS_RELATIVE = 'relative',
		CSS_NORMAL = 'normal',
		CSS_IMPORTANT = ' !important',
		CSS_HIDDEN = 'hidden',
		CSS_NONE = 'none',
		CSS_BLOCK = 'block',
		CSS_INLINE_BLOCK = 'inline-block';
	
	components.bubble = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('components.bubble')),
			_defaults = {
				name: '',
				skin: skinModes.DEFAULT
			};
		
		function _init() {
			_this.config = utils.extend({}, _defaults, config);
			if (!_this.config.name) {
				return;
			}
			
			SKIN_CLASS += '-' + _this.config.skin;
			BUBBLE_CLASS += '-' + _this.config.name;
			
			css('.' + SKIN_CLASS + '.' + BUBBLE_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + AREA_CLASS +
				', .' + SKIN_CLASS + '.' + BUBBLE_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLE_CLASS, {
				//display: CSS_NONE
			});
			
			css('.' + SKIN_CLASS + '.' + BUBBLE_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ICON_CLASS, {
				'float': 'left',
				'margin-top': '4px',
				width: '32px',
				height: '32px'
			});
			
			css('.' + SKIN_CLASS + '.' + BUBBLE_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + CONTEXT_CLASS, {
				margin: '4px 0 10px 36px',
				display: CSS_BLOCK
			});
			css('.' + SKIN_CLASS + '.' + BUBBLE_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + CONTEXT_CLASS + ' span', {
				padding: '8px 12px',
				'border-radius': '5px',
				'background-color': '#D9DDD4',
				display: CSS_INLINE_BLOCK
			});
			
			css('.' + SKIN_CLASS + '.' + BUBBLE_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.SYSTEM] + ' .' + CONTEXT_CLASS, {
				margin: '0',
				display: CSS_INLINE_BLOCK
			});
			css('.' + SKIN_CLASS + '.' + BUBBLE_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.SYSTEM] + ' .' + CONTEXT_CLASS + ' span', {
				padding: '0',
				'border-radius': '0',
				'background-color': 'inherit'
			});
		}
		
		_this.resize = function(width, height) {
			
		};
		
		_init();
	};
})(chatease);

(function(chatease) {
	var utils = chatease.utils,
		events = chatease.events,
		core = chatease.core;
	
	core.entity = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('core.entity')),
			_model,
			_view,
			_controller;
		
		function _init() {
			_this.id = config.id;
			
			_this.model = _model = new core.model(config);
			_this.view = _view = new core.view(_model);
			_this.controller = _controller = new core.controller(_model, _view);
			
			_controller.addGlobalListener(_forward);
			
			_initializeAPI();
		}
		
		function _initializeAPI() {
			_this.onSWFOpen = _controller.onOpen;
			_this.onSWFMessage = _controller.onMessage;
			_this.onSWFError = _controller.onError;
			_this.onSWFClose = _controller.onClose;
			
			_this.send = _controller.send;
			_this.close = _controller.close;
			_this.getState = _model.getState;
			_this.resize = _view.resize;
		}
		
		_this.setup = function() {
			setTimeout(function() {
				_controller.setup();
			}, 0);
		};
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
		
		_this.destroy = function() {
			if (_controller) {
				_controller.stop();
			}
			if (_view) {
				_view.destroy();
			}
			if (_model) {
				_model.destroy();
			}
		};
		
		_init();
	};
})(chatease);

(function(chatease) {
	var utils = chatease.utils,
		events = chatease.events,
		core = chatease.core,
		states = core.states;
	
	var user = function() {
		var _this = this,
			_defaults = {
				id: 0,
				name: '',
				icon: '',
				role: 0
			},
			_active,
			_interval;
		
		function _init() {
			utils.extend(_this, _defaults);
			
			_active = 0;
			_interval = 0;
		}
		
		_this.update = function(info) {
			utils.extend(_this, info);
			
			_interval = _getInterval(_this.role);
		};
		
		function _getInterval(role) {
			if (role & 0xF0) {
				return 0;
			}
			
			var d = 2000;
			
			if (role) {
				var vip = role >> 1;
				d = 1000 - vip * 100;
			}
			
			return d;
		}
		
		_this.limited = function() {
			var now = new Date().getTime();
			if (now < _active + _interval) {
				return true;
			}
			
			_active = now;
			return false;
		};
		
		_init();
	};
	
	var channel = function() {
		var _this = this,
			_defaults = {
				id: 0,
				stat: 0,
				group: 0
			},
			_userlist,
			_sanctions;
		
		function _init() {
			utils.extend(_this, _defaults);
			
			_userlist = {};
			_sanctions = {};
		}
		
		_this.update = function(info) {
			utils.extend(_this, info);
		};
		
		_this.add = function(usr) {
			_userlist[usr.id] = usr;
		};
		
		_this.remove = function(usr) {
			delete _userlist[usr.id];
		};
		
		_this.find = function(id) {
			return _userlist[id];
		};
		
		_this.freeze = function(id, opt, mgr, d) {
			var san = _sanctions[id];
			if (san == undefined) {
				san = {};
				_sanctions[id] = san;
			}
			
			san[opt] = {
				manager: mgr,
				until: Math.floor(new Date().getTime() / 1000) + d
			}
		};
		
		_this.unfreeze = function(id, opt) {
			var san = _sanctions[id];
			if (san) {
				delete san[opt];
			}
		};
		
		_this.limited = function(id, opt) {
			var san = _sanctions[id];
			if (san) {
				var item = san[opt];
				if (item) {
					return Math.floor(new Date().getTime() / 1000) < item.until;
				}
			}
			
			return false;
		};
		
		_init();
	};
	
	core.model = function(config) {
		 var _this = utils.extend(this, new events.eventdispatcher('core.model')),
		 	_defaults = {},
		 	_state = states.CLOSED,
		 	_properties;
		
		function _init() {
			_this.config = utils.extend({}, _defaults, config);
			
			_properties = {
				user: new user(),
				channel: new channel(),
				shield: false
			};
		}
		
		_this.setState = function(state) {
			if (state === _state) {
				return;
			}
			_state = state;
			_this.dispatchEvent(events.CHATEASE_STATE, { state: state });
		};
		
		_this.getState = function() {
			return _state;
		};
		
		_this.setProperty = function(key, value) {
			if (_properties.hasOwnProperty(key) == true) {
				_properties[key] = value;
				_this.dispatchEvent(events.CHATEASE_PROPERTY, { key: key, value: value });
			}
		};
		
		_this.getProperty = function(key) {
			return _properties[key];
		};
		
		_this.getConfig = function(name) {
			return _this.config[name];
		};
		
		_this.destroy = function() {
			
		};
		
		_init();
  };
})(chatease);

(function(chatease) {
	var utils = chatease.utils,
		events = chatease.events,
		core = chatease.core,
		states = core.states,
		message = core.message,
		roles = message.roles,
		components = core.components,
		renders = core.renders,
		renderModes = renders.modes,
		skins = core.skins,
		css = utils.css,
		
		WRAP_CLASS = 'cha-wrapper',
		SKIN_CLASS = 'cha-skin',
		BUBBLE_CLASS = 'cha-bubble',
		RENDER_CLASS = 'cha-render',
		CONTEXTMENU_CLASS = 'cha-contextmenu';
	
	core.view = function(model) {
		var _this = utils.extend(this, new events.eventdispatcher('core.view')),
			_wrapper,
			_object,
			_renderLayer,
			_contextmenuLayer,
			_bubble,
			_render,
			_skin,
			_errorOccurred = false;
		
		function _init() {
			_wrapper = utils.createElement('div', WRAP_CLASS + ' ' + SKIN_CLASS + '-' + model.getConfig('skin').name 
				+ ' ' + BUBBLE_CLASS + '-' + model.getConfig('bubble').name);
			_wrapper.id = model.getConfig('id');
			//_wrapper.tabIndex = 0; 
			
			_renderLayer = utils.createElement('div', RENDER_CLASS);
			_contextmenuLayer = utils.createElement('div', CONTEXTMENU_CLASS);
			
			_wrapper.appendChild(_renderLayer);
			_wrapper.appendChild(_contextmenuLayer);
			
			_initComponents();
			_initRender();
			_initSkin();
			
			if (_render && _render.name == renderModes.NONE) {
				return;
			}
			
			var replace = document.getElementById(model.getConfig('id'));
			replace.parentNode.replaceChild(_wrapper, replace);
			
			try {
				_wrapper.addEventListener('keydown', _onKeyDown);
				window.addEventListener('resize', _onResize);
			} catch (err) {
				_wrapper.attachEvent('onkeydown', _onKeyDown);
				window.attachEvent('onresize', _onResize);
			}
		}
		
		function _initComponents() {
			// bubble
			var cfg = utils.extend({}, model.getConfig('bubble'), {
				skin: model.getConfig('skin').name
			});
			
			try {
				_bubble = new components.bubble(cfg);
			} catch (err) {
				utils.log('Failed to init "bubble" component!');
			}
		}
		
		function _initRender() {
			var cfg = utils.extend({}, model.getConfig('render'), {
				id: model.getConfig('id'),
				url: model.getConfig('url'),
				width: model.getConfig('width'),
				height: model.getConfig('height'),
				maxLength: model.getConfig('maxLength'),
				maxRecords: model.getConfig('maxRecords'),
				smoothing: model.getConfig('smoothing')
			});
			
			try {
				_render = _this.render = new renders[cfg.name](_renderLayer, cfg);
				_render.addEventListener(events.CHATEASE_READY, _forward);
				_render.addEventListener(events.CHATEASE_VIEW_SEND, _forward);
				_render.addEventListener(events.CHATEASE_VIEW_PROPERTY, _onViewProperty);
				_render.addEventListener(events.CHATEASE_VIEW_CLEARSCREEN, _forward);
				_render.addEventListener(events.CHATEASE_VIEW_NICKCLICK, _forward);
				_render.addEventListener(events.CHATEASE_RENDER_ERROR, _onRenderError);
			} catch (err) {
				utils.log('Failed to init render ' + cfg.name + '!');
			}
		}
		
		function _initSkin() {
			var cfg = utils.extend({}, model.getConfig('skin'), {
				id: model.getConfig('id'),
				width: model.config.width,
				height: model.config.height,
				title: !!_render.config.title,
				smoothing: model.getConfig('smoothing')
			});
			
			try {
				_skin = new skins[cfg.name](cfg);
			} catch (err) {
				utils.log('Failed to init skin ' + cfg.name + '!');
			}
		}
		
		_this.setup = function() {
			// Ignore components & skin failure.
			if (!_render) {
				_this.dispatchEvent(events.CHATEASE_SETUP_ERROR, { message: 'Render not available!', name: model.config.render.name });
				return;
			}
			
			_render.setup();
			_this.resize();
		};
		
		_this.show = function(user, text, mode) {
			if (_render && ((user.role & roles.SYSTEM) || !model.getProperty('shield'))) {
				_render.show(user, text, mode);
			}
		};
		
		function _onKeyDown(e) {
			if (e.ctrlKey || e.metaKey) {
				return true;
			}
			
			switch (e.keyCode) {
				case 13: // enter
					if (_render) {
						_render.send();
					}
					break;
					
				default:
					break;
			}
			
			if (/13/.test(e.keyCode)) {
				// Prevent keypresses from scrolling the screen
				e.preventDefault ? e.preventDefault() : e.returnValue = false;
				return false;
			}
		}
		
		function _onResize(e) {
			_this.resize();
		}
		
		_this.resize = function(width, height) {
			setTimeout(function() {
				if (_render) {
					_render.resize(width, height);
				}
				if (_skin) {
					_skin.resize(width, height);
				}
			}, 0);
		};
		
		_this.destroy = function() {
			if (_wrapper) {
				_wrapper.removeEventListener('keydown', _onKeyDown);
			}
			if (_render) {
				_render.destroy();
			}
		};
		
		function _onViewProperty(e) {
			switch (e.key) {
				case 'more':
					if (e.value) {
						utils.addClass(_renderLayer, 'more');
					} else {
						utils.removeClass(_renderLayer, 'more');
					}
					
					_render.refresh();
					break;
					
				case 'shield':
					var label = e.value ? '取消屏蔽' : '屏蔽消息';
					var shieldtext = document.getElementById(model.getConfig('id') + '-shieldtext');
					shieldtext.innerHTML = '<span class="icon"></span>' + label;
					break;
			}
			
			_forward(e);
		}
		
		function _onRenderError(e) {
			_forward(e);
		}
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
		
		_init();
	};
})(chatease);

(function(chatease) {
	var utils = chatease.utils,
		crypt = utils.crypt,
		events = chatease.events,
		core = chatease.core,
		states = core.states,
		message = core.message,
		keys = message.keys,
		cmds = message.cmds,
		opts = message.opts,
		modes = message.modes,
		roles = message.roles,
		status = message.status,
		
		SYSTEM = { 'id': -1, 'name': '[系统]', role: roles.SYSTEM };
	
	core.controller = function(model, view) {
		var _this = utils.extend(this, new events.eventdispatcher('core.controller')),
			_ready = false,
			_websocket,
			_timer,
			_filter,
			_responders,
			_sequence,
			_subject,
			_retrycount = 0;
		
		function _init() {
			_responders = {};
			_sequence = 0;
			_subject = '';
			
			model.addEventListener(events.CHATEASE_STATE, _modelStateHandler);
			model.addEventListener(events.CHATEASE_PROPERTY, _modelPropertyHandler);
			
			view.addEventListener(events.CHATEASE_READY, _onReady);
			view.addEventListener(events.CHATEASE_SETUP_ERROR, _onSetupError);
			
			view.addEventListener(events.CHATEASE_VIEW_SEND, _onViewSend);
			view.addEventListener(events.CHATEASE_VIEW_PROPERTY, _onViewProperty);
			view.addEventListener(events.CHATEASE_VIEW_CLEARSCREEN, _onClearScreen);
			view.addEventListener(events.CHATEASE_VIEW_NICKCLICK, _onNickClick);
			
			view.addEventListener(events.CHATEASE_RENDER_ERROR, _onRenderError);
		}
		
		function _modelStateHandler(e) {
			switch (e.state) {
				case states.CONNECTED:
					if (chatease.debug) {
						view.show(SYSTEM, '聊天室已连接…');
					} else {
						utils.log('聊天室已连接…');
					}
					
					_retrycount = 0;
					_this.dispatchEvent(events.CHATEASE_CONNECT);
					break;
					
				case states.CLOSED:
					if (chatease.debug) {
						view.show(SYSTEM, '聊天室连接已断开！');
					} else {
						utils.log('聊天室连接已断开！');
					}
					
					_this.dispatchEvent(events.CHATEASE_CLOSE, { channel: { id: model.channel } });
					_reconnect();
					break;
					
				case states.ERROR:
					if (chatease.debug) {
						view.show(SYSTEM, '聊天室异常！');
					} else {
						utils.log('聊天室异常！');
					}
					
					_this.dispatchEvent(events.ERROR, { message: 'Chat room error!', channel: { id: model.channel } });
					break;
					
				default:
					_this.dispatchEvent(events.ERROR, { message: 'Unknown model state!', state: e.state });
					break;
			}
		}
		
		function _modelPropertyHandler(e) {
			_forward(e);
		}
		
		function _onReady(e) {
			if (!_ready) {
				utils.log('Chat ready!');
				
				_ready = true;
				_forward(e);
				
				if (!chatease.debug) {
					view.show(SYSTEM, '聊天室已连接！');
				}
				
				_connect();
				
				window.addEventListener('beforeunload', function(ev) {
					if (_websocket && model.getState() == states.CONNECTED) {
						//_websocket.close();
					}
				});
			}
		}
		
		_this.setup = function(e) {
			if (!_ready) {
				view.setup();
			}
		};
		
		function _connect() {
			if (_websocket) {
				if (model.getState() == states.CONNECTED) {
					utils.log('Websocket had connected already.');
					return;
				}
				
				if (_websocket.readyState == WebSocket.CONNECTING || _websocket.readyState == WebSocket.OPEN) {
					_websocket.close();
				}
			}
			
			view.render.clearScreen();
			
			if (chatease.debug) {
				view.show(SYSTEM, '聊天室连接中…');
			} else {
				utils.log('聊天室连接中…');
			}
			
			try {
				window.WebSocket = window.WebSocket || window.MozWebSocket;
				if (window.WebSocket) {
					_websocket = new WebSocket(model.config.url, 'binary');
					_websocket.binaryType = 'arraybuffer';
					
					_websocket.onopen = _this.onOpen;
					_websocket.onmessage = _this.onMessage;
					_websocket.onerror = _this.onError;
					_websocket.onclose = _this.onClose;
				} else {
					_websocket = view.render.WebSocket;
					_websocket.connect();
				}
			} catch (err) {
				utils.log('Failed to initialize websocket: ' + err);
				_error(status.NOT_ACCEPTABLE, null);
			}
		}
		
		_this.send = function(data, responder) {
			if (!_websocket || model.getState() != states.CONNECTED) {
				_connect();
				return;
			}
			
			if (utils.typeOf(data) != 'object' || data.hasOwnProperty(keys.CMD) == false || data.hasOwnProperty(keys.DATA) == false) {
				_error(status.BadRequest, data);
				return;
			}
			
			var usr = model.getProperty('user');
			if (usr.limited()) {
				_error(status.TooManyRequests, data);
				return;
			}
			
			var ch = model.getProperty('channel');
			if (usr.role < ch.stat || ch.limited(usr.id, opts.MUTE)) {
				_error(status.Forbidden, data);
				return;
			}
			
			if (responder) {
				_sequence++;
				_responders[_sequence] = responder;
				
				data.seq = _sequence;
			}
			
			var json = JSON.stringify(data);
			
			try {
				var arr = crypt.stringToUTF8ByteArray(json);
				var ab = new Uint8Array(arr);
				
				_websocket.send(ab.buffer);
				
				return;
			} catch (err) {
				/* void */
			}
			
			try {
				_websocket.send(json);
			} catch (err) {
				/* void */
			}
		};
		
		_this.onOpen = function(e) {
			model.setState(states.CONNECTED);
		};
		
		_this.onMessage = function(e) {
			var json = e.data;
			
			if (utils.typeOf(e.data) === 'arraybuffer') {
				var tmp = new Uint8Array(e.data);
				json = crypt.UTF8ByteArrayToString(tmp);
			}
			
			var data;
			try {
				data = eval('(' + json + ')');
			} catch (err) {
				utils.log('Failed to parse JSON. \nError: ' + err + '\ndata: ' + e.data);
				return;
			}
			
			if (data.hasOwnProperty(keys.SEQ) && _responders.hasOwnProperty(data.seq)) {
				var responder = _responders[data.seq];
				var fn = responder.result;
				if (data.cmd == cmds.ERROR) {
					fn = responder.status;
				}
				
				if (fn) {
					fn.call(null, data);
				}
				
				delete _responders[data.seq];
			}
			
			var usr = model.getProperty('user');
			var ch = model.getProperty('channel');
			
			switch (data.cmd) {
				case cmds.INFO:
					usr.update(utils.extend({}, data.user));
					ch.update(utils.extend({}, data.channel));
					
					if (chatease.debug) {
						view.show(SYSTEM, '已加入房间（' + ch.id + '）。');
					} else {
						utils.log('已加入房间（' + ch.id + '）。');
					}
					
					if (usr.role < ch.stat) {
						view.show(SYSTEM, '您所在的用户组不能发言！');
					}
					
					_this.dispatchEvent(events.CHATEASE_INFO, data);
					break;
					
				case cmds.TEXT:
					try {
						if (!_filter) {
							_filter = new utils.filter(model.config.keywords);
						}
						data.data = _filter.replace(data.data);
					} catch (err) {
						// Ignore this failure.
						utils.log('Failed to execute filter.');
					}
					
					ch.add(data.user);
					
					view.show(data.user, data.data, data.mode);
					_this.dispatchEvent(events.CHATEASE_MESSAGE, data);
					break;
					
				case cmds.USER:
					_this.dispatchEvent(events.CHATEASE_USER, data);
					break;
					
				case cmds.JOIN:
					ch.add(data.user);
					
					view.show(data.user, data.user.name + ' 进入房间。');
					_this.dispatchEvent(events.CHATEASE_JOIN, data);
					break;
					
				case cmds.LEFT:
					ch.remove(data.user);
					
					view.show(data.user, data.user.name + ' 离开房间。');
					_this.dispatchEvent(events.CHATEASE_LEFT, data);
					break;
					
				case cmds.CTRL:
					var arr = message.parseControl(data.data);
					if (arr) {
						var opt = arr[0], d = arr[1];
						if (d == 0) {
							ch.unfreeze(data.sub, opt);
						} else {
							ch.freeze(data.sub, opt, data.user, d);
						}
						
						if (data.sub == usr.id) {
							switch (opt) {
								case opts.MUTE:
									view.show(SYSTEM, '您已被' + (d ? '' : '解除') + '禁言' + (d ? d + '秒' : '') + '。');
									break;
									
								case opts.FORBID:
									view.show(SYSTEM, '您已被限制进入该房间' + d + '秒。');
									model.config.maxRetries = 0;
									_this.close();
									break;
							}
						}
					}
					break;
					
				case cmds.EXTERN:
					_this.dispatchEvent(events.CHATEASE_EXTERN, data);
					break;
					
				case cmds.ERROR:
					_error(data.error.code, data);
					break;
					
				default:
					utils.log('Unknown cmd: ' + data.cmd + ', ignored.');
					break;
			}
		};
		
		_this.onError = function(e) {
			model.setState(states.ERROR);
		};
		
		_this.onClose = function(e) {
			model.setState(states.CLOSED);
		};
		
		function _error(code, params) {
			var status = _getErrorStatus(code);
			if (status) {
				view.show(SYSTEM, status);
			}
			
			var data = {
				raw: 'error',
				error: {
					code: code,
					status: status
				}
			};
			utils.foreach(params, function(k, v) {
				if (k != 'cmd' && k != 'raw' && k != 'error') {
					data[k] = v;
				}
			});
			
			_this.dispatchEvent(events.ERROR, data);
		}
		
		function _getErrorStatus(code) {
			var err = '';
			
			switch (code) {
				case status.BadRequest:
					err = '错误请求！';
					break;
				case status.Unauthorized:
					err = '请先登录！';
					break;
				case status.Forbidden:
					err = '权限错误！';
					break;
				case status.NotFound:
					err = '未知请求！';
					break;
				case status.NotAcceptable:
					err = '无法识别！';
					break;
				case status.RequestTimeout:
					err = '请求超时！';
					break;
				case status.TooManyRequests:
					err = '操作频繁！';
					break;
					
				case status.InternalServerError:
					err = '内部错误！';
					break;
				case status.NotImplemented:
					err = '无法识别！';
					break;
				case status.BadGateway:
					err = '网关错误！';
					break;
				case status.ServiceUnavailable:
					err = '服务过载！';
					break;
				case status.GatewayTimeout:
					err = '网关超时！';
					break;
				default:
					break;
			}
			
			return err;
		}
		
		function _reconnect() {
			if (model.config.maxRetries < 0 || _retrycount < model.config.maxRetries) {
				var delay = Math.ceil(model.config.retryDelay + Math.random() * 3000);
				
				if (chatease.debug) {
					view.show(SYSTEM, '正在准备重连，' + delay / 1000 + '秒...');
				} else {
					utils.log('正在准备重连，' + delay / 1000 + '秒...');
				}
				
				_retrycount++;
				_startTimer(delay);
			}
		}
		
		function _startTimer(delay) {
			if (!_timer) {
				_timer = new utils.timer(delay, 1);
				_timer.addEventListener(events.CHATEASE_TIMER, function(e) {
					_connect();
				});
			}
			_timer.delay = delay;
			_timer.reset();
			_timer.start();
		}
		
		function _stopTimer() {
			if (_timer) {
				_timer.stop();
			}
		}
		
		function _onViewSend(e) {
			var text = e.data.data;
			if (!text) {
				view.show(SYSTEM, '请输入内容！');
				return;
			}
			
			var data = {
				cmd: cmds.TEXT,
				data: text,
				mode: e.data.mode
			};
			
			var arr = text.match(/^\/r\s(\S+)\s(.*)/i);
			if (arr && arr.length > 2) {
				var ch = model.getProperty('channel');
				var usr = ch.find(_subject);
				if (!usr) {
					_error(status.NotFound, null);
					return;
				}
				
				data.mode = modes.UNI;
				data.sub = _subject;
				
				text = arr[2];
			}
			
			if (model.config.maxLength >= 0) {
				text = text.substr(0, model.config.maxLength);
			}
			
			text = utils.trim(text);
			if (!text) {
				return;
			}
			
			data.data = text;
			
			_this.send(data);
		}
		
		function _onViewProperty(e) {
			model.setProperty(e.key, e.value);
		}
		
		function _onClearScreen(e) {
			view.render.clearScreen();
			_forward(e);
		}
		
		function _onNickClick(e) {
			var ch = model.getProperty('channel');
			_subject = e.user.id;
			_this.dispatchEvent(events.CHATEASE_NICKCLICK, { user: e.user, channel: { id: ch.id, group: ch.group, stat: ch.stat } });
		}
		
		_this.close = function() {
			if (_websocket) {
				_websocket.close();
			}
		};
		
		function _onSetupError(e) {
			model.setState(states.ERROR);
			_forward(e);
		}
		
		function _onRenderError(e) {
			model.setState(states.ERROR);
			_forward(e);
		}
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
		
		_init();
	};
})(chatease);

(function(chatease) {
	var utils = chatease.utils,
		events = chatease.events;
	
	var embed = chatease.embed = function(api) {
		var _this = utils.extend(this, new events.eventdispatcher('embed')),
			_config = {},
			_embedder = null,
			_errorOccurred = false;
		
		function _init() {
			utils.foreach(api.config.events, function(e, cb) {
				var fn = api[e];
				if (utils.typeOf(fn) === 'function') {
					fn.call(api, cb);
				}
			});
		}
		
		_this.embed = function() {
			try {
				_config = new embed.config(api.config);
				_embedder = new embed.embedder(api, _config);
			} catch (e) {
				utils.log('Failed to init embedder!');
				_this.dispatchEvent(events.CHATEASE_SETUP_ERROR, { message: 'Failed to init embedder!', render: _config.render.name });
				return;
			}
			_embedder.addGlobalListener(_onEvent);
			_embedder.embed();
		};
		
		_this.errorScreen = function(message) {
			if (_errorOccurred) {
				return;
			}
			
			_errorOccurred = true;
			chatease.api.displayError(message, _config);
		};
		
		function _onEvent(e) {
			switch (e.type) {
				case events.ERROR:
				case events.CHATEASE_SETUP_ERROR:
				case events.CHATEASE_RENDER_ERROR:
					_this.errorScreen(e.message);
					_this.dispatchEvent(events.ERROR, e);
					break;
				default:
					_forward(e);
					break;
			}
		}
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
		
		_init();
	};
})(chatease);

(function(chatease) {
	var utils = chatease.utils,
		events = chatease.events,
		embed = chatease.embed,
		core = chatease.core,
		renderModes = core.renders.modes,
		skinModes = core.skins.modes;
	
	embed.config = function(config) {
		var _defaults = {
			url: 'ws://' + window.location.host + '/ch1?token=',
			width: 640,
			height: 400,
			keywords: '',
	 		maxLength: 50,  // -1: no limit
	 		maxRecords: 50,
	 		maxRetries: -1, // -1: always
	 		retryDelay: 3000,
	 		smoothing: false,
	 		debug: false,
			render: {
				name: renderModes.DEFAULT,
				title: 'CHATEASE ' + chatease.version,
				swf: 'swf/chatease.swf'
			},
			skin: {
				name: skinModes.DEFAULT
			},
			bubble: {
				name: ''
			}
		},
		
		_config = utils.extend({}, _defaults, config);
		_config.smoothing = _config.smoothing && utils.isMobile() && BScroll;
		
		return _config;
	};
	
	embed.config.addConfig = function(oldConfig, newConfig) {
		return utils.extend(oldConfig, newConfig);
	};
})(chatease);

(function(chatease) {
	var utils = chatease.utils,
		events = chatease.events,
		embed = chatease.embed,
		core = chatease.core;
	
	embed.embedder = function(api, config) {
		var _this = utils.extend(this, new events.eventdispatcher('embed.embedder'));
		
		_this.embed = function() {
			var entity = new core.entity(config);
			entity.addGlobalListener(_onEvent);
			entity.setup();
			api.setEntity(entity, config.render.name);
		};
		
		function _onEvent(e) {
			_forward(e);
		}
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
	};
})(chatease);
