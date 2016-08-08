(function(chatease) {
	var utils = chatease.utils,
		events = chatease.events,
		embed = chatease.embed,
		renderModes = chatease.core.renders.modes,
		skinModes = chatease.core.renders.skins.modes;
	
	embed.config = function(config) {
		var _defaults = {
			url: 'ws://' + window.location.host + '/websocket/websck',
			width: 300,
			height: 450,
	 		
	 		maxlength: 30, // 0: no limit, uint: n bytes
	 		interval: 0, // ms
	 		
	 		maxRetries: 0, // -1: never, 0: always, uint: n times
	 		retryDelay: 3000, // ms
			
			render: {
				name: renderModes.DEFAULT, // 'def'
				skin: {
					name: skinModes.DEFAULT, // 'def'
				}
			},
			
			keywords: '',
			maxRecords: 50
		},
		_config = utils.extend({}, _defaults, config);
		
		return _config;
	};
	
	embed.config.addConfig = function(oldConfig, newConfig) {
		return utils.extend(oldConfig, newConfig);
	};
})(chatease);
