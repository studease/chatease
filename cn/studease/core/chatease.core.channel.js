(function(chatease) {
	var utils = chatease.utils,
		events = chatease.events,
		core = chatease.core;
	
	core.channel = function(model, id) {
		var _this = utils.extend(this, new events.eventdispatcher('core.channel_' + id)),
			_id = id,
			_role = -1,
			_state = 0,
			_interval,
			_active = 0,
			_joined = false;
		
		function _init() {
			_interval = _getIntervalByRole(_role);
		}
		
		_this.getId = function() {
			return _id;
		};
		
		_this.getRole = function() {
			return _role;
		};
		
		_this.getState = function() {
			return _state;
		};
		
		_this.getInterval = function() {
			return _interval;
		};
		
		_this.setProperties = function(role, state) {
			_role = role;
			_state = state;
			_interval = _getIntervalByRole(_role);
			_joined = true;
		};
		
		_this.setActive = function() {
			var current = new Date().getTime();
			if (_active > 0) {
				if (_interval < 0 || current - _active < _interval) {
					return false;
				}
			}
			_active = current;
			return true;
		};
		
		_this.joined = function() {
			return _joined;
		};
		
		function _getIntervalByRole(role) {
			var val = -1;
			if (role < 0) {
				val = 3000;
			} else if (role == 0) {
				val = 2000;
			} else if (role >= 8) {
				val = 0;
			} else if ((role & 0x07) > 0) {
				val = 1000;
			}
			return val;
		}
		
		_init();
	};
})(chatease);
