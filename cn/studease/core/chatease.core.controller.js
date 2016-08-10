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
		
		_this.send = function(data) {
			if (!_websocket || model.state == states.CLOSED) {
				_connect();
				return;
			}
			
			var currentTime = new Date().getTime();
			if (model.interval >= 0 && currentTime - _lastSent < model.interval) {
				view.show('操作频繁！');
				return;
			}
			_lastSent = currentTime;
			
			_websocket.send(JSON.stringify(data));
		};
		
		function _connect() {
			if (_websocket) 
				return;
			
			var token = utils.getCookie('token');
			var paramstr = token ? ((model.url.indexOf('?') == -1 ? '?' : '&') + 'token=' + token) : '';
			try {
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
					view.show('加入房间成功！');
					_this.dispatchEvent(events.CHATEASE_INDENT, data);
					break;
				case 'message':
					try {
						if (!_filter) 
							_filter = new utils.filter(model.keywords);
						data.text = _filter.replace(data.text);
					} catch (err) { utils.log('Failed to execute filter.'); }
					view.show(data, data.user);
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
		}
		
		function _getErrorExplain(data) {
			var explain;
			switch (data.error.code) {
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
					view.show('聊天室已连接…');
					_retriesCount = 0;
					_this.dispatchEvent(events.CHATEASE_CONNECT);
					_this.join(model.channel);
					break;
				case states.CLOSED:
					view.show('聊天室连接已断开！');
					_this.dispatchEvent(events.CHATEASE_CLOSE, { channel: { id: model.channel } });
					_reconnect();
					break;
				case states.ERROR:
					view.show('聊天室异常！');
					_this.dispatchEvent(events.CHATEASE_ERROR, { message: 'Chat room error!', channel: { id: model.channel } });
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
		
		_this.join = function(channelId) {
			_this.send({
				cmd: 'join',
				channel: { id: channelId }
			});
		};
		
		function _onSend(e) {
			e.data.text = utils.trim(model.maxlength ? e.data.text.substr(0, model.maxlength) : e.data.text);
			if (!e.data.text) {
				view.show('请输入内容！');
				return;
			}
			_this.send({
				cmd: 'message',
				text: e.data.text,
				pipe: {
					type: e.data.type,
					id: e.data.pipe
				}
			});
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
