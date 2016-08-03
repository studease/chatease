(function(chatease) {
	var utils = chatease.utils,
		events = chatease.events,
		renderModes = chatease.core.renders.modes;
	
	var embed = chatease.embed = function(api) {
		var _this = utils.extend(this, new events.eventdispatcher('embed')),
			_config = new embed.config(api.config),
			_errorOccurred = false,
			_embedder = null;
		_config.id = api.id;
		
		function _init() {
			utils.foreach(_config.events, function(e, cb) {
				var fn = api[e];
				if (utils.typeOf(fn) === 'function') {
					fn.call(api, cb);
				}
			});
		}
		
		_this.embed = function() {
			try {
				_embedder = new embed[_config.renderMode](api, _config);
			} catch (e) {
				utils.log('Render [' + _config.renderMode + '] not found.');
			}
			
			if (!_embedder || !_embedder.supports()) {
				if (_config.fallback) {
					_config.renderMode = _config.renderMode = renderModes.DEFAULT;
					_embedder = new embed.def(api, _config);
				} else {
					_this.dispatchEvent(events.chatease_SETUP_ERROR, { message: 'No suitable render found!', render: _config.renderMode, fallback: _config.fallback });
					return;
				}
			}
			_embedder.addGlobalListener(_onEvent);
			_embedder.embed();
		};
		
		_this.errorScreen = function(message) {
			if (_errorOccurred) {
				return;
			}
			
			_errorOccurred = true;
			chatease.api.displayError(message, _config);
		};
		
		function _onEvent(e) {
			switch (e.type) {
				case events.ERROR:
				case events.chatease_SETUP_ERROR:
				case events.chatease_RENDER_ERROR:
				case events.chatease_ERROR:
					_this.errorScreen(e.message);
					_this.dispatchEvent(events.ERROR, e);
					break;
				default:
					_forward(e);
					break;
			}
		}
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
		
		_init();
	};
})(chatease);
