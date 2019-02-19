(function(chatease) {
	var utils = chatease.utils,
		events = chatease.events,
		embed = chatease.embed,
		core = chatease.core,
		renderModes = core.renders.modes,
		skinModes = core.skins.modes;
	
	embed.config = function(config) {
		var _defaults = {
			url: 'ws://' + window.location.host + '/ch1?token=',
			width: 640,
			height: 400,
			keywords: '',
	 		maxLength: 50,  // -1: no limit
	 		maxRecords: 50,
	 		maxRetries: -1, // -1: always
	 		retryDelay: 3000,
	 		smoothing: false,
	 		debug: false,
			render: {
				name: renderModes.DEFAULT,
				title: 'CHATEASE ' + chatease.version,
				swf: 'swf/chatease.swf'
			},
			skin: {
				name: skinModes.DEFAULT
			},
			bubble: {
				name: ''
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
