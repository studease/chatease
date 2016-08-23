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
			channel: 1,
			token: '',
			keywords: '',
	 		maxlength: 30, // 0: no limit, uint: n bytes
	 		maxRetries: 0, // -1: never, 0: always, uint: n times
	 		retryDelay: 3000, // ms
			render: {
				name: renderModes.DEFAULT, // 'def'
				skin: {
					name: skinModes.DEFAULT // 'def'
				}
			},
			maxRecords: 50
		},
		_config = utils.extend({}, _defaults, config);
		
		switch (utils.typeOf(_config.channel)) {
			case 'array':
				break;
			case 'number':
				_config.channel = [_config.channel];
				break;
			case 'string':
				_config.channel = _config.channel.split(',');
				break;
			default:
				_config.channel = [1];
		}
		
		return _config;
	};
	
	embed.config.addConfig = function(oldConfig, newConfig) {
		return utils.extend(oldConfig, newConfig);
	};
})(chatease);
