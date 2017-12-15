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
