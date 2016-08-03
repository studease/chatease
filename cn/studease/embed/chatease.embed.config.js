(function(chatease) {
	var utils = chatease.utils,
		events = chatease.events,
		embed = chatease.embed,
		renderModes = chatease.core.renders.modes;
	
	embed.config = function(config) {
		var _defaults = {
			url: 'ws://' + window.location.host + '/websocket/websck',
			width: 300,
			height: 450,
	 		renderMode: renderModes.DEFAULT,
	 		retryDelay: 3,
			maxRetries: 0,
			messageInterval: 0,
			maxlog: 50,
			fallback: true
		},
		_config = utils.extend({}, _defaults, config);
		
		return _config;
	};
	
	embed.config.addConfig = function(oldConfig, newConfig) {
		return utils.extend(oldConfig, newConfig);
	};
})(chatease);
