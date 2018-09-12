(function(chatease) {
	var utils = chatease.utils,
		events = chatease.events,
		core = chatease.core,
		states = core.states;
	
	var user = function() {
		var _this = this,
			_defaults = {
				id: 0,
				name: '',
				icon: '',
				role: 0
			},
			_active,
			_interval;
		
		function _init() {
			utils.extend(_this, _defaults);
			
			_active = 0;
			_interval = 0;
		}
		
		_this.update = function(info) {
			utils.extend(_this, info);
			
			_interval = _getInterval(_this.role);
		};
		
		function _getInterval(role) {
			if (role & 0xF0) {
				return 0;
			}
			
			var d = 2000;
			
			if (role) {
				var vip = role >> 1;
				d = 1000 - vip * 100;
			}
			
			return d;
		}
		
		_this.limited = function() {
			var now = new Date().getTime();
			if (now < _active + _interval) {
				return true;
			}
			
			_active = now;
			return false;
		};
		
		_init();
	};
	
	var channel = function() {
		var _this = this,
			_defaults = {
				id: 0,
				stat: 0,
				group: 0
			},
			_userlist,
			_sanctions;
		
		function _init() {
			utils.extend(_this, _defaults);
			
			_userlist = {};
			_sanctions = {};
		}
		
		_this.update = function(info) {
			utils.extend(_this, info);
		};
		
		_this.add = function(usr) {
			_userlist[usr.id] = usr;
		};
		
		_this.remove = function(usr) {
			delete _userlist[usr.id];
		};
		
		_this.find = function(id) {
			return _userlist[id];
		};
		
		_this.freeze = function(id, opt, mgr, d) {
			var san = _sanctions[id];
			if (san == undefined) {
				san = {};
				_sanctions[id] = san;
			}
			
			san[opt] = {
				manager: mgr,
				until: Math.floor(new Date().getTime() / 1000) + d
			}
		};
		
		_this.unfreeze = function(id, opt) {
			var san = _sanctions[id];
			if (san) {
				delete san[opt];
			}
		};
		
		_this.limited = function(id, opt) {
			var san = _sanctions[id];
			if (san) {
				var item = san[opt];
				if (item) {
					return Math.floor(new Date().getTime() / 1000) < item.until;
				}
			}
			
			return false;
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
				user: new user(),
				channel: new channel(),
				hidden: false
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
