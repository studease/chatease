(function(chatease) {
	var utils = chatease.utils,
		events = chatease.events,
		embed = chatease.embed,
		core = chatease.core,
		renderModes = core.renders.modes;
	
	embed.def = function(api, config) {
		var _this = utils.extend(this, new events.eventdispatcher('embed.def'));
		_this.renderMode = renderModes.DEFAULT;
		
		_this.embed = function() {
			var entity = new core.entity(config);
			entity.addGlobalListener(_onEvent);
			entity.setup();
			api.setEntity(entity, config.renderMode);
		};
		
		function _onEvent(e) {
			_forward(e);
		}
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
        
		_this.supports = function() {
			return true;
		};
	};
})(chatease);
