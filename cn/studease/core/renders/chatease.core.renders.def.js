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
						_this.config.debug = true;
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
