(function(chatease) {
	var utils = chatease.utils,
		events = chatease.events,
		core = chatease.core,
		message = core.message,
		modes = message.modes,
		roles = message.roles,
		renders = core.renders,
		rendermodes = renders.modes,
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
			if (_contentLayer.childNodes.length >= _this.config.maxrecords) {
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
