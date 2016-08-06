(function(chatease) {
	var utils = chatease.utils,
		events = chatease.events;
	
	var _insts = {},
		_eventMapping = {
		onError: events.ERROR,
		onReady: events.CHATEASE_READY,
		onConnect: events.CHATEASE_CONNECT,
		onIdent: events.CHATEASE_INDENT,
		onMessage: events.CHATEASE_MESSAGE,
		onJoin: events.CHATEASE_JOIN,
		onLeft: events.CHATEASE_LEFT,
		onNickClick: events.CHATEASE_VIEW_NICKCLICK,
		onClose: events.CHATEASE_CLOSE
	};
	
	chatease.api = function(container) {
		var _this = utils.extend(this, new events.eventdispatcher('api')),
			_entity;
		
		_this.container = container;
		_this.id = container.id;
		
		function _init() {
			utils.foreach(_eventMapping, function(name, type) {
				_this[name] = function(callback) {
					_this.addEventListener(type, callback);
				};
			});
		}
		
		_this.setup = function(options) {
			utils.emptyElement(_this.container);
			
			_this.config = options;
			_this.embedder = new chatease.embed(_this);
			_this.embedder.addGlobalListener(_onEvent);
			_this.embedder.embed();
			
			return _this;
		};
		
		_this.setEntity = function(entity, renderMode) {
			_entity = entity;
			_this.renderMode = renderMode;
			
			_this.send = _entity.send;
			_this.resize = _entity.resize;
		};
		
		function _onEvent(e) {
			_forward(e);
		}
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
		
		_init();
	};
	
	chatease.api.getInstance = function(identifier) {
		var _container;
		
		if (identifier == null) {
			identifier = 0;
		} else if (identifier.nodeType) {
			_container = identifier;
		} else if (utils.typeOf(identifier) === 'string') {
			_container = document.getElementById(identifier);
		}
		
		if (_container) {
			var inst = _insts[_container.id];
			if (!inst) {
				_insts[identifier] = inst = new chatease.api(_container);
			}
			return inst;
		} else if (utils.typeOf(identifier) === 'number') {
			return _insts[identifier];
		}
		
		return null;
	};
	
	chatease.api.displayError = function(message, config) {
		
	};
})(chatease);
