(function(chatease) {
	var utils = chatease.utils,
		events = chatease.events,
		embed = chatease.embed,
		rendermodes = chatease.core.renders.modes,
		skinmodes = chatease.core.skins.modes;
	
	embed.config = function(config) {
		var _defaults = {
			url: 'ws://' + window.location.host + '/ch1?token=123456',
			width: 300,
			height: 450,
			keywords: '',
	 		maxlength: 30,    // -1: no limit
	 		maxrecords: 50,
	 		maxretries: -1,   // -1: always
	 		retrydelay: 3000,
			render: {
				name: rendermodes.DEFAULT,
				swf: 'swf/chatease.swf'
			},
			skin: {
				name: skinmodes.DEFAULT
			}
		},
		
		_config = utils.extend({}, _defaults, config);
		
		return _config;
	};
	
	embed.config.addConfig = function(oldConfig, newConfig) {
		return utils.extend(oldConfig, newConfig);
	};
})(chatease);
