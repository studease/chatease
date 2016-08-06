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
	 		renderMode: renderModes.DEFAULT, // 'def'
	 		retryDelay: 3000, // ms
			maxRetries: 0, // -1: never, 0: always, uint: n times
			messageInterval: 0, // ms
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
