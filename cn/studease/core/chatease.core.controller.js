(function(chatease) {
	var utils = chatease.utils,
		crypt = utils.crypt,
		events = chatease.events,
		core = chatease.core,
		states = core.states,
		protocol = core.protocol,
		cmds = protocol.cmds,
		raws = protocol.raws,
		types = protocol.types,
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
					
					var userlist = model.getProperty('userlist');
					userlist[data.user.name] = data.user;
					
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
			
			var userinfo = model.getProperty('userinfo');
			var data = {
				cmd: cmds.TEXT,
				data: text,
				type: e.data.type,
				channel: {
					id: userinfo.channel
				}
			};
			
			var arr = text.match(/^\/r\s(\S+)\s(.*)/i);
			if (arr && arr.length > 2) {
				var name = utils.trim(arr[1]);
				var userlist = model.getProperty('userlist');
				var user = userlist[name];
				if (!user) {
					_error(errors.NOT_FOUND, null);
					return;
				}
				
				data.type = types.UNI;
				data.user = { id: user.id };
				
				text = arr[2];
			}
			
			if (model.config.maxlength >= 0) {
				text = text.substr(0, model.config.maxlength);
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
			// TODO: control, private chat
			var userinfo = model.getProperty('userinfo');
			var channel = { id: userinfo.channel, state: userinfo.state };
			
			_this.dispatchEvent(events.CHATEASE_NICKCLICK, { user: e.user, channel: channel });
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
