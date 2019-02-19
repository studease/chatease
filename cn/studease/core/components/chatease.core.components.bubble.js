(function(chatease) {
	var utils = chatease.utils,
		css = utils.css,
		events = chatease.events,
		core = chatease.core,
		message = core.message,
		roles = message.roles,
		components = core.components,
		skins = chatease.core.skins,
		skinModes = skins.modes,
		
		SKIN_CLASS = 'cha-skin',
		BUBBLE_CLASS = 'cha-bubble',
		RENDER_CLASS = 'cha-render',
		CONSOLE_CLASS = 'cha-console',
		
		AREA_CLASS = 'area',
		USER_CLASS = 'user',
		ICON_CLASS = 'icon',
		ROLE_CLASS = 'role',
		NICK_CLASS = 'nick',
		CONTEXT_CLASS = 'context',
		
		ROLES_CLASS = {
			0:   'r-visitor',
			1:   'r-normal',
			14:  'r-vip',
			16:  'r-assistant',
			32:  'r-secretary',
			48:  'r-anchor',
			64:  'r-admin',
			128: 'r-suadmin',
			192: 'r-system'
		},
		
		// For all api instances
		CSS_SMOOTH_EASE = 'opacity .25s ease',
		CSS_100PCT = '100%',
		CSS_ABSOLUTE = 'absolute',
		CSS_RELATIVE = 'relative',
		CSS_NORMAL = 'normal',
		CSS_IMPORTANT = ' !important',
		CSS_HIDDEN = 'hidden',
		CSS_NONE = 'none',
		CSS_BLOCK = 'block',
		CSS_INLINE_BLOCK = 'inline-block';
	
	components.bubble = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('components.bubble')),
			_defaults = {
				name: '',
				skin: skinModes.DEFAULT
			};
		
		function _init() {
			_this.config = utils.extend({}, _defaults, config);
			if (!_this.config.name) {
				return;
			}
			
			SKIN_CLASS += '-' + _this.config.skin;
			BUBBLE_CLASS += '-' + _this.config.name;
			
			css('.' + SKIN_CLASS + '.' + BUBBLE_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + AREA_CLASS +
				', .' + SKIN_CLASS + '.' + BUBBLE_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLE_CLASS, {
				//display: CSS_NONE
			});
			
			css('.' + SKIN_CLASS + '.' + BUBBLE_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ICON_CLASS, {
				'float': 'left',
				'margin-top': '4px',
				width: '32px',
				height: '32px'
			});
			
			css('.' + SKIN_CLASS + '.' + BUBBLE_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + CONTEXT_CLASS, {
				margin: '4px 0 10px 36px',
				display: CSS_BLOCK
			});
			css('.' + SKIN_CLASS + '.' + BUBBLE_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + CONTEXT_CLASS + ' span', {
				padding: '8px 12px',
				'border-radius': '5px',
				'background-color': '#D9DDD4',
				display: CSS_INLINE_BLOCK
			});
			
			css('.' + SKIN_CLASS + '.' + BUBBLE_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.SYSTEM] + ' .' + CONTEXT_CLASS, {
				margin: '0',
				display: CSS_INLINE_BLOCK
			});
			css('.' + SKIN_CLASS + '.' + BUBBLE_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.SYSTEM] + ' .' + CONTEXT_CLASS + ' span', {
				padding: '0',
				'border-radius': '0',
				'background-color': 'inherit'
			});
		}
		
		_this.resize = function(width, height) {
			
		};
		
		_init();
	};
})(chatease);
