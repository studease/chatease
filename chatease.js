chatease = function() {
	if (chatease.api) {
		return chatease.api.getInstance.apply(this, arguments);
	}
};

chatease.version = '1.0.09';

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
	
	utils.typeOf = function(value) {
		if (value === null || value === undefined) {
			return 'null';
		}
		var typeofString = typeof value;
		if (typeofString === 'object') {
			try {
				if (toString.call(value) === '[object Array]') {
					return 'array';
				}
			} catch (e) {}
		}
		return typeofString;
	};
	
	utils.trim = function(inputString) {
		return inputString.replace(/^\s+|\s+$/g, '');
	};
	
	utils.indexOf = function(array, item) {
		if (array == null) return -1;
		for (var i = 0; i < array.length; i++) {
			if (array[i] === item) {
				return i;
			}
		}
		return -1;
	};
	
	utils.isMSIE = function(version) {
		if (version) {
			version = parseFloat(version).toFixed(1);
			return _userAgentMatch(new RegExp('msie\\s*' + version, 'i'));
		}
		return _userAgentMatch(/msie/i);
	};
	
	function _userAgentMatch(regex) {
		var agent = navigator.userAgent.toLowerCase();
		return (agent.match(regex) !== null);
	};
	
	/** Logger */
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
				var name = getStyleName(style);
				if (element.style[name] !== value) {
					element.style[name] = value;
				}
			});
		}
	};
	
	function getStyleName(name) {
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
		CHATEASE_CLOSE: 'chateaseClose',
		
		// View Events
		CHATEASE_VIEW_SEND: 'chateaseViewSend',
		CHATEASE_VIEW_PROPERTY: 'chateaseViewProperty',
		CHATEASE_VIEW_CLEARSCREEN: 'chateaseViewClearScreen',
		CHATEASE_VIEW_NICKCLICK: 'chateaseViewNickClick'
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
			if (chatease.debug) {
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
		ERROR:   'error',
		PONG:    'pong'
	};
	
	protocol.roles = {
		VISITOR:   0x00,
		NORMAL:    0x01,
		VIP:       0x0E,
		
		ASSISTANT: 0x10,
		SECRETARY:  0x20,
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
		FORBIDDED:             403,
		NOT_FOUND:             404,
		METHOD_NOT_ALLOWED:    405,
		REQUEST_TIMEOUT:       408,
		CONFLICT:              409,
		
		INTERNAL_SERVER_ERROR: 500,
		NOT_IMPLEMENTED:       501,
		BAD_GATEWAY:           502,
		SERVICE_UNAVAILABLE:   503,
		GATEWAY_TIMEOUT:       504
	};
})(chatease);

(function(chatease) {
	chatease.core.skins = {};
})(chatease);

(function(chatease) {
	chatease.core.skins.modes = {
		DEFAULT: 'def'
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
		
		ICON_VISITOR_CLASS = 'ico-visitor',
		ICON_NORMAL_CLASS = 'ico-normal',
		ICON_VIP_CLASS = 'ico-vip',
		
		ICON_ASSISTANT_CLASS = 'ico-assistant',
		ICON_SECRETARY_CLASS = 'ico-secretary',
		ICON_ANCHOR_CLASS = 'ico-anchor',
		
		ICON_ADMIN_CLASS = 'ico-admin',
		ICON_SU_ADMIN_CLASS = 'ico-suadmin',
		ICON_SYSTEM_CLASS = 'ico-system',
		
		// For all api instances
		CSS_SMOOTH_EASE = 'opacity .25s ease',
		CSS_100PCT = '100%',
		CSS_ABSOLUTE = 'absolute',
		CSS_RELATIVE = 'relative',
		CSS_NORMAL = 'normal',
		CSS_IMPORTANT = ' !important',
		CSS_HIDDEN = 'hidden',
		CSS_NONE = 'none',
		CSS_BLOCK = 'block';
	
	skins.def = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('skins.def'));
		
		function _init() {
			_this.name = skinmodes.DEFAULT;
			
			_this.config = utils.extend({}, config);
			
			SKIN_CLASS += '-' + _this.name;
			
			css('.' + WRAP_CLASS, {
				width: CSS_100PCT,
				height: CSS_100PCT
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
				padding: '6px 0 6px 18px',
				color: '#E6E6E6',
				'background-repeat': 'no-repeat',
				'background-position': 'left center',
				cursor: 'pointer',
				overflow: CSS_HIDDEN
			});
			
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS, {
				padding: '6px 14px',
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
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS, {
				width: CSS_100PCT,
				height: CSS_100PCT
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + TITLE_CLASS, {
				width: CSS_100PCT,
				height: '40px',
				'font-family': 'inherit',
				'font-weight': CSS_NORMAL,
				'text-align': 'center',
				'line-height': '40px',
				color: '#E6E6E6',
				'background-color': '#171717',
				cursor: 'default',
				'pointer-events': CSS_NONE
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS, {
				height: _this.config.height - 140 + 'px',
				color: '#242424',
				'background-color': '#F8F8F8',
				'overflow-y': 'scroll'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div', {
				margin: '6px',
				'word-break': 'break-all',
				'word-wrap': 'break-word'
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
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.' + ICON_VISITOR_CLASS, {
				'margin-right': '6px'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.' + ICON_NORMAL_CLASS, {
				'margin-right': '6px'
			});
			/*css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.' + ICON_VIP_CLASS + '1', {
				
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.' + ICON_VIP_CLASS + '2', {
				
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.' + ICON_VIP_CLASS + '3', {
				
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.' + ICON_VIP_CLASS + '4', {
				
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.' + ICON_VIP_CLASS + '5', {
				
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.' + ICON_VIP_CLASS + '6', {
				
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.' + ICON_VIP_CLASS + '7', {
				
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.' + ICON_ASSISTANT_CLASS, {
				
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.' + ICON_SECRETARY_CLASS, {
				
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.' + ICON_ANCHOR_CLASS, {
				
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.' + ICON_ADMIN_CLASS, {
				
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.' + ICON_SU_ADMIN_CLASS, {
				
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.' + ICON_SYSTEM_CLASS, {
				
			});*/
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > a', {
				color: '#3C9CFE',
				'text-decoration': CSS_NONE,
				cursor: 'pointer'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS, {
				width: CSS_100PCT,
				height: '40px',
				'line-height': CSS_100PCT,
				'background-color': '#171717',
				overflow: CSS_HIDDEN
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' > *', {
				margin: '6px 0',
				'text-align': 'center',
				display: 'block'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' > .' + CHECKBOX_CLASS, {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOAgMAAABiJsVCAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAJUExURUxpcebm5ubm5kbBEu0AAAACdFJOUwCgoEVu0AAAABpJREFUCNdjYAABqVWrHBi0Vq1qII0AawMBACnPF0kf/g8sAAAAAElFTkSuQmCC)'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' > .' + CHECKBOX_CLASS + '[checked=true]', {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAA40lEQVQ4T52SvXHCQBCF3wuUKDHp7QXYFZgOrBKgAqADOsDuRK7ALoEOGDqwk1UoSHSBZrTMMWhGY358w0YbvG9/3i7xYDByqloCmKfUMLPSe7/sQUuADmfNk4gwCTSzXZZli7ZtS5KvSWCE8jwvmqZZkVzHrv+CPRRCKAB89etcA38BjM+CA8lJzLuu25Ic3QJ/RORl4PBMRL5VdQPgbWjeRUcz+/Dev1dVVTjnNqo6HY54b1SQXDrnyrquRyGELYDnv6e6Z87MzCa9i8mgme2jeGjIrR2TXw7Ap4gsTp/zSBwBq1l6D5ci9L8AAAAASUVORK5CYII=)'
			});
			/*css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' > .' + BUTTON_CLASS, {
				
			});*/
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' .shieldtext', {
				'float': 'left'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' .clearscreen', {
				'float': 'right',
				width: '42px'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DIALOG_CLASS, {
				width: CSS_100PCT,
				height: '60px',
				overflow: CSS_HIDDEN
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DIALOG_CLASS + ' textarea', {
				'margin-right': '6px',
				padding: '6px 10px',
				width: _this.config.width - 124 + 'px',
				height: '48px',
				resize: CSS_NONE,
				border: '0 none',
				'background-color': '#E6E6E6'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DIALOG_CLASS + ' button', {
				'float': 'right',
				width: '42px',
				height: '48px'
			});
		}
		
		_this.resize = function(width, height) {
			var wrapper = document.getElementById(_this.config.id);
			var consoleLayer = document.getElementById(_this.config.id + '-console');
			var textInput = document.getElementById(_this.config.id + '-input');
			
			css.style(consoleLayer, {
				height: wrapper.clientHeight - 140 + 'px'
			});
			
			css.style(textInput, {
				width: wrapper.clientWidth - 96 + 'px'
			});
		};
		
		_init();
	};
})(chatease);

(function(chatease) {
	chatease.core.renders = {};
})(chatease);

(function(chatease) {
	chatease.core.renders.modes = {
		DEFAULT: 'def'
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
		
		ICON_VISITOR_CLASS = 'ico-visitor',
		ICON_NORMAL_CLASS = 'ico-normal',
		ICON_VIP_CLASS = 'ico-vip',
		
		ICON_ASSISTANT_CLASS = 'ico-assistant',
		ICON_SECRETARY_CLASS = 'ico-secretary',
		ICON_ANCHOR_CLASS = 'ico-anchor',
		
		ICON_ADMIN_CLASS = 'ico-admin',
		ICON_SU_ADMIN_CLASS = 'ico-suadmin',
		ICON_SYSTEM_CLASS = 'ico-system',
		
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
			_textInput,
			_sendButton;
		
		function _init() {
			_this.name = rendermodes.DEFAULT;
			
			_this.config = utils.extend({}, _defaults, config);
			
			if (utils.isMSIE(8) || utils.isMSIE(9)) {
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
				_object.style.width = _object.style.height = '0';
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
			_titleLayer = utils.createElement('div', TITLE_CLASS);
			layer.appendChild(_titleLayer);
			
			_titleLayer.innerHTML = '聊天室';
			
			// console
			_consoleLayer = utils.createElement('div', CONSOLE_CLASS);
			_consoleLayer.id = _this.config.id + '-console';
			layer.appendChild(_consoleLayer);
			
			// controls
			_controlsLayer = utils.createElement('div', CONTROLS_CLASS);
			layer.appendChild(_controlsLayer);
			
			var shieldChk = _getCheckBox('屏蔽消息', CHECKBOX_CLASS + ' shieldtext', events.CHATEASE_VIEW_PROPERTY, { key: 'shield' }, false);
			_controlsLayer.appendChild(shieldChk);
			
			var clearBtn = _getButton('清屏', BUTTON_CLASS + ' red clearscreen', events.CHATEASE_VIEW_CLEARSCREEN, null);
			_controlsLayer.appendChild(clearBtn);
			
			// dialog
			_dialogLayer = utils.createElement('div', DIALOG_CLASS);
			layer.appendChild(_dialogLayer);
			
			_textInput = utils.createElement('textarea');
			_textInput.id = _this.config.id + '-input';
			_dialogLayer.appendChild(_textInput);
			
			_sendButton = utils.createElement('button', BUTTON_CLASS + ' red');
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
			
			// button
			_sendButton.innerHTML = '发送';
			
			var clickHandler = (function() {
				return function() {
					_this.send();
				}
			})();
			
			try {
				_sendButton.addEventListener('click', clickHandler);
			} catch (err) {
				_sendButton.attachEvent('onclick', clickHandler);
			}
		}
		
		function _getCheckBox(label, clazz, event, data, checked) {
			var box = utils.createElement('div', clazz);
			
			box.setAttribute('checked', !!checked);
			box.innerHTML = label;
			
			var handler = (function(event, data) {
				return function(e) {
					var isChecked = box.getAttribute('checked') == 'true' ? false : true;
					box.setAttribute('checked', isChecked);
					
					_this.dispatchEvent(event, utils.extend({ value: isChecked }, data));
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
			
			var btn = utils.createElement('a');
			box.appendChild(btn);
			
			btn.innerHTML = label;
			
			var handler = (function(event, data) {
				return function(e) {
					_this.dispatchEvent(event, data);
				};
			})(event, data);
			
			try {
				btn.addEventListener('click', handler);
			} catch (err) {
				btn.attachEvent('onclick', handler);
			}
			
			return box;
		}
		
		_this.setup = function() {
			if (utils.isMSIE(8) || utils.isMSIE(9)) {
				//setTimeout(function() {
					if (_object.setup) {
						_this.config.debug = false;
						_object.setup(_this.config);
						_this.dispatchEvent(events.CHATEASE_READY, { id: _this.config.id });
					}
				//}, 0);
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
			if (user.role & roles.SYSTEM) {
				box.className = NICK_SYSTEM_CLASS;
			}
			
			// private chat sign
			if (type == 'uni') {
				var span = utils.createElement('span');
				span.innerHTML = '[密语]';
				box.appendChild(span);
			}
			
			// set icon
			var clazz = _getIconClazz(user.role);
			if (clazz) {
				var icon = utils.createElement('span', clazz);
				box.appendChild(icon);
			}
			
			// set nickname
			var a = utils.createElement('a');
			a.innerHTML = user.name + '：';
			
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
			box.insertAdjacentHTML('beforeend', text);
			
			// check records
			if (_consoleLayer.childNodes.length >= _this.config.maxrecords) {
				_consoleLayer.removeChild(_consoleLayer.childNodes[0]);
			}
			
			// append this box
			_consoleLayer.appendChild(box);
			_consoleLayer.scrollTop = _consoleLayer.scrollHeight;
		};
		
		function _getIconClazz(role) {
			var clazz = '';
			
			if (utils.typeOf(role) != 'number') {
				role = parseInt(role);
				if (role == NaN || role < 0) {
					return '';
				}
			}
			
			if (role & roles.SYSTEM) {
				if ((role & roles.SYSTEM) == roles.SYSTEM) {
					clazz += ICON_SYSTEM_CLASS;
				} else if (role & roles.SU_ADMIN) {
					clazz += ICON_SU_ADMIN_CLASS;
				} else {
					clazz += ICON_ADMIN_CLASS;
				}
			} else if (role & roles.ANCHOR) {
				if ((role & roles.ANCHOR) == roles.ANCHOR) {
					clazz += ICON_ANCHOR_CLASS;
				} else if (role & roles.SECRETARY) {
					clazz += ICON_SECRETARY_CLASS;
				} else {
					clazz += ICON_ASSISTANT_CLASS;
				}
			} else if (role & roles.VIP) {
				var lv = (role & roles.VIP) - 1;
				clazz += ICON_VIP_CLASS + lv;
			} else if ((role & roles.NORMAL) == roles.NORMAL) {
				clazz += ICON_NORMAL_CLASS;
			} else {
				clazz += ICON_VISITOR_CLASS
			}
			
			return clazz;
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
			}
			_interval = -1,
			_active = 0;
		
		function _init() {
			utils.extend(_this, _defaults);
		}
		
		_this.set = function(info) {
			utils.extend(_this, info);
			
			if (info.hasOwnProperty('role') == true) {
				_interval = _getIntervalByRole(info.role);
			}
		};
		
		function _getIntervalByRole(role) {
			if (role < 0) {
				return -1;
			}
			
			var interval = -1;
			if (role >= roles.ASSISTANT) {
				interval = 0;
			} else if (role & roles.VIP) {
				interval = 500;
			} else if (role == roles.NORMAL) {
				interval = 1000;
			} else {
				interval = 2000;
			}
			
			return interval;
		}
		
		_this.isMuted = function() {
			return !!(_this.state & channelStates.MUTED | _this.punishment.code & punishments.MUTED);
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
			_wrapper.tabIndex = 0;
			
			_renderLayer = utils.createElement('div', RENDER_CLASS);
			_contextmenuLayer = utils.createElement('div', CONTEXTMENU_CLASS);
			
			_wrapper.appendChild(_renderLayer);
			_wrapper.appendChild(_contextmenuLayer);
			
			_initRender();
			_initSkin();
			
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
				_render.addEventListener(events.CHATEASE_VIEW_PROPERTY, _forward);
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
				height: model.config.height
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
				case 32: // space
					
					break;
				default:
					break;
			}
			
			if (/13|32/.test(e.keyCode)) {
				// Prevent keypresses from scrolling the screen
				e.preventDefault ? e.preventDefault() : e.returnValue = false;
				return false;
			}
		}
		
		function _onResize(e) {
			//_this.resize();
		}
		
		_this.resize = function(width, height) {
			if (_render) {
				_render.resize(width, height);
			}
			if (_skin) {
				_skin.resize(width, height);
			}
		};
		
		_this.destroy = function() {
			if (_wrapper) {
				_wrapper.removeEventListener('keydown', _onKeyDown);
			}
			if (_render) {
				_render.destroy();
			}
		};
		
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
			_filter,
			_retrycount = 0;
		
		function _init() {
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
		
		_this.send = function(data) {
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
				_error(errors.FORBIDDED, data);
				return;
			}
			
			_websocket.send(JSON.stringify(data));
		};
		
		function _connect() {
			if (_websocket && model.getState() == states.CONNECTED) {
				utils.log('Websocket had connected already.');
				return;
			}
			
			view.show('聊天室连接中…');
			
			try {
				window.WebSocket = window.WebSocket || window.MozWebSocket;
				if (window.WebSocket) {
					if (!_websocket) {
						_websocket = new WebSocket(model.config.url);
					}
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
			}
		}
		
		_this.onOpen = function(e) {
			model.setState(states.CONNECTED);
		};
		
		_this.onMessage = function(e) {
			var data;
			
			try {
				data = eval('(' + e.data + ')');
			} catch (err) {
				utils.log('Failed to parse JSON. \nError: ' + err + '\ndata: ' + e.data);
				return;
			}
			
			switch (data.raw) {
				case raws.IDENT:
					var userinfo = model.getProperty('userinfo');
					userinfo.set(utils.extend({}, data.user, {
						channel: data.channel.id,
						state: data.channel.state
					}));
					
					view.show('已加入房间（' + userinfo.channel + '）。');
					
					if (!!(userinfo.state & channelStates.MUTED)) {
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
							_filter = new utils.filter(model.keywords);
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
				case errors.FORBIDDED:
					explain = '权限错误！';
					break;
				case errors.NOT_FOUND:
					explain = '未知请求！';
					break;
				case errors.CONFLICT:
					explain = '操作频繁！';
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
					view.show('聊天室已连接…');
					_retrycount = 0;
					_this.dispatchEvent(events.CHATEASE_CONNECT);
					break;
					
				case states.CLOSED:
					view.show('聊天室连接已断开！');
					_this.dispatchEvent(events.CHATEASE_CLOSE, { channel: { id: model.channel } });
					_reconnect();
					break;
					
				case states.ERROR:
					view.show('聊天室异常！');
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
				var delay = Math.ceil(model.config.retrydelay + Math.random() * 5000);
				
				view.show('正在准备重连，' + delay / 1000 + '秒...');
				
				_retrycount++;
				_websocket = null;
				
				setTimeout(_connect, delay);
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
			if (_websocket) 
				_websocket.close();
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
			width: 300,
			height: 450,
			keywords: '',
	 		maxlength: 30,    // -1: no limit
	 		maxrecords: 50,
	 		maxretries: -1,   // -1: always
	 		retrydelay: 3000,
			render: {
				name: rendermodes.DEFAULT,
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
