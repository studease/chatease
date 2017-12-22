chatease = function() {
	if (chatease.api) {
		return chatease.api.getInstance.apply(this, arguments);
	}
};

chatease.version = '1.0.33';

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
		CHATEASE_INDENT: 'chateaseIdent',
		CHATEASE_MESSAGE: 'chateaseMessage',
		CHATEASE_JOIN: 'chateaseJoin',
		CHATEASE_LEFT: 'chateaseLeft',
		CHATEASE_USERS: 'chateaseUsers',
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
		onIdent: events.CHATEASE_INDENT,
		onMessage: events.CHATEASE_MESSAGE,
		onJoin: events.CHATEASE_JOIN,
		onLeft: events.CHATEASE_LEFT,
		onUsers: events.CHATEASE_USERS,
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
	chatease.core.protocol = {};
	
	var protocol = chatease.core.protocol;
	
	protocol.cmds = {
		TEXT:    'text',
		MUTE:    'mute',
		KICKOUT: 'kickout',
		EXTERN:  'extern',
		PING:    'ping'
	};
	
	protocol.raws = {
		IDENT:   'ident',
		TEXT:    'text',
		JOIN:    'join',
		LEFT:    'left',
		USERS:   'users',
		MUTE:    'mute',
		KICKOUT: 'kickout',
		EXTERN:  'extern',
		ERROR:   'error',
		PONG:    'pong'
	};
	
	protocol.roles = {
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
	
	protocol.channelStates = {
		NORMAL: 0x00,
		MUTED:  0x01,
		LOCKED: 0x03
	};
	
	protocol.punishments = {
		MUTED:      0x01,
		KICKED_OUT: 0x03
	};
	
	protocol.errors = {
		BAD_REQUEST:           400,
		UNAUTHORIZED:          401,
		FORBIDDEN:             403,
		NOT_FOUND:             404,
		NOT_ACCEPTABLE:        406,
		REQUEST_TIMEOUT:       408,
		CONFLICT:              409,
		EXPECTATION_FAILED:    417,
		
		INTERNAL_SERVER_ERROR: 500,
		NOT_IMPLEMENTED:       501,
		BAD_GATEWAY:           502,
		SERVICE_UNAVAILABLE:   503,
		GATEWAY_TIMEOUT:       504
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
		skins = chatease.core.skins,
		skinmodes = skins.modes,
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
		CSS_RELATIVE = 'relative',
		CSS_NORMAL = 'normal',
		CSS_IMPORTANT = ' !important',
		CSS_HIDDEN = 'hidden',
		CSS_NONE = 'none',
		CSS_BLOCK = 'block',
		CSS_INLINE_BLOCK = 'inline-block';
	
	skins.def = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('skins.def'));
		
		function _init() {
			_this.name = skinmodes.DEFAULT;
			
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
				display: 'inline-block'
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
				display: 'inline-block',
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
				'overflow-y': 'scroll'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div', {
				margin: '6px',
				'line-height': '20px'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div.' + NICK_SYSTEM_CLASS
				+ ', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div.' + NICK_SYSTEM_CLASS + ' > a', {
				'font-style': CSS_NORMAL,
				'font-weight': CSS_NORMAL,
				color: '#33CC00',
				cursor: 'default',
				'pointer-events': CSS_NONE
			});
			/*css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div.' + NICK_MYSELF_CLASS, {
				
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div.' + NICK_MYSELF_CLASS + ' > a', {
				
			});*/
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .icon', {
				'float': 'left',
				'margin-right': '4px',
				width: '20px',
				height: '20px',
				display: CSS_BLOCK
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .icon img', {
				width: CSS_100PCT,
				height: CSS_100PCT,
				display: CSS_INLINE_BLOCK
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title', {
				'margin-right': '2px',
				padding: '0 2px',
				font: 'normal 12px Microsoft YaHei,arial,sans-serif',
				'white-space': 'nowrap',
				'word-spacing': CSS_NORMAL,
				border: '1px solid #3CAFAB',
				'border-radius': '2px',
				'vertical-align': 'middle'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_VISITOR_CLASS
				+ ', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_NORMAL_CLASS
				+ ', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_SYSTEM_CLASS, {
				display: CSS_NONE
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_VIP_CLASS + '1'
				+ ', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_VIP_CLASS + '2'
				+ ', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_VIP_CLASS + '3', {
				color: '#3CAFAB',
				'border-color': '#3CAFAB'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_VIP_CLASS + '4'
				+ ', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_VIP_CLASS + '5'
				+ ', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_VIP_CLASS + '6'
				+ ', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_VIP_CLASS + '7', {
				color: '#77C773',
				'border-color': '#77C773'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_ASSISTANT_CLASS
				+ ', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_SECRETARY_CLASS
				+ ', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_ANCHOR_CLASS, {
				color: '#5382E2',
				'border-color': '#5382E2'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_ADMIN_CLASS
				+ ', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_SU_ADMIN_CLASS, {
				color: '#F76767',
				'border-color': '#F76767'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > a', {
				color: '#5382E2',
				'text-decoration': CSS_NONE,
				cursor: 'pointer'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .context', {
				'word-break': 'break-all',
				'word-wrap': 'break-word'
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
				display: 'block'
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
		skins = chatease.core.skins,
		skinmodes = skins.modes,
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
		CSS_RELATIVE = 'relative',
		CSS_NORMAL = 'normal',
		CSS_IMPORTANT = ' !important',
		CSS_HIDDEN = 'hidden',
		CSS_NONE = 'none',
		CSS_BLOCK = 'block',
		CSS_INLINE_BLOCK = 'inline-block';
	
	skins.mobile = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('skins.mobile'));
		
		function _init() {
			_this.name = skinmodes.MOBILE;
			
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
				display: 'inline-block'
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
				display: 'inline-block',
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
				'overflow-y': 'scroll'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + '.more .' + CONSOLE_CLASS, {
				bottom: '120px'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div', {
				margin: '6px',
				'line-height': '20px'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div.' + NICK_SYSTEM_CLASS
				+ ', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div.' + NICK_SYSTEM_CLASS + ' > a', {
				'font-style': CSS_NORMAL,
				'font-weight': CSS_NORMAL,
				color: '#33CC00',
				cursor: 'default',
				'pointer-events': CSS_NONE
			});
			/*css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div.' + NICK_MYSELF_CLASS, {
				
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div.' + NICK_MYSELF_CLASS + ' > a', {
				
			});*/
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .icon', {
				'float': 'left',
				'margin-right': '4px',
				width: '20px',
				height: '20px',
				display: CSS_BLOCK
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .icon img', {
				width: CSS_100PCT,
				height: CSS_100PCT,
				display: CSS_INLINE_BLOCK
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title', {
				'margin-right': '2px',
				padding: '0 2px',
				font: 'normal 12px Microsoft YaHei,arial,sans-serif',
				'white-space': 'nowrap',
				'word-spacing': CSS_NORMAL,
				border: '1px solid #3CAFAB',
				'border-radius': '2px',
				'vertical-align': 'middle'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_VISITOR_CLASS
				+ ', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_NORMAL_CLASS
				+ ', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_SYSTEM_CLASS, {
				display: CSS_NONE
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_VIP_CLASS + '1'
				+ ', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_VIP_CLASS + '2'
				+ ', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_VIP_CLASS + '3', {
				color: '#3CAFAB',
				'border-color': '#3CAFAB'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_VIP_CLASS + '4'
				+ ', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_VIP_CLASS + '5'
				+ ', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_VIP_CLASS + '6'
				+ ', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_VIP_CLASS + '7', {
				color: '#77C773',
				'border-color': '#77C773'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_ASSISTANT_CLASS
				+ ', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_SECRETARY_CLASS
				+ ', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_ANCHOR_CLASS, {
				color: '#5382E2',
				'border-color': '#5382E2'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_ADMIN_CLASS
				+ ', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_SU_ADMIN_CLASS, {
				color: '#F76767',
				'border-color': '#F76767'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > a', {
				color: '#5382E2',
				'text-decoration': CSS_NONE,
				cursor: 'pointer'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .context', {
				'word-break': 'break-all',
				'word-wrap': 'break-word'
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
				display: 'inline-block'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' .shieldtext .icon', {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAABTklEQVRIx82VW5mDMBCFR0IkICEScLA42DrojwLiYHFQHCwOwEFxUByAg+xDaYGQhOxbmRf4wjlzOzMR+cgHXV6p+KGjoiq/yNKhGTcm7MHu5fc5WHHzQFd7UMTgudeza78oP/ySAF6S8VBQJMMtlu6Y+/QvAovZE9QJkBbIFzMMm8aiTsF1oHALAVHwgH6Ji4qKqrw6sqKPwtXSo8e+jOQrwRCEzygRFHfv6e1FEPafR+ArBXPguBcRoY1WiFgNChHyk/5MqJCPOcH/M4aAl36X3kjv2Lj57/3hiJVsedde/TznZwqNknlXoA9K0GKxoWkwIuhoBHqtla8X7UYjE53HrBMfzX59JXchOFY6QQezO1jbKJrTUXMXy8GjFkEFpe7rzyaJhvwZHllgXpvDmnkv9nG//1EYJ46Ri+9OamgxocuDAkNDjdksk494/gA7tENEtjQPhQAAAABJRU5ErkJggg==)'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' .shieldtext.checked .icon', {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAA50lEQVRIx9WVWxXCMAxAJ6ESkDAJdTAk4IA7BeBgc8AcbA42B+BgdbA5CF+wV6EP+IDm+942OUmaJD95UHlGQUuPIPS0FHmG8oN3nBgQSwyc2LlwrOgs8uObh1O7cAShtiaD4uqFC0JrE1TeuCBc1rgOwgVBLwUmWNB/dr8gpLH5P6KcBF2UoPukAoJwnQRjlMB8MYUmSlBNgkOUYD+fg/AqjMtOLIMFrGfRRBbwqUgD8Jt9I6SelTCzKdgo3Ik0b5ero6W61RYIENwonfBC0KBQaDTauco3AuN110vB2fMHevU3JH937stTHesqyDanAAAAAElFTkSuQmCC)'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' .clearscreen .icon', {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAABcElEQVRIx9WUUXmEMBCEIyESkICDQwIO7iT8KCAOigOQgIPg4HDQcwAOtg+EI+ESSq8P/Zq8Jbuz+83OrFL/9FAgfPwGYEB4vJ9eIgjN+wAPBCHfHnIst9PpNwRh9J9mBCFTipzWQz6qj/80IsxopTAI5jDdIGu57VFjlrpoDPogXTMhCP279GV0CJJgDF1dqkticBZLS+ZAdLy9O4JgE7wv11Kk2mueQbwId/AgBBudlBdkws6cVjoPYgqm4AJ5fpfKF5nQOpAM4zQTFzINM7Nfn5wJYQiYuvE4OUhKJoTxlXNKv8uU4+2i+X36kdAUWXWprrROb0ITqW743M/Jd/l6Z5oI06uZogDrFEYaylSjFKvxYp87ncc6YEDo0hz0CEKtFAX9Vge9gJHtdlGyiyCMjMFJqQtVkVpZi9oW72lqpmXqFAiSNFPg+v5pm2lTHcMPVkngwDt1daV+WWXfguQ0boVGfXoextAxnKDvT84XhbA72NjAQfwAAAAASUVORK5CYII=)'
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
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAA9UlEQVQ4y52UUbnCMAyFI6ESKgEnVAIO+KeAOWAOVgergzsHzAF1sDkoD4Pdre2AkjwlX0/OaZpUZGPo6kzHjUDgRled0bJnaFo8DQYlIoLC0OBpsyAMnno+uskrajwmTp/wHHa5D3hOcXUVydMRzz8LOq2Ow2VY5iJY6kRET5/kauyrvvoKoJjQAjSZa2YAIlgQXNKyfYDBCUMqaBegGYSwBB1/i4+Mq6h7NZmwBjj6xSemVeTWgGJJxZcubmvJw43o8tH4Yfi+HO/7pjkfF+i+WaCF5ZJd0UtmRZ8yLJ5rdZzloKsjLSP2/c8BjoFAYMBBfPgBKQDHPbaYwxwAAAAASUVORK5CYII=)',
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
		protocol = core.protocol,
		roles = protocol.roles,
		renders = core.renders,
		rendermodes = renders.modes,
		css = utils.css,
		
		RENDER_CLASS = 'cha-render',
		TITLE_CLASS = 'cha-title',
		CONSOLE_CLASS = 'cha-console',
		CONTROLS_CLASS = 'cha-controls',
		DIALOG_CLASS = 'cha-dialog',
		
		CHECKBOX_CLASS = 'cha-checkbox',
		BUTTON_CLASS = 'cha-button',
		
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
	
	renders.def = function(layer, config) {
		var _this = utils.extend(this, new events.eventdispatcher('renders.def')),
			_defaults = {},
			_titleLayer,
			_consoleLayer,
			_controlsLayer,
			_dialogLayer,
			_moreLayer,
			_moreButton,
			_textInput,
			_sendButton;
		
		function _init() {
			_this.name = rendermodes.DEFAULT;
			
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
			
			// controls
			_controlsLayer = utils.createElement('div', CONTROLS_CLASS);
			layer.appendChild(_controlsLayer);
			
			var shieldtext = _getCheckBox('屏蔽消息', CHECKBOX_CLASS + ' shieldtext', events.CHATEASE_VIEW_PROPERTY, { key: 'shield' }, false);
			_controlsLayer.appendChild(shieldtext);
			
			var clearscreen = _getButton('清屏', BUTTON_CLASS + ' white clearscreen', events.CHATEASE_VIEW_CLEARSCREEN, null);
			_controlsLayer.appendChild(clearscreen);
			
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
			if (_this.config.maxlength) {
				_textInput.setAttribute('maxlength', _this.config.maxlength);
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
		
		_this.show = function(text, user, type) {
			// set default
			if (utils.typeOf(user) != 'object') {
				user = { id: 0, name: '系统', role: roles.SYSTEM };
			}
			if (type != 'uni') {
				type = 'multi';
			}
			
			// create box
			var box = utils.createElement('div');
			if ((user.role & roles.SYSTEM) == roles.SYSTEM) {
				box.className = NICK_SYSTEM_CLASS;
			}
			
			// set icon
			var icon = _getIcon(user.icon);
			if (icon) {
				box.appendChild(icon);
			}
			
			// private chat sign
			if (type == 'uni') {
				var span = utils.createElement('span');
				span.innerHTML = '[密语]';
				box.appendChild(span);
			}
			
			// set title
			var title = _getTitle(user.role);
			if (title) {
				box.appendChild(title);
			}
			
			// set nickname
			var a = utils.createElement('a');
			a.innerHTML = user.name + ': ';
			
			var nickHandler = (function(user) {
				return function(e) {
					_this.dispatchEvent(events.CHATEASE_VIEW_NICKCLICK, { user: user });
				};
			})(user);
			
			try {
				a.addEventListener('click', nickHandler);
			} catch (err) {
				a.attachEvent('onclick', nickHandler);
			}
			box.appendChild(a);
			
			// set text
			var span = utils.createElement('span', 'context');
			span.innerHTML = text;
			box.appendChild(span);
			//box.insertAdjacentHTML('beforeend', text);
			
			// check records
			if (_consoleLayer.childNodes.length >= _this.config.maxrecords) {
				_consoleLayer.removeChild(_consoleLayer.childNodes[0]);
			}
			
			// append this box
			_consoleLayer.appendChild(box);
			_consoleLayer.scrollTop = _consoleLayer.scrollHeight;
		};
		
		function _getIcon(url) {
			if (!url) {
				return null;
			}
			
			var icon = utils.createElement('span', 'icon');
			icon.innerHTML = '<img src="' + url + '">';
			
			return icon;
		}
		
		function _getTitle(role) {
			var title, clazz = 'title ';
			
			if (utils.typeOf(role) != 'number') {
				role = parseInt(role);
				if (role == NaN || role < 0) {
					return null;
				}
			}
			
			if (role & roles.SYSTEM) {
				if ((role & roles.SYSTEM) == roles.SYSTEM) {
					clazz += TITLE_SYSTEM_CLASS;
				} else if (role & roles.SU_ADMIN) {
					clazz += TITLE_SU_ADMIN_CLASS;
					
					title = utils.createElement('span', clazz);
					title.innerText = '超管';
				} else {
					clazz += TITLE_ADMIN_CLASS;
					
					title = utils.createElement('span', clazz);
					title.innerText = '管理员';
				}
			} else if (role & roles.ANCHOR) {
				if ((role & roles.ANCHOR) == roles.ANCHOR) {
					clazz += TITLE_ANCHOR_CLASS;
					
					title = utils.createElement('span', clazz);
					title.innerText = '主播';
				} else if (role & roles.SECRETARY) {
					clazz += TITLE_SECRETARY_CLASS;
					
					title = utils.createElement('span', clazz);
					title.innerText = '秘书';
				} else {
					clazz += TITLE_ASSISTANT_CLASS;
					
					title = utils.createElement('span', clazz);
					title.innerText = '助理';
				}
			} else if (role & roles.VIP) {
				var lv = (role & roles.VIP) >>> 1;
				clazz += TITLE_VIP_CLASS + lv;
				
				title = utils.createElement('span', clazz);
				title.innerText = 'VIP' + lv;
			} else if ((role & roles.NORMAL) == roles.NORMAL) {
				clazz += TITLE_NORMAL_CLASS;
			} else {
				clazz += TITLE_VISITOR_CLASS;
			}
			
			return title;
		}
		
		_this.send = function() {
			_this.dispatchEvent(events.CHATEASE_VIEW_SEND, { data: {
				data: _textInput.value,
				type: 'multi' // TODO: uni
			}});
			
			_this.clearInput();
		};
		
		_this.clearInput = function() {
			_textInput.value = '';
		};
		
		_this.clearScreen = function() {
			utils.emptyElement(_consoleLayer);
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
		protocol = core.protocol,
		roles = protocol.roles,
		renders = core.renders,
		rendermodes = renders.modes,
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
			_this.name = rendermodes.NONE;
			
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
		
		_this.show = function(text, user, type) {
			
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
		states = core.states,
		protocol = core.protocol,
		roles = protocol.roles,
		channelStates = protocol.channelStates,
		punishments = protocol.punishments;
	
	var userinfo = function() {
		var _this = this,
			_defaults = {
				channel: null,
				role: -1,
				state: 0,
				punishment: {
					code: 0,
					time: 0
				}
			},
			_interval,
			_active;
		
		function _init() {
			utils.extend(_this, _defaults);
			
			_interval = -1;
			_active = 0;
		}
		
		_this.set = function(info) {
			utils.extend(_this, info);
			
			if (info.hasOwnProperty('role') == true) {
				_interval = _getIntervalByRole(info.role);
			}
		};
		
		function _getIntervalByRole(role) {
			var interval = 2000;
			
			if (role & 0xF0) {
				interval = 0;
			} else if (role) {
				interval *= .5;
				var vip = role - 1;
				if (vip) {
					interval = interval >= vip * 100 ? interval - vip * 100 : 0;
				}
			}
			
			return interval;
		}
		
		_this.isMuted = function() {
			return _this.role < _this.state || !!(_this.punishment.code & punishments.MUTED);
		};
		
		_this.isActive = function() {
			if (_interval < 0) {
				return false;
			}
			
			var now = new Date().getTime();
			if (_active && now - _active < _interval) {
				return false;
			}
			
			_active = now;
			
			return true;
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
				userinfo: new userinfo(),
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
		roles = core.protocol.roles,
		renders = core.renders,
		renderModes = renders.modes,
		skins = core.skins,
		skinmodes = skins.modes,
		css = utils.css,
		
		WRAP_CLASS = 'cha-wrapper',
		SKIN_CLASS = 'cha-skin',
		RENDER_CLASS = 'cha-render',
		CONTEXTMENU_CLASS = 'cha-contextmenu';
	
	core.view = function(model) {
		var _this = utils.extend(this, new events.eventdispatcher('core.view')),
			_wrapper,
			_object,
			_renderLayer,
			_contextmenuLayer,
			_render,
			_skin,
			_errorOccurred = false;
		
		function _init() {
			_wrapper = utils.createElement('div', WRAP_CLASS + ' ' + SKIN_CLASS + '-' + model.getConfig('skin').name);
			_wrapper.id = model.getConfig('id');
			//_wrapper.tabIndex = 0;
			
			_renderLayer = utils.createElement('div', RENDER_CLASS);
			_contextmenuLayer = utils.createElement('div', CONTEXTMENU_CLASS);
			
			_wrapper.appendChild(_renderLayer);
			_wrapper.appendChild(_contextmenuLayer);
			
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
		
		function _initRender() {
			var cfg = utils.extend({}, model.getConfig('render'), {
				id: model.getConfig('id'),
				url: model.getConfig('url'),
				width: model.getConfig('width'),
				height: model.getConfig('height'),
				maxlength: model.getConfig('maxlength'),
				maxrecords: model.getConfig('maxrecords')
			});
			
			try {
				_render = _this.render = new renders[cfg.name](_renderLayer, cfg);
				_render.addEventListener(events.CHATEASE_READY, _forward);
				_render.addEventListener(events.CHATEASE_VIEW_SEND, _forward);
				_render.addEventListener(events.CHATEASE_VIEW_PROPERTY, _onViewProperty);
				_render.addEventListener(events.CHATEASE_VIEW_CLEARSCREEN, _forward);
				_render.addEventListener(events.CHATEASE_VIEW_NICKCLICK, _onNickClick);
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
				title: !!model.getConfig('render').title
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
		
		_this.show = function(text, user, type) {
			if (user && !(user.role & roles.SYSTEM) && model.getProperty('shield')) {
				return;
			}
			
			if (_render) {
				_render.show(text, user, type);
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
					break;
			}
			
			_forward(e);
		}
		
		function _onNickClick(e) {
			_this.dispatchEvent(events.CHATEASE_NICKCLICK, { user: e.user });
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
		protocol = core.protocol,
		cmds = protocol.cmds,
		raws = protocol.raws,
		roles = protocol.roles,
		channelStates = protocol.channelStates,
		punishments = protocol.punishments,
		errors = protocol.errors;
	
	core.controller = function(model, view) {
		var _this = utils.extend(this, new events.eventdispatcher('core.controller')),
			_ready = false,
			_websocket,
			_timer,
			_filter,
			_responders,
			_requestId,
			_retrycount = 0;
		
		function _init() {
			_responders = {};
			_requestId = 0;
			
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
		
		function _onReady(e) {
			if (!_ready) {
				utils.log('Chat ready!');
				
				_ready = true;
				_forward(e);
				
				if (!chatease.debug) {
					view.show('聊天室已连接！');
				}
				
				_connect();
				
				window.onbeforeunload = function(e) {
					if (_websocket && model.getState() == states.CONNECTED) {
						//_websocket.close();
					}
				};
			}
		}
		
		_this.setup = function(e) {
			if (!_ready) {
				view.setup();
			}
		};
		
		_this.send = function(data, responder) {
			if (!_websocket || model.getState() != states.CONNECTED) {
				_connect();
				return;
			}
			
			if (utils.typeOf(data) != 'object' || data.hasOwnProperty('cmd') == false) {
				_error(errors.BAD_REQUEST, data);
				return;
			}
			
			var userinfo = model.getProperty('userinfo');
			if (userinfo.isActive() == false) {
				_error(errors.CONFLICT, data);
				return;
			}
			if (userinfo.isMuted() == true) {
				_error(errors.EXPECTATION_FAILED, data);
				return;
			}
			
			if (responder) {
				var req = _requestId++;
				_responders[req] = responder;
				
				data.req = req;
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
			
			if (chatease.debug) {
				view.show('聊天室连接中…');
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
				_error(errors.NOT_ACCEPTABLE, null);
			}
		}
		
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
			
			if (data.hasOwnProperty('req') && _responders.hasOwnProperty(data.req)) {
				var responder = _responders[data.req];
				var fn = responder.result;
				if (data.raw == raws.ERROR) {
					fn = responder.status;
				}
				
				if (fn) {
					fn.call(null, data);
				}
				
				delete _responders[data.req];
			}
			
			switch (data.raw) {
				case raws.IDENT:
					var userinfo = model.getProperty('userinfo');
					userinfo.set(utils.extend({}, data.user, {
						channel: data.channel.id,
						state: data.channel.state
					}));
					
					if (chatease.debug) {
						view.show('已加入房间（' + userinfo.channel + '）。');
					} else {
						utils.log('已加入房间（' + userinfo.channel + '）。');
					}
					
					if (userinfo.role < userinfo.state) {
						view.show('您所在的用户组不能发言！');
					}
					if (!!(userinfo.punishment.code & punishments.MUTED)) {
						var date = new Date();
						date.setTime(userinfo.punishment.time);
						view.show('您已被禁言至（' + utils.formatTime(date) + '）！');
					}
					
					_this.dispatchEvent(events.CHATEASE_INDENT, data);
					break;
					
				case raws.TEXT:
					try {
						if (!_filter) {
							_filter = new utils.filter(model.config.keywords);
						}
						data.data = _filter.replace(data.data);
					} catch (err) {
						// Ignore this failure.
						utils.log('Failed to execute filter.');
					}
					
					view.show(data.data, data.user, data.type);
					_this.dispatchEvent(events.CHATEASE_MESSAGE, data);
					break;
					
				case raws.JOIN:
					var title = _getUserTitle(data.user.role);
					view.show((title ? title + ' ' : '') + data.user.name + ' 进入房间。');
					_this.dispatchEvent(events.CHATEASE_JOIN, data);
					break;
					
				case raws.LEFT:
					var title = _getUserTitle(data.user.role);
					view.show((title ? title + ' ' : '') + data.user.name + ' 已离开。');
					_this.dispatchEvent(events.CHATEASE_LEFT, data);
					break;
					
				case raws.USERS:
					_this.dispatchEvent(events.CHATEASE_USERS, data);
					break;
					
				case raws.EXTERN:
					_this.dispatchEvent(events.CHATEASE_EXTERN, data);
					break;
					
				case raws.ERROR:
					_error(data.error.code, data);
					break;
					
				default:
					utils.log('Unknown data type: ' + data.raw + ', ignored.');
					break;
			}
		};
		
		_this.onError = function(e) {
			model.setState(states.ERROR);
		};
		
		_this.onClose = function(e) {
			model.setState(states.CLOSED);
		};
		
		function _getUserTitle(role) {
			var title = '';
			
			if (utils.typeOf(role) != 'number') {
				role = parseInt(role);
				if (role == NaN || role < 0) {
					return '';
				}
			}
			
			if (role & roles.SYSTEM) {
				if ((role & roles.SYSTEM) == roles.SYSTEM) {
					title += '[系统]';
				} else if (role & roles.SU_ADMIN) {
					title += '[超管]';
				} else {
					title += '[管理员]';
				}
			} else if (role & roles.ANCHOR) {
				if ((role & roles.ANCHOR) == roles.ANCHOR) {
					title += '[主播]';
				} else if (role & roles.SECRETARY) {
					title += '[助理]';
				} else {
					title += '[房管]';
				}
			} else if (role & roles.VIP) {
				var lv = (role & roles.VIP) - 1;
				title += '[VIP' + lv + ']';
			} else if ((role & roles.NORMAL) == roles.NORMAL) {
				// no title here
			} else {
				title += '[游客]';
			}
			
			return title;
		}
		
		function _error(code, params) {
			var explain = _getErrorExplain(code);
			if (explain) {
				view.show(explain);
			}
			
			var data = {
				raw: 'error',
				error: {
					code: code,
					explain: explain
				}
			};
			utils.foreach(params, function(k, v) {
				if (k != 'cmd' && k != 'raw' && k != 'error') {
					data[k] = v;
				}
			});
			
			_this.dispatchEvent(events.ERROR, data);
		}
		
		function _getErrorExplain(code) {
			var explain = '';
			
			switch (code) {
				case errors.BAD_REQUEST:
					explain = '错误请求！';
					break;
				case errors.UNAUTHORIZED:
					explain = '请先登录！';
					break;
				case errors.FORBIDDEN:
					explain = '权限错误！';
					break;
				case errors.NOT_FOUND:
					explain = '未知请求！';
					break;
				case errors.NOT_ACCEPTABLE:
					explain = '无法识别！';
					break;
				case errors.REQUEST_TIMEOUT:
					explain = '请求超时！';
					break;
				case errors.CONFLICT:
					explain = '操作频繁！';
					break;
				case errors.EXPECTATION_FAILED:
					explain = '操作失败！';
					break;
					
				case errors.INTERNAL_SERVER_ERROR:
					explain = '内部错误！';
					break;
				case errors.NOT_IMPLEMENTED:
					explain = '无法识别！';
					break;
				case errors.BAD_GATEWAY:
					explain = '响应无效！';
					break;
				case errors.SERVICE_UNAVAILABLE:
					explain = '服务过载！';
					break;
				case errors.GATEWAY_TIMEOUT:
					explain = '网关超时！';
					break;
				default:
					break;
			}
			
			return explain;
		}
		
		function _modelStateHandler(e) {
			switch (e.state) {
				case states.CONNECTED:
					if (chatease.debug) {
						view.show('聊天室已连接…');
					} else {
						utils.log('聊天室已连接…');
					}
					
					_retrycount = 0;
					_this.dispatchEvent(events.CHATEASE_CONNECT);
					break;
					
				case states.CLOSED:
					if (chatease.debug) {
						view.show('聊天室连接已断开！');
					} else {
						utils.log('聊天室连接已断开！');
					}
					
					_this.dispatchEvent(events.CHATEASE_CLOSE, { channel: { id: model.channel } });
					_reconnect();
					break;
					
				case states.ERROR:
					if (chatease.debug) {
						view.show('聊天室异常！');
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
		
		function _reconnect() {
			if (model.config.maxretries < 0 || _retrycount < model.config.maxretries) {
				var delay = Math.ceil(model.config.retrydelay + Math.random() * 3000);
				
				if (chatease.debug) {
					view.show('正在准备重连，' + delay / 1000 + '秒...');
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
				view.show('请输入内容！');
				return;
			}
			
			if (model.config.maxlength >= 0) {
				text = text.substr(0, model.config.maxlength);
			}
			text = utils.trim(text);
			
			var userinfo = model.getProperty('userinfo');
			
			_this.send({
				cmd: cmds.TEXT,
				data: text,
				type: e.data.type,
				channel: {
					id: userinfo.channel
				}
			});
		}
		
		function _onViewProperty(e) {
			model.setProperty(e.key, e.value);
		}
		
		function _onClearScreen(e) {
			view.render.clearScreen();
			_forward(e);
		}
		
		function _onNickClick(e) {
			// TODO: control, private chat
			var userinfo = model.getProperty('userinfo');
			e.channel = { id: userinfo.channel, state: userinfo.state };
			_forward(e);
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
		rendermodes = chatease.core.renders.modes,
		skinmodes = chatease.core.skins.modes;
	
	embed.config = function(config) {
		var _defaults = {
			url: 'ws://' + window.location.host + '/ch1?token=123456',
			width: 640,
			height: 400,
			keywords: '',
	 		maxlength: 30,    // -1: no limit
	 		maxrecords: 50,
	 		maxretries: -1,   // -1: always
	 		retrydelay: 3000,
			render: {
				name: rendermodes.DEFAULT,
				title: 'CHATEASE ' + chatease.version,
				swf: 'swf/chatease.swf'
			},
			skin: {
				name: skinmodes.DEFAULT
			}
		},
		
		_config = utils.extend({}, _defaults, config);
		
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
