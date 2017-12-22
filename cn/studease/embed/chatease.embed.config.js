(function(chatease) {
	var utils = chatease.utils,
		events = chatease.events,
		embed = chatease.embed,
		rendermodes = chatease.core.renders.modes,
		skinmodes = chatease.core.skins.modes;
	
	embed.config = function(config) {
		var _defaults = {
			url: 'ws://' + window.location.host + '/ch1?token=',
			width: 640,
			height: 400,
			keywords: '',
	 		maxlength: 50,  // -1: no limit
	 		maxrecords: 50,
	 		maxretries: -1, // -1: always
	 		retrydelay: 3000,
	 		smoothing: false,
			render: {
				name: rendermodes.DEFAULT,
				title: 'CHATEASE ' + chatease.version,
				swf: 'swf/chatease.swf'
			},
			skin: {
				name: skinmodes.DEFAULT
			}
		},
		
		_config = utils.extend({}, _defaults, config);
		_config.smoothing = _config.smoothing && utils.isMobile() && BScroll;
		
		return _config;
	};
	
	embed.config.addConfig = function(oldConfig, newConfig) {
		return utils.extend(oldConfig, newConfig);
	};
})(chatease);
