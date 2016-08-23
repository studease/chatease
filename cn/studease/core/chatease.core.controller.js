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
			
			if (utils.typeOf(data) != 'object' || data.hasOwnProperty('cmd') == false 
					|| data.hasOwnProperty('channel') == false || data.channel.hasOwnProperty('id') == false) {
				_onError(400, data);
				return;
			}
			
			var channelId = data.channel.id;
			var attributes = model.getAttributes(channelId);
			if (attributes.setActive() == false) {
				_onError(409, data);
				return;
			}
			
			var punishment = attributes.getPunishment();
			if (punishment != null && (punishment.code & 0x02) > 0) {
				_onError(403, data);
				return;
			}
			
			_websocket.send(JSON.stringify(data));
		};
		
		function _connect() {
			if (_websocket) 
				return;
			
			view.show('聊天室连接中…');
			try {
				if (window.WebSocket) {
					_websocket = new WebSocket(model.url);
				} else if (window.MozWebSocket) {
					_websocket = new MozWebSocket(model.url);
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
				case 'identity':
					utils.foreach(data.user, function(k, v) {
						if (model.user.hasOwnProperty(k)) {
							model.user[k] = v;
						}
					});
					view.show('已加入房间（' + data.channel.id + '）。');
					
					var attributes = model.getAttributes(data.channel.id);
					attributes.setProperties(data.channel.role, data.channel.state);
					if ((data.channel.state & 0x02) == 0) {
						view.show('您所在的用户组不能发言！');
					}
					
					if (data.channel.hasOwnProperty('punishment') == true) {
						var punishment = data.channel.punishment;
						attributes.setPunishment(punishment);
						
						if ((punishment.code & 0x02) > 0) {
							var date = new Date();
							date.setTime(punishment.time);
							view.show('您已被禁言（' + utils.formatTime(date) + '）！');
						}
					}
					_this.dispatchEvent(events.CHATEASE_INDENT, data);
					break;
				case 'message':
					try {
						if (!_filter) 
							_filter = new utils.filter(model.keywords);
						data.text = _filter.replace(data.text);
					} catch (err) {
						utils.log('Failed to execute filter.');
					}
					
					view.show(data, utils.extend({}, data.user, { channel: data.channel }));
					_this.dispatchEvent(events.CHATEASE_MESSAGE, data);
					break;
				case 'join':
					view.show(_getUserTitle(data.channel.role) + ' ' + data.user.name + ' 进入聊天室。');
					_this.dispatchEvent(events.CHATEASE_JOIN, data);
					break;
				case 'left':
					view.show(_getUserTitle(data.channel.role) + ' ' + data.user.name + ' 已离开。');
					_this.dispatchEvent(events.CHATEASE_LEFT, data);
					break;
				case 'error':
					_onError(data.error.code, data);
					break;
				default:
					utils.log('Unknown data type: ' + data.raw + ', ignored.');
					break;
			}
		}
		
		function _onError(code, params) {
			var explain = _getErrorExplain(code);
			if (explain) 
				view.show(explain);
			
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
			_this.dispatchEvent(events.CHATEASE_ERROR, data);
		}
		
		function _getErrorExplain(code) {
			var explain = '';
			switch (code) {
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
				case 406:
					explain = '非法请求！';
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
					for (var i = 0; i < model.channel.length; i++) {
						_this.join(model.channel[i]);
					}
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
			var obj = {
				cmd: 'join',
				channel: { id: channelId }
			};
		  if (model.token) {
		  	obj.token = model.token;
		  }
			_this.send(obj);
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
				type: e.data.type,
				channel: {
					id: e.data.channel
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
