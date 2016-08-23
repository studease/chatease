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
					user = { id: 0, name: user, channel: { id: 0, role: 0, state: 3 } };
					// fall through
				case 'null':
					user = { id: 0, name: '[系统]', channel: { id: 0, role: 64, state: 3 } };
					// fall through
				case 'object':
					if (utils.typeOf(user.id) == null) 
						break;
					
					var boxclass = user.channel.role >= 0 && (user.channel.role & 0x40) ? NICK_SYSTEM_CLASS : (user.id == view.user().id ? NICK_MYSELF_CLASS : '');
					if (boxclass) 
						box.className = boxclass;
					
					var clazz = _getIconClazz(user.channel.role);
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
							_this.dispatchEvent(events.CHATEASE_VIEW_NICKCLICK, { user: { id: this.user.id, name: this.user.name }, channel: this.user.channel });
						});
					} catch(e) {
						a.attachEvent('onclick', function(e) {
							_this.dispatchEvent(events.CHATEASE_VIEW_NICKCLICK, { user: { id: this.user.id, name: this.user.name }, channel: this.user.channel });
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
			for (var i = 0; i < _this.config.channel.length; i++) {
				_this.dispatchEvent(events.CHATEASE_VIEW_SEND, { data: {
					text: _textInput.value,
					type: 'multi',
					channel: _this.config.channel[i]
				}});
			}
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
