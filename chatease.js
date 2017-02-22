chatease = function() {
	if (chatease.api) {
		return chatease.api.getInstance.apply(this, arguments);
	}
};

chatease.version = '1.0.00';

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
			_this.renderName = renderName;
			
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
		BAD_REQUEST:  400,
		UNAUTHORIZED: 401,
		FORBIDDED:    403,
		NOT_FOUND:    404,
		CONFLICT:     409
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
		CSS_RELATIVE = 'relative',
		CSS_NORMAL = 'normal',
		CSS_IMPORTANT = ' !important',
		CSS_HIDDEN = 'hidden',
		CSS_NONE = 'none',
		CSS_BLOCK = 'block',
		
		TITLE_HEIGHT = '40px',
		CONTROLS_HEIGHT = '40px',
		SENDBTN_WIDTH = '50px';
	
	skins.def = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('skins.def')),
			_width = config.width,
			_height = config.height;
		
		function _init() {
			_this.name = skinmodes.DEFAULT;
			
			SKIN_CLASS += '-' + _this.name;
			
			css('.' + WRAP_CLASS, {
				width: _width + 'px',
				height: _height + 'px',
				'box-shadow': '0 1px 1px rgba(0, 0, 0, 0.05)'
			});
			css('.' + WRAP_CLASS + ' *', {
				margin: '0',
				padding: '0',
				'font-family': '微软雅黑,arial,sans-serif',
				'font-size': '14px',
				'font-weight': CSS_NORMAL,
				'box-sizing': 'content-box'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS, {
				width: _width - 2 + 'px',
				height: _height - 2 + 'px',
				border: '1px solid #1184ce',
				'border-radius': '4px',
				position: CSS_RELATIVE
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + TITLE_CLASS, {
				padding: 'auto 12px',
				width: CSS_100PCT,
				height: TITLE_HEIGHT,
				
				'font-family': 'inherit',
				'font-weight': CSS_NORMAL,
				color: '#FFFFFF',
				
				'text-align': 'center',
				'line-height': TITLE_HEIGHT,
				'vertical-align': 'middle',
				
				'box-shadow': CSS_NONE,
				'background-color': '#1184CE',
				
				cursor: 'not-allowed',
				'pointer-events': CSS_NONE
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS, {
				width: CSS_100PCT,
				height: (_height - 2 - parseInt(TITLE_HEIGHT) - parseInt(CONTROLS_HEIGHT)) * 0.75 + 'px',
				'max-height': (_height - 2 - parseInt(TITLE_HEIGHT) - parseInt(CONTROLS_HEIGHT)) * 0.75 + 'px',
				'overflow-y': 'auto',
				'background-color': '#F8F8F8'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div', {
				margin: '5px',
				'word-break': 'break-all',
				'word-wrap': 'break-word'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div.' + NICK_SYSTEM_CLASS + ' > a', {
				'font-style': CSS_NORMAL,
				'font-weight': 'bold',
				color: 'red'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div.' + NICK_MYSELF_CLASS, {
				//'text-align': 'right'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div.' + NICK_MYSELF_CLASS + ' > a', {
				
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.' + ICON_VISITOR_CLASS, {
				'margin-right': '5px'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.' + ICON_NORMAL_CLASS, {
				'margin-right': '5px'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.' + ICON_VIP_CLASS + '1', {
				
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
				
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > a', {
				'margin-right': '5px',
				color: '#1184CE',
				'text-decoration': CSS_NONE,
				cursor: 'pointer'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS, {
				width: CSS_100PCT,
				height: parseInt(CONTROLS_HEIGHT) - 2 + 'px',
				border: '1px solid #1184CE',
				'border-width': '1px 0'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' > *', {
				'margin': '5px',
				height: parseInt(CONTROLS_HEIGHT) - 12 + 'px',
				'line-height': parseInt(CONTROLS_HEIGHT) - 12 + 'px',
				'text-align': 'center',
				'vertical-align': 'middle',
				'box-sizing': 'border-box',
				display: 'inline-block'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' > .' + CHECKBOX_CLASS, {
				color: '#666666',
				'vertical-align': 'middle',
				cursor: 'pointer'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' > .' + CHECKBOX_CLASS + ' > label', {
				height: parseInt(CONTROLS_HEIGHT) - 12 + 'px',
				display: 'block'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' > .' + CHECKBOX_CLASS + ' input[type=checkbox]', {
				'margin-right': '5px',
				cursor: 'pointer'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' > .' + CHECKBOX_CLASS + ' a', {
				
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' > .' + BUTTON_CLASS, {
				padding: '3px 5px',
				color: '#FFFFFF',
				'text-align': 'center',
				'vertical-align': 'middle',
				'border-radius': '3px',
				'background-color': '#1184CE',
				cursor: 'pointer'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' .shieldtext', {
				'float': 'left'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' .clearscreen', {
				'float': 'right'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DIALOG_CLASS, {
				width: CSS_100PCT,
				height: (_height - 2 - parseInt(TITLE_HEIGHT) - parseInt(CONTROLS_HEIGHT)) * 0.25 + 'px',
				position: CSS_RELATIVE,
				overflow: CSS_HIDDEN
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DIALOG_CLASS + ' .' + INPUT_CLASS, {
				position: 'relative'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DIALOG_CLASS + ' .' + INPUT_CLASS + ' textarea', {
				'float': 'left',
				margin: '0',
				padding: '5px 10px',
				width: _width - 2 - parseInt(SENDBTN_WIDTH) + 'px',
				height: (_height - 2 - parseInt(TITLE_HEIGHT) - parseInt(CONTROLS_HEIGHT)) * 0.25 - 2 + 'px',
				resize: CSS_NONE,
				border: '0 none',
				'border-radius': '0 0 0 4px',
				'box-sizing': 'border-box',
				overflow: 'auto'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DIALOG_CLASS + ' .' + INPUT_CLASS + ' button', {
				'float': 'left',
				padding: 0,
				width: SENDBTN_WIDTH,
				height: (_height - 2 - parseInt(TITLE_HEIGHT) - parseInt(CONTROLS_HEIGHT)) * 0.25 + 'px',
				color: '#FFFFFF',
				border: '0 none',
				'box-sizing': 'border-box',
				'background-color': '#1184CE',
				cursor: 'pointer'
			});
			
			if (utils.isMSIE(7)) {
				css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DIALOG_CLASS + ' .' + INPUT_CLASS + ' textarea', {
					width: _width - 2 - parseInt(SENDBTN_WIDTH) - 20 + 'px',
					height: (_height - 2 - parseInt(TITLE_HEIGHT) - parseInt(CONTROLS_HEIGHT)) * 0.25 - 12 + 'px'
				});
				css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DIALOG_CLASS + ' .' + INPUT_CLASS + ' button', {
					height: (_height - 2 - parseInt(TITLE_HEIGHT) - parseInt(CONTROLS_HEIGHT)) * 0.25 + 'px'
				});
			}
		}
		
		_this.resize = function(width, height) {
			utils.log('Resizing to ' + width + ', ' + height);
			
			_width = parseInt(width);
			_height = parseInt(height);
			/*
			var _wrapper = document.getElementById(config.id),
				_renderLayer = document.getElementById(config.prefix + RENDER_CLASS),
				_mainLayer = document.getElementById(config.prefix + MAIN_CLASS),
				_consoleLayer = document.getElementById(config.prefix + CONSOLE_CLASS),
				_dialogLayer = document.getElementById(config.prefix + DIALOG_CLASS),
				_textInput = document.getElementById(config.prefix + INPUT_CLASS),
				_sendButton = document.getElementById(config.prefix + SUBMIT_CLASS);
			
			css.style(_wrapper, {
				width: config.width + 'px',
				height: config.height + 'px'
			});
			css.style(_renderLayer, {
				width: config.width - 2 + 'px',
				height: config.height - 2 + 'px'
			});
			css.style(_mainLayer, {
				height: config.height -2 - parseInt(TITLE_HEIGHT) + 'px'
			});
			css.style(_consoleLayer, {
				height: (config.height - parseInt(TITLE_HEIGHT)) * 0.75 + 'px'
			});
			css.style(_dialogLayer, {
				height: (config.height -1 - parseInt(TITLE_HEIGHT)) * 0.25 + 'px'
			});
			css.style(_textInput, {
				width: config.width -2 - parseInt(SENDBTN_WIDTH) + 'px',
				height: (config.height - parseInt(TITLE_HEIGHT)) * 0.25 - parseInt(CONTROLS_HEIGHT) - 2 + 'px'
			});
			css.style(_sendButton, {
				height: (config.height - parseInt(TITLE_HEIGHT)) * 0.25 - parseInt(CONTROLS_HEIGHT) -2 + 'px'
			});
			
			if (utils.isMSIE(7)) {
				css.style(_textInput, {
					width: config.width -2 - parseInt(SENDBTN_WIDTH) - 20 + 'px',
					height: (config.height - parseInt(TITLE_HEIGHT)) * 0.25 - parseInt(CONTROLS_HEIGHT) - 12 + 'px'
				});
				css.style(_sendButton, {
					height: (config.height - parseInt(TITLE_HEIGHT)) * 0.25 - parseInt(CONTROLS_HEIGHT) + 'px'
				});
			}*/
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
		skins = core.skins,
		skinmodes = skins.modes,
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
	
	renders.def = function(view, config) {
		var _this = utils.extend(this, new events.eventdispatcher('renders.def')),
			_defaults = {},
			_renderLayer,
			_titleLayer,
			_consoleLayer,
			_controlsLayer,
			_dialogLayer,
			
			_inputLayer,
			_textInput,
			_sendButton;
		
		function _init() {
			_this.name = rendermodes.DEFAULT;
			
			_this.config = utils.extend({}, _defaults, config);
			
			_renderLayer = utils.createElement('div', RENDER_CLASS);
			
			_buildComponents();
		}
		
		function _buildComponents() {
			// title
			_titleLayer = utils.createElement('div', TITLE_CLASS);
			_renderLayer.appendChild(_titleLayer);
			
			_titleLayer.innerHTML = '聊天室';
			
			// console
			_consoleLayer = utils.createElement('div', CONSOLE_CLASS);
			_renderLayer.appendChild(_consoleLayer);
			
			// controls
			_controlsLayer = utils.createElement('div', CONTROLS_CLASS);
			_renderLayer.appendChild(_controlsLayer);
			
			var shieldChk = _getCheckBox('屏蔽消息', CHECKBOX_CLASS + ' shieldtext', events.CHATEASE_VIEW_SHIELDMSG, null, false);
			_controlsLayer.appendChild(shieldChk);
			
			var clearBtn = _getButton('清屏', BUTTON_CLASS + ' clearscreen', events.CHATEASE_VIEW_CLEARSCREEN, null);
			_controlsLayer.appendChild(clearBtn);
			
			// dialog
			_dialogLayer = utils.createElement('div', DIALOG_CLASS);
			_renderLayer.appendChild(_dialogLayer);
			
			_inputLayer = utils.createElement('div', INPUT_CLASS);
			_dialogLayer.appendChild(_inputLayer);
			
			_textInput = utils.createElement('textarea');
			_inputLayer.appendChild(_textInput);
			
			_sendButton = utils.createElement('button');
			_inputLayer.appendChild(_sendButton);
			
			// textarea
			_textInput.setAttribute('placeholder', '输入聊天内容');
			if (_this.config.maxlength) {
				_textInput.setAttribute('maxlength', _this.config.maxlength);
			}
			
			var handler = (function() {
				return function(event) {
					var e = window.event || event;
					if (e.keyCode != 13){
						return;
					}
					
					if (e.ctrlKey){
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
			
			var lb = utils.createElement('label');
			box.appendChild(lb);
			
			// input
			var input = utils.createElement('input');
			lb.appendChild(input);
			
			input.type = 'checkbox';
			input.checked = !!checked;
			
			var handler = (function(event, data) {
				return function(e) {
					_this.dispatchEvent(event, utils.extend({ checked: input.checked }, data));
				};
			})(event, data);
			
			try {
				input.addEventListener('change', handler);
			} catch (err) {
				input.attachEvent('onchange', handler);
			}
			
			// label
			var txt = utils.createElement('a');
			lb.appendChild(txt);
			
			txt.innerHTML = label;
			
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
			
		};
		
		_this.show = function(text, user, type) {
			// set default
			if (utils.typeOf(user) != 'object') {
				user = { id: 0, name: '[系统]', role: roles.SYSTEM };
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
			a.innerHTML = user.name;
			
			var nickHandler = (function(user) {
				return function(e) {
					_this.dispatchEvent(events.CHATEASE_VIEW_NICKCLICK, { user: user } );
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
				text: _textInput.value,
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
			return _renderLayer;
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
			_this.view = _view = new core.view(_this, _model);
			_this.controller = _controller = new core.controller(_model, _view);
			
			_controller.addGlobalListener(_forward);
			
			_initializeAPI();
		}
		
		function _initializeAPI() {
			_this.send = _controller.send;
			
			_this.getState = _model.getState;
			
			_this.resize = _view.resize;
		}
		
		_this.setup = function() {
			setTimeout(function() {
				_view.setup();
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
		 	_state = states.STOPPED,
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
			_this.dispatchEvent(events.SLCIEASE_STATE, { state: state });
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
			return _this.config[name] || {};
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
		roles = core.model.roles,
		renders = core.renders,
		renderModes = renders.modes,
		skins = core.skins,
		skinmodes = skins.modes,
		css = utils.css,
		
		WRAP_CLASS = 'cha-wrapper',
		SKIN_CLASS = 'cha-skin',
		RENDER_CLASS = 'cha-render',
		POSTER_CLASS = 'cha-poster',
		CONTEXTMENU_CLASS = 'cha-contextmenu';
	
	core.view = function(entity, model) {
		var _this = utils.extend(this, new events.eventdispatcher('core.view')),
			_wrapper,
			_renderLayer,
			_posterLayer,
			_contextmenuLayer,
			_render,
			_skin,
			_errorOccurred = false;
		
		function _init() {
			_wrapper = utils.createElement('div', WRAP_CLASS + ' ' + SKIN_CLASS + '-' + model.config.skin.name);
			_wrapper.id = entity.id;
			_wrapper.tabIndex = 0;
			
			_renderLayer = utils.createElement('div', RENDER_CLASS);
			_posterLayer = utils.createElement('div', POSTER_CLASS);
			_contextmenuLayer = utils.createElement('div', CONTEXTMENU_CLASS);
			
			_wrapper.appendChild(_renderLayer);
			_wrapper.appendChild(_posterLayer);
			_wrapper.appendChild(_contextmenuLayer);
			
			_initRender();
			_initSkin();
			
			var replace = document.getElementById(entity.id);
			replace.parentNode.replaceChild(_wrapper, replace);
			
			window.onresize = function() {
				if (utils.typeOf(model.config.onresize) == 'function') {
					model.config.onresize.call(null);
				}
			};
		}
		
		function _initRender() {
			var cfg = utils.extend({}, model.getConfig('render'), {
				id: entity.id,
				width: model.config.width,
				height: model.config.height,
				maxlength: model.maxlength,
				maxrecords: model.maxRecords
			});
			
			try {
				_render = _this.render = new renders[cfg.name](_this, cfg);
				_render.addEventListener(events.CHATEASE_VIEW_SEND, _forward);
				_render.addEventListener(events.CHATEASE_VIEW_SHIELDMSG, _forward);
				_render.addEventListener(events.CHATEASE_VIEW_CLEARSCREEN, _forward);
				_render.addEventListener(events.CHATEASE_VIEW_NICKCLICK, _forward);
				_render.addEventListener(events.CHATEASE_RENDER_ERROR, _onRenderError);
			} catch (err) {
				utils.log('Failed to init render ' + cfg.name + '!');
			}
			
			if (_render) {
				_wrapper.replaceChild(_render.element(), _renderLayer);
			}
		}
		
		function _initSkin() {
			var cfg = utils.extend({}, model.getConfig('skin'), {
				id: entity.id,
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
			if (!_render) {
				_this.dispatchEvent(events.CHATEASE_SETUP_ERROR, { message: 'Render not available!', name: model.config.render.name });
				return;
			}
			_render.setup();
			
			// Ignore skin failure.
			
			try {
				_wrapper.addEventListener('keydown', _onKeyDown);
			} catch (err) {
				_wrapper.attachEvent('onkeydown', _onKeyDown);
			}
			
			_this.dispatchEvent(events.CHATEASE_READY);
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
					_render.send();
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
		
		_this.send = function(data) {
			if (!_websocket || model.state == states.CLOSED) {
				_connect();
				return;
			}
			
			if (utils.typeOf(data) != 'object' || data.hasOwnProperty('cmd') == false) {
				_onError(errors.BAD_REQUEST, data);
				return;
			}
			
			var userinfo = model.getProperty('userinfo');
			if (userinfo.isActive() == false) {
				_onError(errors.CONFLICT, data);
				return;
			}
			if (userinfo.isMuted() == true) {
				_onError(errors.FORBIDDED, data);
				return;
			}
			
			_websocket.send(JSON.stringify(data));
		};
		
		function _connect() {
			if (_websocket && model.state != states.CONNECTED) {
				utils.log('Websocket had connected already.');
				return;
			}
			
			view.show('聊天室连接中…');
			
			try {
				if (window.WebSocket) {
					_websocket = new WebSocket(model.config.url);
				} else if (window.MozWebSocket) {
					_websocket = new MozWebSocket(model.config.url);
				} else {
					_websocket = new SockJS(model.config.url.replace(/^ws/, 'http') + '/sockjs');
				}
			} catch (err) {
				utils.log('Failed to initialize websocket: ' + err);
				return;
			}
			
			_websocket.onopen = function(e) {
				model.setState(states.CONNECTED);
			};
			_websocket.onmessage = _onmessage;
			_websocket.onerror = function(e) {
				model.setState(states.ERROR);
			};
			_websocket.onclose = function(e) {
				model.setState(states.CLOSED);
			};
		}
		
		function _onmessage(e) {
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
						role: data.channel.role,
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
						data.text = _filter.replace(data.text);
					} catch (err) {
						// Ignore this failure.
						utils.log('Failed to execute filter.');
					}
					
					view.show(data.text, data.user, data.type);
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
					
				case raws.ERROR:
					_onError(data.error.code, data);
					break;
					
				default:
					utils.log('Unknown data type: ' + data.raw + ', ignored.');
					break;
			}
		}
		
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
		
		function _onError(code, params) {
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
		
		function _onReady(e) {
			if (!_ready) {
				_ready = true;
				_forward(e);
				
				_connect();
				
				window.onbeforeunload = function(e) {
					if (_websocket && model.state == states.CONNECTED) {
						_websocket.close();
					}
				};
			}
		}
		
		function _onViewSend(e) {
			var text = e.data.text;
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
				text: text,
				type: e.data.type,
				channel: userinfo.channel
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
			url: 'ws://' + window.location.host + '/chatease/ch1',
			width: 300,
			height: 450,
			keywords: '',
	 		maxlength: 30,    // -1: no limit
	 		maxrecords: 50,
	 		maxretries: -1,   // -1: always
	 		retrydelay: 3000,
			render: {
				name: rendermodes.DEFAULT
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
