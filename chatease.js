chatease = function() {
	if (chatease.api) {
		return chatease.api.getInstance.apply(this, arguments);
	}
};

chatease.version = '0.1.10';
chatease.debug = false;

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
		ERROR: 'ERROR',
		
		// API Events
		CHATEASE_READY: 'chateaseReady',
		CHATEASE_SETUP_ERROR: 'chateaseSetupError',
		CHATEASE_RENDER_ERROR: 'chateaseRenderError',
		
		CHATEASE_STATE: 'chateaseState',
		CHATEASE_CONNECT: 'chateaseConnect',
		CHATEASE_INDENT: 'chateaseIdent',
		CHATEASE_MESSAGE: 'chateaseMessage',
		CHATEASE_JOIN: 'chateaseJoin',
		CHATEASE_LEFT: 'chateaseLeft',
		CHATEASE_ERROR: 'chateaseError',
		CHATEASE_CLOSE: 'chateaseClose',
		
		CHATEASE_VIEW_SEND: 'chateaseViewSend',
		CHATEASE_VIEW_SHIELDMSG: 'chateaseViewMsgShield',
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
			
			_this.config = options;
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
	chatease.core.renders = {};
})(chatease);

(function(chatease) {
	chatease.core.renders.modes = {
		DEFAULT: 'def'
	};
})(chatease);

(function(chatease) {
	chatease.core.renders.skins = {};
})(chatease);

(function(chatease) {
	chatease.core.renders.skins.modes = {
		DEFAULT: 'def'
	};
})(chatease);

(function(chatease) {
	var utils = chatease.utils,
		events = chatease.events,
		skins = chatease.core.renders.skins,
		css = utils.css,
		
		WRAP_CLASS = 'chatwrap',
		RENDER_CLASS = 'render',
		TITLE_CLASS = 'title',
		MAIN_CLASS = 'main',
		CONSOLE_CLASS = 'console',
		DIALOG_CLASS = 'dialog',
		CONTROL_CLASS = 'control',
		INPUT_CLASS = 'input',
		SUBMIT_CLASS = 'submit',
		NICK_SYSTEM_CLASS = 'system',
		NICK_MYSELF_CLASS = 'myself',
		BUTTON_CLASS = 'btn',
		CHECKBOX_CLASS = 'ch',
		
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
		
		TITLE_HEIGHT = '34px',
		CONTROL_HEIGHT = '38px',
		SENDBTN_WIDTH = '46px';
	
	skins.def = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('skins.def'));
		
		css('.' + WRAP_CLASS, {
			width: config.width + 'px',
			height: config.height + 'px',
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
		
		css('.' + RENDER_CLASS, {
			width: config.width - 2 + 'px',
			height: config.height - 2 + 'px',
			border: '1px solid #1184ce',
			'border-radius': '4px',
			position: CSS_RELATIVE
		});
		
		css(' .' + TITLE_CLASS, {
			padding: 'auto 12px',
			width: CSS_100PCT,
			height: TITLE_HEIGHT,
			
			'font-family': 'inherit',
			'font-weight': CSS_NORMAL,
			color: '#fff',
			//opacity: 0.65,
			
			'text-align': 'center',
			'line-height': TITLE_HEIGHT,
			'vertical-align': 'middle',
			
			'box-shadow': CSS_NONE,
			'background-color': '#1184ce',
			
			cursor: 'not-allowed',
			'pointer-events': CSS_NONE
		});
		css(' .' + TITLE_CLASS + ' span', {
			top: '2px',
			'margin-left': '2px'
		});
		
		css(' .' + MAIN_CLASS, {
			width: CSS_100PCT,
			height: config.height -2 - parseInt(TITLE_HEIGHT) + 'px'
		});
		
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS, {
			width: CSS_100PCT,
			height: (config.height - parseInt(TITLE_HEIGHT)) * 0.75 + 'px',
			'max-height': '75%',
			'overflow-y': 'auto',
			'background-color': '#f8f8f8'
		});
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS + ' > div', {
			margin: '5px',
			'word-break': 'break-all',
			'word-wrap': 'break-word'
		});
		
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS + ' > div > span', {
			'margin-right': '5px'
		});
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.vip1', {
			
		});
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.vip2', {
			
		});
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.vip3', {
			
		});
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.vip4', {
			
		});
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.vip5', {
			
		});
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.vip6', {
			
		});
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.vip7', {
			
		});
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.temporary', {
			
		});
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.manager', {
			
		});
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.owner', {
			
		});
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.system', {
			
		});
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.admin', {
			
		});
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS + ' > div > a', {
			'margin-right': '5px',
			color: '#1184ce',
			'text-decoration': CSS_NONE,
			cursor: 'pointer'
		});
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS + ' > div.' + NICK_SYSTEM_CLASS + ' > a', {
			'font-style': CSS_NORMAL,
			'font-weight': 'bold',
			color: 'red'
		});
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS + ' > div.' + NICK_MYSELF_CLASS, {
			//'text-align': 'right'
		});
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS + ' > div.' + NICK_MYSELF_CLASS + ' > a', {
			/*'margin-right': 0,
			'margin-left': '5px'*/
		});
		
		css(' .' + MAIN_CLASS + ' .' + DIALOG_CLASS, {
			width: CSS_100PCT,
			height: (config.height -1 - parseInt(TITLE_HEIGHT)) * 0.25 + 'px',
			position: CSS_RELATIVE,
			overflow: CSS_HIDDEN
		});
		
		css(' .' + MAIN_CLASS + ' .' + DIALOG_CLASS + ' .' + CONTROL_CLASS, {
			width: CSS_100PCT,
			height: CONTROL_HEIGHT,
			border: '1px solid #1184ce',
			'border-width': '1px 0'
		});
		css(' .' + MAIN_CLASS + ' .' + DIALOG_CLASS + ' .' + CONTROL_CLASS + ' > *', {
			'margin': '0 5px',
			height: CSS_100PCT,
			'line-height': CONTROL_HEIGHT,
			'text-align': 'center',
			'vertical-align': 'middle',
			'box-sizing': 'border-box',
			display: 'inline-block'
		});
		css(' .' + MAIN_CLASS + ' .' + DIALOG_CLASS + ' .' + CONTROL_CLASS + ' > div > .' + CHECKBOX_CLASS, {
			color: '#666',
			'vertical-align': 'middle',
			cursor: 'pointer'
		});
		css(' .' + MAIN_CLASS + ' .' + DIALOG_CLASS + ' .' + CONTROL_CLASS + ' > div > .' + CHECKBOX_CLASS + ' input[type=checkbox]', {
			'margin-right': '5px',
			cursor: 'pointer'
		});
		css(' .' + MAIN_CLASS + ' .' + DIALOG_CLASS + ' .' + CONTROL_CLASS + ' > div > .' + CHECKBOX_CLASS + ' a', {
			
		});
		css(' .' + MAIN_CLASS + ' .' + DIALOG_CLASS + ' .' + CONTROL_CLASS + ' > div > .' + BUTTON_CLASS, {
			padding: '3px 5px',
			color: '#fff',
			'text-align': 'center',
			'vertical-align': 'middle',
			'border-radius': '3px',
			'background-color': '#1184ce',
			cursor: 'pointer'
		});
		css(' .' + MAIN_CLASS + ' .' + DIALOG_CLASS + ' .' + CONTROL_CLASS + ' .msgshield', {
			'float': 'left'
		});
		css(' .' + MAIN_CLASS + ' .' + DIALOG_CLASS + ' .' + CONTROL_CLASS + ' .clrscreen', {
			'float': 'right'
		});
		css(' .' + MAIN_CLASS + ' .' + DIALOG_CLASS + ' .' + CONTROL_CLASS + ' .clrscreen span', {
			top: '2px',
			'margin-left': '2px'
		});
		
		css(' .' + MAIN_CLASS + ' .' + DIALOG_CLASS + ' .' + INPUT_CLASS, {
			//padding: '0 10px 10px',
			//width: CSS_100PCT,
			//height: (config.height - parseInt(TITLE_HEIGHT)) * 0.25 - parseInt(CONTROL_HEIGHT) - 6 + 'px'
			position: 'relative'
		});
		css(' .' + MAIN_CLASS + ' .' + DIALOG_CLASS + ' .' + INPUT_CLASS + ' textarea', {
			'float': 'left',
			margin: '0',
			padding: '5px 10px',
			width: config.width -2 - parseInt(SENDBTN_WIDTH) + 'px',
			height: (config.height - parseInt(TITLE_HEIGHT)) * 0.25 - parseInt(CONTROL_HEIGHT) - 2 + 'px',
			resize: CSS_NONE,
			border: '0 none',
			'border-radius': '0 0 0 4px',
			'box-sizing': 'border-box',
			overflow: 'auto'
		});
		css(' .' + MAIN_CLASS + ' .' + DIALOG_CLASS + ' .' + INPUT_CLASS + ' button', {
			'float': 'left',
			padding: 0,
			width: SENDBTN_WIDTH,
			height: (config.height - parseInt(TITLE_HEIGHT)) * 0.25 - parseInt(CONTROL_HEIGHT) -2 + 'px',
			color: '#fff',
			border: '0 none',
			'box-sizing': 'border-box',
			'background-color': '#1184ce',
			cursor: 'pointer'
		});
		
		if (utils.isMSIE(7)) {
			css(' .' + MAIN_CLASS + ' .' + DIALOG_CLASS + ' .' + INPUT_CLASS + ' textarea', {
				width: config.width -2 - parseInt(SENDBTN_WIDTH) - 20 + 'px',
				height: (config.height - parseInt(TITLE_HEIGHT)) * 0.25 - parseInt(CONTROL_HEIGHT) - 12 + 'px'
			});
			css(' .' + MAIN_CLASS + ' .' + DIALOG_CLASS + ' .' + INPUT_CLASS + ' button', {
				height: (config.height - parseInt(TITLE_HEIGHT)) * 0.25 - parseInt(CONTROL_HEIGHT) + 'px'
			});
		}
		
		_this.resize = function(width, height) {
			utils.log('Resizing to ' + width + ', ' + height);
			config.width = parseInt(width);
			config.height = parseInt(height);
			
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
				height: (config.height - parseInt(TITLE_HEIGHT)) * 0.25 - parseInt(CONTROL_HEIGHT) - 2 + 'px'
			});
			css.style(_sendButton, {
				height: (config.height - parseInt(TITLE_HEIGHT)) * 0.25 - parseInt(CONTROL_HEIGHT) -2 + 'px'
			});
			
			if (utils.isMSIE(7)) {
				css.style(_textInput, {
					width: config.width -2 - parseInt(SENDBTN_WIDTH) - 20 + 'px',
					height: (config.height - parseInt(TITLE_HEIGHT)) * 0.25 - parseInt(CONTROL_HEIGHT) - 12 + 'px'
				});
				css.style(_sendButton, {
					height: (config.height - parseInt(TITLE_HEIGHT)) * 0.25 - parseInt(CONTROL_HEIGHT) + 'px'
				});
			}
		};
	};
})(chatease);

(function(chatease) {
	var utils = chatease.utils,
		events = chatease.events,
		core = chatease.core,
		renders = core.renders,
		skins = renders.skins,
		skinModes = skins.modes,
		css = utils.css,
		
		RENDER_CLASS = 'render',
		TITLE_CLASS = 'title',
		MAIN_CLASS = 'main',
		CONSOLE_CLASS = 'console',
		DIALOG_CLASS = 'dialog',
		CONTROL_CLASS = 'control',
		INPUT_CLASS = 'input',
		SUBMIT_CLASS = 'submit',
		NICK_SYSTEM_CLASS = 'system',
		NICK_MYSELF_CLASS = 'myself',
		BUTTON_CLASS = 'btn',
		CHECKBOX_CLASS = 'ch',
		
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
			_defaults = {
				skin: {
					name: skinModes.DEFAULT // 'def'
				},
				prefix: 'chat-'
			},
			_renderLayer,
			_titleLayer,
			_mainLayer,
			_consoleLayer,
			_dialogLayer,
			_controlLayer,
			_inputLayer,
			
			_titleIcon,
			_textInput,
			_sendButton,
			
			_defaultLayout = '[msgshield][clrscreen]',
			_buttons,
			_skin;
		
		function _init() {
			_this.config = utils.extend({}, _defaults, config);
			
			_renderLayer = utils.createElement('div', RENDER_CLASS);
			_titleLayer = utils.createElement('div', TITLE_CLASS);
			_mainLayer = utils.createElement('div', MAIN_CLASS);
			_renderLayer.appendChild(_titleLayer);
			_renderLayer.appendChild(_mainLayer);
			
			_consoleLayer = utils.createElement('div', CONSOLE_CLASS);
			_dialogLayer = utils.createElement('div', DIALOG_CLASS);
			_mainLayer.appendChild(_consoleLayer);
			_mainLayer.appendChild(_dialogLayer);
			
			_controlLayer = utils.createElement('div', CONTROL_CLASS);
			_inputLayer = utils.createElement('div', INPUT_CLASS);
			_dialogLayer.appendChild(_controlLayer);
			_dialogLayer.appendChild(_inputLayer);
			
			_titleLayer.innerHTML = '聊天室';
			/*_titleIcon = utils.createElement('span', 'glyphicon glyphicon-envelope');
			_titleLayer.appendChild(_titleIcon);*/
			
			_buildComponents();
			
			_textInput = utils.createElement('textarea');
			_textInput.setAttribute('placeholder', '输入聊天内容');
			if (_this.config.maxlength) 
				_textInput.setAttribute('maxlength', _this.config.maxlength);
			try {
				_textInput.addEventListener('keypress', _onKeyPress);
			} catch(e) {
				_textInput.attachEvent('onkeypress', _onKeyPress);
			}
			_inputLayer.appendChild(_textInput);
			
			_sendButton = utils.createElement('button');
			_sendButton.innerHTML = '发送';
			try {
				_sendButton.addEventListener('click', _onClick);
			} catch(e) {
				_sendButton.attachEvent('onclick', _onClick);
			}
			_inputLayer.appendChild(_sendButton);
			
			_setElementIds();
			
			try {
				_skin = new skins[_this.config.skin.name](_this.config);
			} catch (e) {
				utils.log('Failed to init skin[' + _this.config.skin.name + '].');
			}
			if (!_skin) {
				_this.dispatchEvent(events.CHATEASE_RENDER_ERROR, { message: 'No suitable skin found!', skin: _this.config.skin.name });
				return;
			}
		}
		
		function _buildComponents() {
			_addCheckBox('msgshield', events.CHATEASE_VIEW_SHIELDMSG, null, '屏蔽消息', false);
			_addButton('clrscreen', events.CHATEASE_VIEW_CLEARSCREEN, null, '清屏', 'glyphicon glyphicon-trash');
		}
		
		function _addCheckBox(name, event, data, label, checked) {
			var box = utils.createElement('div', name);
			var lb = utils.createElement('label', CHECKBOX_CLASS);
			var ch = utils.createElement('input');
			ch.type = 'checkbox';
			ch.checked = !!checked;
			try {
				ch.addEventListener('change', function(e) {
					_this.dispatchEvent(event, utils.extend({ shield: ch.checked }, data));
				});
			} catch(e) {
				ch.attachEvent('onchange', function(e) {
					_this.dispatchEvent(event, utils.extend({ shield: ch.checked }, data));
				});
			}
			lb.appendChild(ch);
			//lb.insertAdjacentHTML('beforeend', label);
			var txt = utils.createElement('a');
			txt.innerHTML = label;
			lb.appendChild(txt);
			box.appendChild(lb);
			_controlLayer.appendChild(box);
		}
		
		function _addButton(name, event, data, label, iconclass) {
			var box = utils.createElement('div', name);
			var btn = utils.createElement('a', BUTTON_CLASS);
			btn.innerHTML = label;
			try {
				btn.addEventListener('click', function(e) {
					_this.dispatchEvent(event, data);
				});
			} catch(e) {
				btn.attachEvent('onclick', function(e) {
					_this.dispatchEvent(event, data);
				});
			}
			
			/*var btnIcon = utils.createElement('span', iconclass);
			btn.appendChild(btnIcon);*/
			box.appendChild(btn);
			_controlLayer.appendChild(box);
		}
		
		function _setElementIds() {
			_renderLayer.id = _this.config.prefix + RENDER_CLASS;
			_mainLayer.id = _this.config.prefix + MAIN_CLASS;
			_consoleLayer.id = _this.config.prefix + CONSOLE_CLASS;
			_dialogLayer.id = _this.config.prefix + DIALOG_CLASS;
			_textInput.id = _this.config.prefix + INPUT_CLASS;
			_sendButton.id = _this.config.prefix + SUBMIT_CLASS;
		}
		
		_this.show = function(data, user) {
			var box = utils.createElement('div');
			
			var message;
			switch (utils.typeOf(data)) {
				case 'object':
					message = data.text;
					if (data.type == 'uni') {
						var span = utils.createElement('span');
						span.innerHTML = '[密语]';
						box.appendChild(span);
					}
					break;
				default:
					message = data;
			}
			
			switch (utils.typeOf(user)) {
				case 'string':
					if (user === '') 
						break;
					user = { id: 0, name: user, role: 0 }; // fall through
				case 'null':
					user = { id: 0, name: '[系统]', role: 64 }; // fall through
				case 'object':
					if (utils.typeOf(user.id) == null) 
						break;
					
					var boxclass = user.role >= 0 && (user.role & 0x40) ? NICK_SYSTEM_CLASS : (user.id == view.user().id ? NICK_MYSELF_CLASS : '');
					if (boxclass) 
						box.className = boxclass;
					
					var clazz = _getIconClazz(user.role);
					if (clazz) {
						var icon = utils.createElement('span', clazz);
						icon.innerHTML = clazz.substr(0, 1);
						box.appendChild(icon);
					}
					
					var a = utils.createElement('a');
					a.user = utils.extend({}, user);
					a.innerHTML = user.name;
					try {
						a.addEventListener('click', function(e) {
							_this.dispatchEvent(events.CHATEASE_VIEW_NICKCLICK, { user: this.user });
						});
					} catch(e) {
						a.attachEvent('onclick', function(e) {
							_this.dispatchEvent(events.CHATEASE_VIEW_NICKCLICK, { user: this.user });
						});
					}
					box.appendChild(a);
					break;
			}
			
			//box.insertAdjacentHTML(user && user.id == view.user().id ? 'afterbegin' : 'beforeend', message);
			box.insertAdjacentHTML('beforeend', message);
			
			if (_consoleLayer.childNodes.length >= _this.config.maxRecords) {
				_consoleLayer.removeChild(_consoleLayer.childNodes[0]);
			}
			_consoleLayer.appendChild(box);
			_consoleLayer.scrollTop = _consoleLayer.scrollHeight;
		};
		
		function _getIconClazz(role) {
			var clazz = '';
			switch (utils.typeOf(role)) {
				case 'string':
					role = parseInt(role);
					if (role == NaN || role < 0) break;
				case 'number':
					if (role & 0x80) {
						clazz = 'admin';
					} else if (role & 0x40) {
						//clazz = 'system';
					} else if (role & 0x20) {
						clazz = 'owner';
					} else if (role & 0x10) {
						clazz = 'manager';
					} else if (role & 0x08) {
						clazz = 'temporary';
					}
					if (role & 0x07) {
						clazz += (clazz.length ? ' ' : '') + 'vip' + (role & 0x07);
					}
					break;
				default:
					break;
			}
			
			return clazz;
		}
		
		function _onKeyPress(event) {
			var e = window.event || event;
			if (e.keyCode != 13){
				return;
			}
			
			if (e.ctrlKey){
				_textInput.value += '\r\n';
			} else {
				_this.send();
				
				if (window.event) {
					window.event.returnValue = false;
				} else {
					e.preventDefault();
				}
			}
		}
		
		function _onClick(e) {
			_this.send();
		}
		
		_this.send = function() {
			_this.dispatchEvent(events.CHATEASE_VIEW_SEND, { message: _textInput.value, userId: null });
			_this.clearInput();
		}
		
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
			width = width || _renderLayer.offsetWidth || config.width;
			height = height || _renderLayer.offsetHeight || config.height;
			if (_skin) 
				_skin.resize(width, height);
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
			_this.resize = _view.resize;
		}
		
		_this.setup = function() {
			_view.setup();
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
	
	core.model = function(config) {
		 var _this = utils.extend(this, new events.eventdispatcher('core.model')),
		 	_defaults = {};
		
		function _init() {
			_this.config = utils.extend({}, _defaults, config);
			utils.extend(_this, {
				id: config.id,
				user: {
					id: NaN,
					name: '',
					role: -1
				},
				state: states.CLOSED,
				shieldMsg: false
			}, _this.config);
		}
		
		_this.setState = function(state) {
			if (state === _this.state) {
				return;
			}
			_this.state = state;
			_this.dispatchEvent(events.CHATEASE_STATE, { state: state });
		};
		
		_this.setMsgShield = function(shield) {
			if (shield === _this.shieldMsg) {
				return;
			}
			_this.shieldMsg = shield;
			_this.dispatchEvent(events.CHATEASE_VIEW_SHIELDMSG, { shield: shield });
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
		embed = chatease.embed,
		core = chatease.core,
		states = core.states,
		renders = core.renders,
		renderModes = renders.modes,
		css = utils.css,
		
		WRAP_CLASS = 'chatwrap';
	
	core.view = function(entity, model) {
		var _this = utils.extend(this, new events.eventdispatcher('core.view')),
			_wrapper,
			_render,
			_errorState = false;
		
		function _init() {
			_wrapper = utils.createElement('div', WRAP_CLASS);
			_wrapper.id = entity.id;
			_wrapper.tabIndex = 0;
			
			var replace = document.getElementById(entity.id);
			replace.parentNode.replaceChild(_wrapper, replace);
			
			window.onresize = function() {
				if (utils.typeOf(model.onresize) == 'function') 
					model.onresize.call(null);
				else 
					_this.resize();
			};
		}
		
		_this.setup = function() {
			_setupRender();
			try {
				_wrapper.addEventListener('keydown', _onKeyDown);
			} catch(e) {
				_wrapper.attachEvent('onkeydown', _onKeyDown);
			}
			
			setTimeout(function() {
				_this.dispatchEvent(events.CHATEASE_READY, { channelId: entity.id });
			}, 0);
		};
		
		function _setupRender() {
			switch (model.render.name) {
				case renderModes.DEFAULT:
					var renderConf = utils.extend(model.getConfig('render'), {
						id: model.id,
						width: model.width,
						height: model.height,
						maxlength: model.maxlength,
						maxRecords: model.maxRecords
					});
					_this.render = _render = new renders[renderModes.DEFAULT](_this, renderConf);
					break;
				default:
					_this.dispatchEvent(events.CHATEASE_SETUP_ERROR, { message: 'Unknown render mode!', render: model.render.name });
					break;
			}
			
			if (_render) {
				_render.addEventListener(events.CHATEASE_VIEW_SEND, _onSend);
				_render.addEventListener(events.CHATEASE_VIEW_SHIELDMSG, _onShieldMsg);
				_render.addEventListener(events.CHATEASE_VIEW_CLEARSCREEN, _onClearScreen);
				_render.addEventListener(events.CHATEASE_VIEW_NICKCLICK, _onNickClick);
				_render.addEventListener(events.CHATEASE_RENDER_ERROR, _onRenderError);
				_wrapper.appendChild(_render.element());
			}
		}
		
		function _onSend(e) {
			_forward(e);
		}
		
		function _onShieldMsg(e) {
			_forward(e);
		}
		
		function _onClearScreen(e) {
			_forward(e);
		}
		
		function _onNickClick(e) {
			_forward(e);
		}
		
		function _onRenderError(e) {
			_forward(e);
		}
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
		
		function _onKeyDown(e) {
			if (e.ctrlKey || e.metaKey) {
				return true;
			}
			
			switch (e.keyCode) {
				case 13: // enter
					_render.send();
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
		
		_this.show = function(message, user) {
			if (model.shieldMsg) {
				return;
			}
			if (_render) {
				_render.show(message, user);
			}
		};
		
		_this.user = function() {
			return model.user;
		};
		
		_this.resize = function(width, height) {
			if (_render) 
				_render.resize(width, height);
		};
		
		_this.destroy = function() {
			if (_wrapper) {
				_wrapper.removeEventListener('keydown', _onKeyDown);
			}
			if (_render) {
				_render.destroy();
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
	
	core.controller = function(model, view) {
		var _this = utils.extend(this, new events.eventdispatcher('core.controller')),
			_ready = false,
			_websocket,
			_filter,
			_lastSent = 0,
			_retriesCount = 0;
		
		function _init() {
			model.addEventListener(events.CHATEASE_STATE, _modelStateHandler);
			model.addEventListener(events.CHATEASE_VIEW_SHIELDMSG, _onModelShieldMsg);
			
			view.addEventListener(events.CHATEASE_READY, _onReady);
			view.addEventListener(events.CHATEASE_VIEW_SEND, _onSend);
			view.addEventListener(events.CHATEASE_VIEW_SHIELDMSG, _onViewShieldMsg);
			view.addEventListener(events.CHATEASE_VIEW_CLEARSCREEN, _onClearScreen);
			view.addEventListener(events.CHATEASE_VIEW_NICKCLICK, _onNickClick);
			view.addEventListener(events.CHATEASE_SETUP_ERROR, _onSetupError);
			view.addEventListener(events.CHATEASE_RENDER_ERROR, _onRenderError);
		}
		
		_this.send = function(message, userId) {
			if (!_websocket || model.state == states.CLOSED) {
				_connect();
				return;
			}
			_websocket.send(message);
		};
		
		function _connect() {
			if (_websocket) 
				return;
			
			try {
				var token = utils.getCookie('token');
				var paramstr = token ? ((model.url.indexOf('?') == -1 ? '?' : '&') + 'token=' + token) : '';
				if (window.WebSocket) {
					_websocket = new WebSocket(model.url + paramstr);
				} else if (window.MozWebSocket) {
					_websocket = new MozWebSocket(model.url + paramstr);
				} else {
					_websocket = new SockJS(model.url.replace(/^ws/, 'http') + '/sockjs');
				}
			} catch (err) {
				utils.log('Failed to initialize websocket.');
				return;
			}
			
			_websocket.onopen = function(e) {
				//utils.log('websocket.onopen');
				model.setState(states.CONNECTED);
			};
			_websocket.onmessage = function(e) {
				//utils.log('websocket.onmessage: ' + e.data);
				var data;
				try {
					data = eval('(' + e.data + ')');
				} catch (err) {
					utils.log('Eval failed. \nerr: ' + err + '\ndata: ' + e.data);
					return;
				}
				switch (data.raw) {
					case 'ident':
						utils.foreach(data.user, function(k, v) {
							if (model.user.hasOwnProperty(k)) {
								model.user[k] = v;
							}
						});
						model.interval = data.user.interval;
						_this.dispatchEvent(events.CHATEASE_INDENT, data);
						break;
					case 'message':
						try {
							if (!_filter) 
								_filter = new utils.filter(model.keywords);
							data.data.text = _filter.replace(data.data.text);
						} catch (err) { utils.log('Failed to execute filter.'); }
						view.show(data.data, data.user);
						_this.dispatchEvent(events.CHATEASE_MESSAGE, data);
						break;
					case 'join':
						view.show(_getUserTitle(data.user.role) + ' ' + data.user.name + ' 进入聊天室。');
						_this.dispatchEvent(events.CHATEASE_JOIN, data);
						break;
					case 'left':
						view.show(_getUserTitle(data.user.role) + ' ' + data.user.name + ' 已离开。');
						_this.dispatchEvent(events.CHATEASE_LEFT, data);
						break;
					case 'error':
						var explain = _getErrorExplain(data);
						if (explain) 
							view.show(explain);
						_this.dispatchEvent(events.CHATEASE_ERROR, data);
						break;
					default:
						utils.log('Unknown data type, ignored.');
						break;
				}
			};
			_websocket.onerror = function(e) {
				//utils.log('websocket.onerror');
				model.setState(states.ERROR);
			};
			_websocket.onclose = function(e) {
				//utils.log('websocket.onclose');
				model.setState(states.CLOSED);
			};
		}
		
		function _getErrorExplain(data) {
			var explain;
			switch (data.data.code) {
				case 400:
					explain = '错误请求！';
					break;
				case 401:
					explain = '请先登录！';
					break;
				case 403:
					explain = '权限错误！';
					break;
				case 404:
					explain = '未知请求！';
					break;
				case 409:
					explain = '操作频繁！';
					break;
				default:
					break;
			}
			return explain;
		}
		
		function _getUserTitle(role) {
			var title = '';
			switch (utils.typeOf(role)) {
				case 'string':
					role = parseInt(role);
					if (role == NaN || role < 0) break;
				case 'number':
					if (role & 0xC0) {
						title = '超管';
					} else if (role & 0x20) {
						title = '主播';
					} else if (role & 0x18) {
						title = '房管';
					} else if (role & 0x07) {
						title = 'VIP' + (role & 0x07);
					}
					break;
				default:
					break;
			}
			
			return title;
		}
		
		function _modelStateHandler(e) {
			switch (e.state) {
				case states.CONNECTED:
					view.show('聊天室已连接。');
					_retriesCount = 0;
					_this.dispatchEvent(events.CHATEASE_CONNECT, { channelId: model.id });
					break;
				case states.CLOSED:
					view.show('聊天室连接已断开！');
					_this.dispatchEvent(events.CHATEASE_CLOSE, { channelId: model.id });
					_reconnect();
					break;
				case states.ERROR:
					view.show('聊天室异常！');
					_this.dispatchEvent(events.CHATEASE_ERROR, { message: 'Chat room error!', channelId: model.id });
					break;
				default:
					_this.dispatchEvent(events.CHATEASE_ERROR, { message: 'Unknown model state!', state: e.state });
					break;
			}
		}
		
		function _reconnect() {
			if (!model.maxRetries || _retriesCount < model.maxRetries) {
				var delay = Math.ceil(model.retryDelay + Math.random() * 5000);
				view.show('正在准备重连，' + delay / 1000 + '秒...');
				setTimeout(function() {
					_retriesCount++;
					_websocket = null;
					_connect();
				}, delay);
			}
		}
		
		function _onModelShieldMsg(e) {
			_forward(e);
		}
		
		function _onReady(e) {
			if (!_ready) {
				_forward(e);
				
				//model.addGlobalListener(_forward);
				//view.addGlobalListener(_forward);
				
				_ready = true;
				_connect();
				
				window.onbeforeunload = function(e) {
					if (_websocket && model.state == states.CONNECTED) {
						_websocket.close();
					}
				};
			}
		}
		
		function _onSend(e) {
			e.message = utils.trim(model.maxlength ? e.message.substr(0, model.maxlength) : e.message);
			if (!e.message) {
				view.show('请输入内容！');
				return;
			}
			
			var currentTime = new Date().getTime();
			if (model.interval >= 0 && currentTime - _lastSent < model.interval) {
				view.show('操作频繁！');
				return;
			}
			_lastSent = currentTime;
			_this.send(e.message, e.userId);
		}
		
		function _onViewShieldMsg(e) {
			model.setMsgShield(e.shield);
		}
		
		function _onClearScreen(e) {
			view.render.clearScreen();
			_forward(e);
		}
		
		function _onNickClick(e) {
			_forward(e);
		}
		
		function _onSetupError(e) {
			_forward(e);
		}
		
		function _onRenderError(e) {
			_forward(e);
		}
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
		
		_this.close = function() {
			if (_websocket)
				_websocket.close();
		};
		
		_init();
	};
})(chatease);

(function(chatease) {
	var utils = chatease.utils,
		events = chatease.events,
		renderModes = chatease.core.renders.modes;
	
	var embed = chatease.embed = function(api) {
		var _this = utils.extend(this, new events.eventdispatcher('embed')),
			_config = new embed.config(api.config),
			_errorOccurred = false,
			_embedder = null;
		_config.id = api.id;
		
		function _init() {
			utils.foreach(_config.events, function(e, cb) {
				var fn = api[e];
				if (utils.typeOf(fn) === 'function') {
					fn.call(api, cb);
				}
			});
		}
		
		_this.embed = function() {
			try {
				_embedder = new embed.embedder(api, _config);
			} catch (e) {
				utils.log('Failed to init embedder!');
				_this.dispatchEvent(events.CHATEASE_SETUP_ERROR, { message: 'Failed to init embedder!', render: _config.render.name, fallback: _config.fallback });
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
				case events.CHATEASE_ERROR:
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
		renderModes = chatease.core.renders.modes,
		skinModes = chatease.core.renders.skins.modes;
	
	embed.config = function(config) {
		var _defaults = {
			url: 'ws://' + window.location.host + '/websocket/websck',
			width: 300,
			height: 450,
	 		
	 		maxlength: 30, // 0: no limit, uint: n bytes
	 		interval: 0, // ms
	 		
	 		maxRetries: 0, // -1: never, 0: always, uint: n times
	 		retryDelay: 3000, // ms
			
			render: {
				name: renderModes.DEFAULT, // 'def'
				skin: {
					name: skinModes.DEFAULT, // 'def'
				}
			},
			
			keywords: '',
			maxRecords: 50
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
		core = chatease.core,
		renderModes = core.renders.modes;
	
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
