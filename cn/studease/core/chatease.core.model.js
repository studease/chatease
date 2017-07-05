(function(chatease) {
	var utils = chatease.utils,
		events = chatease.events,
		core = chatease.core,
		states = core.states,
		protocol = core.protocol,
		roles = protocol.roles,
		channelStates = protocol.channelStates,
		punishments = protocol.punishments;
	
	var userinfo = function() {
		var _this = this,
			_defaults = {
				channel: null,
				role: -1,
				state: 0,
				punishment: {
					code: 0,
					time: 0
				}
			},
			_interval,
			_active;
		
		function _init() {
			utils.extend(_this, _defaults);
			
			_interval = -1;
			_active = 0;
		}
		
		_this.set = function(info) {
			utils.extend(_this, info);
			
			if (info.hasOwnProperty('role') == true) {
				_interval = _getIntervalByRole(info.role);
			}
		};
		
		function _getIntervalByRole(role) {
			var interval = 2000;
			
			if (role & 0xF0) {
				interval = 0;
			} else if (role) {
				interval *= .5;
				var vip = role - 1;
				if (vip) {
					interval = interval >= vip * 100 ? interval - vip * 100 : 0;
				}
			}
			
			return interval;
		}
		
		_this.isMuted = function() {
			return _this.role < _this.state || !!(_this.punishment.code & punishments.MUTED);
		};
		
		_this.isActive = function() {
			if (_interval < 0) {
				return false;
			}
			
			var now = new Date().getTime();
			if (_active && now - _active < _interval) {
				return false;
			}
			
			_active = now;
			
			return true;
		};
		
		_init();
	};
	
	core.model = function(config) {
		 var _this = utils.extend(this, new events.eventdispatcher('core.model')),
		 	_defaults = {},
		 	_state = states.CLOSED,
		 	_properties;
		
		function _init() {
			_this.config = utils.extend({}, _defaults, config);
			
			_properties = {
				userinfo: new userinfo(),
				shield: false
			};
		}
		
		_this.setState = function(state) {
			if (state === _state) {
				return;
			}
			_state = state;
			_this.dispatchEvent(events.CHATEASE_STATE, { state: state });
		};
		
		_this.getState = function() {
			return _state;
		};
		
		_this.setProperty = function(key, value) {
			if (_properties.hasOwnProperty(key) == true) {
				_properties[key] = value;
				_this.dispatchEvent(events.CHATEASE_PROPERTY, { key: key, value: value });
			}
		};
		
		_this.getProperty = function(key) {
			return _properties[key];
		};
		
		_this.getConfig = function(name) {
			return _this.config[name];
		};
		
		_this.destroy = function() {
			
		};
		
		_init();
  };
})(chatease);
