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
