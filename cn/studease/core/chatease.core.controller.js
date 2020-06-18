(function(chatease) {
	var utils = chatease.utils,
		crypt = utils.crypt,
		events = chatease.events,
		core = chatease.core,
		states = core.states,
		message = core.message,
		keys = message.keys,
		cmds = message.cmds,
		opts = message.opts,
		modes = message.modes,
		roles = message.roles,
		status = message.status,
		
		SYSTEM = { 'id': -1, 'name': '[系统]', role: roles.SYSTEM };
	
	core.controller = function(model, view) {
		var _this = utils.extend(this, new events.eventdispatcher('core.controller')),
			_ready = false,
			_websocket,
			_timer,
			_filter,
			_responders,
			_sequence,
			_subject,
			_retrycount = 0;
		
		function _init() {
			_responders = {};
			_sequence = 0;
			_subject = '';
			
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
		
		function _modelStateHandler(e) {
			switch (e.state) {
				case states.CONNECTED:
					if (chatease.debug) {
						view.show(SYSTEM, '聊天室已连接…');
					} else {
						utils.log('聊天室已连接…');
					}
					
					_retrycount = 0;
					_this.dispatchEvent(events.CHATEASE_CONNECT);
					break;
					
				case states.CLOSED:
					if (chatease.debug) {
						view.show(SYSTEM, '聊天室连接已断开！');
					} else {
						utils.log('聊天室连接已断开！');
					}
					
					_this.dispatchEvent(events.CHATEASE_CLOSE, { channel: { id: model.channel } });
					_reconnect();
					break;
					
				case states.ERROR:
					if (chatease.debug) {
						view.show(SYSTEM, '聊天室异常！');
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
		
		function _onReady(e) {
			if (!_ready) {
				utils.log('Chat ready!');
				
				_ready = true;
				_forward(e);
				
				if (!chatease.debug) {
					view.show(SYSTEM, '聊天室已连接！');
				}
				
				_connect();
				
				window.addEventListener('beforeunload', function(ev) {
					if (_websocket && model.getState() == states.CONNECTED) {
						//_websocket.close();
					}
				});
			}
		}
		
		_this.setup = function(e) {
			if (!_ready) {
				view.setup();
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
			
			view.render.clearScreen();
			
			if (chatease.debug) {
				view.show(SYSTEM, '聊天室连接中…');
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
				_error(status.NOT_ACCEPTABLE, null);
			}
		}
		
		_this.send = function(data, responder) {
			if (!_websocket || model.getState() != states.CONNECTED) {
				_connect();
				return;
			}
			
			if (utils.typeOf(data) != 'object' || data.hasOwnProperty(keys.CMD) == false || data.hasOwnProperty(keys.DATA) == false) {
				_error(status.BadRequest, data);
				return;
			}
			
			var usr = model.getProperty('user');
			if (usr.limited()) {
				_error(status.TooManyRequests, data);
				return;
			}
			
			var ch = model.getProperty('channel');
			if (usr.role < ch.stat || ch.limited(usr.id, opts.MUTE)) {
				_error(status.Forbidden, data);
				return;
			}
			
			if (responder) {
				_sequence++;
				_responders[_sequence] = responder;
				
				data.seq = _sequence;
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
			
			if (data.hasOwnProperty(keys.SEQ) && _responders.hasOwnProperty(data.seq)) {
				var responder = _responders[data.seq];
				var fn = responder.result;
				if (data.cmd == cmds.ERROR) {
					fn = responder.status;
				}
				
				if (fn) {
					fn.call(null, data);
				}
				
				delete _responders[data.seq];
			}
			
			var usr = model.getProperty('user');
			var ch = model.getProperty('channel');
			
			switch (data.cmd) {
				case cmds.INFO:
					usr.update(utils.extend({}, data.user));
					ch.update(utils.extend({}, data.channel));
					
					if (chatease.debug) {
						view.show(SYSTEM, '已加入房间（' + ch.id + '）。');
					} else {
						utils.log('已加入房间（' + ch.id + '）。');
					}
					
					if (usr.role < ch.stat) {
						view.show(SYSTEM, '您所在的用户组不能发言！');
					}
					
					_this.dispatchEvent(events.CHATEASE_INFO, data);
					break;
					
				case cmds.TEXT:
				case cmds.RESULT:
					try {
						if (!_filter) {
							_filter = new utils.filter(model.config.keywords);
						}
						data.data = _filter.replace(data.data);
					} catch (err) {
						// Ignore this failure.
						utils.log('Failed to execute filter.');
					}
					
					ch.add(data.user);
					
					view.show(data.user, data.data, data.mode);
					_this.dispatchEvent(events.CHATEASE_MESSAGE, data);
					break;
					
				case cmds.USER:
					_this.dispatchEvent(events.CHATEASE_USER, data);
					break;
					
				case cmds.JOIN:
					ch.add(data.user);
					
					view.show(data.user, data.user.name + ' 进入房间。');
					_this.dispatchEvent(events.CHATEASE_JOIN, data);
					break;
					
				case cmds.LEFT:
					ch.remove(data.user);
					
					view.show(data.user, data.user.name + ' 离开房间。');
					_this.dispatchEvent(events.CHATEASE_LEFT, data);
					break;
					
				case cmds.CTRL:
					var arr = message.parseControl(data.data);
					if (arr) {
						var opt = arr[0], d = arr[1];
						if (d == 0) {
							ch.unfreeze(data.sub, opt);
						} else {
							ch.freeze(data.sub, opt, data.user, d);
						}
						
						if (data.sub == usr.id) {
							switch (opt) {
								case opts.MUTE:
									view.show(SYSTEM, '您已被' + (d ? '' : '解除') + '禁言' + (d ? d + '秒' : '') + '。');
									break;
									
								case opts.FORBID:
									view.show(SYSTEM, '您已被限制进入该房间' + d + '秒。');
									model.config.maxRetries = 0;
									_this.close();
									break;
							}
						}
					}
					break;
					
				case cmds.EXTERN:
					_this.dispatchEvent(events.CHATEASE_EXTERN, data);
					break;
					
				case cmds.ERROR:
					_error(data.error.code, data);
					break;
					
				default:
					utils.log('Unknown cmd: ' + data.cmd + ', ignored.');
					break;
			}
		};
		
		_this.onError = function(e) {
			model.setState(states.ERROR);
		};
		
		_this.onClose = function(e) {
			model.setState(states.CLOSED);
		};
		
		function _error(code, params) {
			var status = _getErrorStatus(code);
			if (status) {
				view.show(SYSTEM, status);
			}
			
			var data = {
				raw: 'error',
				error: {
					code: code,
					status: status
				}
			};
			utils.foreach(params, function(k, v) {
				if (k != 'cmd' && k != 'raw' && k != 'error') {
					data[k] = v;
				}
			});
			
			_this.dispatchEvent(events.ERROR, data);
		}
		
		function _getErrorStatus(code) {
			var err = '';
			
			switch (code) {
				case status.BadRequest:
					err = '错误请求！';
					break;
				case status.Unauthorized:
					err = '请先登录！';
					break;
				case status.Forbidden:
					err = '权限错误！';
					break;
				case status.NotFound:
					err = '未知请求！';
					break;
				case status.NotAcceptable:
					err = '无法识别！';
					break;
				case status.RequestTimeout:
					err = '请求超时！';
					break;
				case status.TooManyRequests:
					err = '操作频繁！';
					break;
					
				case status.InternalServerError:
					err = '内部错误！';
					break;
				case status.NotImplemented:
					err = '无法识别！';
					break;
				case status.BadGateway:
					err = '网关错误！';
					break;
				case status.ServiceUnavailable:
					err = '服务过载！';
					break;
				case status.GatewayTimeout:
					err = '网关超时！';
					break;
				default:
					break;
			}
			
			return err;
		}
		
		function _reconnect() {
			if (model.config.maxRetries < 0 || _retrycount < model.config.maxRetries) {
				var delay = Math.ceil(model.config.retryDelay + Math.random() * 3000);
				
				if (chatease.debug) {
					view.show(SYSTEM, '正在准备重连，' + delay / 1000 + '秒...');
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
				view.show(SYSTEM, '请输入内容！');
				return;
			}
			
			var data = {
				cmd: cmds.TEXT,
				data: text,
				mode: e.data.mode
			};
			
			var arr = text.match(/^\/r\s(\S+)\s(.*)/i);
			if (arr && arr.length > 2) {
				var ch = model.getProperty('channel');
				var usr = ch.find(_subject);
				if (!usr) {
					_error(status.NotFound, null);
					return;
				}
				
				data.mode = modes.UNI;
				data.sub = _subject;
				
				text = arr[2];
			}
			
			if (model.config.maxLength >= 0) {
				text = text.substr(0, model.config.maxLength);
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
			var ch = model.getProperty('channel');
			_subject = e.user.id;
			_this.dispatchEvent(events.CHATEASE_NICKCLICK, { user: e.user, channel: { id: ch.id, group: ch.group, stat: ch.stat } });
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
