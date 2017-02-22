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
