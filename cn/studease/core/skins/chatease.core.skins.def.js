(function(chatease) {
	var utils = chatease.utils,
		events = chatease.events,
		skins = chatease.core.skins,
		skinmodes = skins.modes,
		css = utils.css,
		
		WRAP_CLASS = 'cha-wrapper',
		SKIN_CLASS = 'cha-skin',
		RENDER_CLASS = 'cha-render',
		TITLE_CLASS = 'cha-title',
		CONSOLE_CLASS = 'cha-console',
		CONTROLS_CLASS = 'cha-controls',
		DIALOG_CLASS = 'cha-dialog',
		
		CHECKBOX_CLASS = 'cha-checkbox',
		BUTTON_CLASS = 'cha-button',
		
		NICK_SYSTEM_CLASS = 'cha-system',
		NICK_MYSELF_CLASS = 'cha-myself',
		
		TITLE_VISITOR_CLASS = 'ttl-visitor',
		TITLE_NORMAL_CLASS = 'ttl-normal',
		TITLE_VIP_CLASS = 'ttl-vip',
		
		TITLE_ASSISTANT_CLASS = 'ttl-assistant',
		TITLE_SECRETARY_CLASS = 'ttl-secretary',
		TITLE_ANCHOR_CLASS = 'ttl-anchor',
		
		TITLE_ADMIN_CLASS = 'ttl-admin',
		TITLE_SU_ADMIN_CLASS = 'ttl-suadmin',
		TITLE_SYSTEM_CLASS = 'ttl-system',
		
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
	
	skins.def = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('skins.def'));
		
		function _init() {
			_this.name = skinmodes.DEFAULT;
			
			_this.config = utils.extend({}, config);
			
			SKIN_CLASS += '-' + _this.name;
			
			css('.' + WRAP_CLASS, {
				width: CSS_100PCT,
				height: CSS_100PCT,
				'background-color': '#171717'
			});
			css('.' + WRAP_CLASS + ' *', {
				margin: '0',
				padding: '0',
				'font-family': 'Microsoft YaHei,arial,sans-serif',
				'font-size': '14px',
				'font-weight': CSS_NORMAL,
				'box-sizing': 'content-box'
			});
			
			css('.' + SKIN_CLASS + ' .' + CHECKBOX_CLASS, {
				padding: '6px 0 6px 18px',
				color: '#E6E6E6',
				'background-repeat': 'no-repeat',
				'background-position': 'left center',
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOAgMAAABiJsVCAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAJUExURUxpcebm5ubm5kbBEu0AAAACdFJOUwCgoEVu0AAAABpJREFUCNdjYAABqVWrHBi0Vq1qII0AawMBACnPF0kf/g8sAAAAAElFTkSuQmCC)',
				cursor: 'pointer',
				overflow: CSS_HIDDEN
			});
			css('.' + SKIN_CLASS + ' .' + CHECKBOX_CLASS + '.checked', {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAA40lEQVQ4T52SvXHCQBCF3wuUKDHp7QXYFZgOrBKgAqADOsDuRK7ALoEOGDqwk1UoSHSBZrTMMWhGY358w0YbvG9/3i7xYDByqloCmKfUMLPSe7/sQUuADmfNk4gwCTSzXZZli7ZtS5KvSWCE8jwvmqZZkVzHrv+CPRRCKAB89etcA38BjM+CA8lJzLuu25Ic3QJ/RORl4PBMRL5VdQPgbWjeRUcz+/Dev1dVVTjnNqo6HY54b1SQXDrnyrquRyGELYDnv6e6Z87MzCa9i8mgme2jeGjIrR2TXw7Ap4gsTp/zSBwBq1l6D5ci9L8AAAAASUVORK5CYII=)'
			});
			
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS, {
				padding: '6px 14px',
				'font-style': CSS_NORMAL,
				'font-weight': CSS_NORMAL,
				'text-align': 'center',
				'text-transform': 'uppercase',
				'white-space': 'nowrap',
				'word-spacing': CSS_NORMAL,
				border: CSS_NONE,
				'border-radius': '2px',
				cursor: 'pointer',
				display: 'inline-block',
				'-webkit-font-smoothing': 'subpixel-antialiased',
				'-moz-osx-font-smoothing': 'grayscale',
				transition: '150ms ease-in-out',
				'transition-property': 'background-color, color'
			});
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS + '.red', {
				color: '#FFFFFF',
				'background-color': '#FF0046'
			});
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS + '.red:hover', {
				'background-color': '#97052D'
			});
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS + '.blue', {
				color: '#FFFFFF',
				'background-color': '#0B7EF4'
			});
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS + '.blue:hover', {
				'background-color': '#0966C3'
			});
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS + '.white', {
				color: '#000000',
				'background-color': '#FFFFFF'
			});
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS + '.white:hover', {
				'background-color': '#E0E0E0'
			});
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS + '.gray', {
				color: '#000000',
				'background-color': '#E0E0E0'
			});
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS + '.gray:hover', {
				'background-color': '#96A0B4'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS, {
				width: CSS_100PCT,
				height: CSS_100PCT
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' object', {
				width: '0',
				height: '0',
				position: CSS_ABSOLUTE
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + TITLE_CLASS, {
				width: CSS_100PCT,
				height: '40px',
				'font-family': 'inherit',
				'font-weight': CSS_NORMAL,
				'text-align': 'center',
				'line-height': '40px',
				color: '#E6E6E6',
				'background-color': 'inherit',
				cursor: 'default',
				'pointer-events': CSS_NONE
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS, {
				height: _this.config.height - 100 - (_this.config.title ? 40 : 0) + 'px',
				color: '#242424',
				'background-color': '#F8F8F8',
				'overflow-x': CSS_HIDDEN,
				'overflow-y': 'scroll'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div', {
				margin: '6px',
				'line-height': '20px'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div.' + NICK_SYSTEM_CLASS
				+ ', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div.' + NICK_SYSTEM_CLASS + ' > a', {
				'font-style': CSS_NORMAL,
				'font-weight': CSS_NORMAL,
				color: '#33CC00',
				cursor: 'default',
				'pointer-events': CSS_NONE
			});
			/*css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div.' + NICK_MYSELF_CLASS, {
				
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div.' + NICK_MYSELF_CLASS + ' > a', {
				
			});*/
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .icon', {
				'float': 'left',
				'margin-right': '4px',
				width: '20px',
				height: '20px',
				display: CSS_BLOCK
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .icon img', {
				width: CSS_100PCT,
				height: CSS_100PCT,
				display: CSS_INLINE_BLOCK
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title', {
				'margin-right': '2px',
				padding: '0 2px',
				font: 'normal 12px Microsoft YaHei,arial,sans-serif',
				'white-space': 'nowrap',
				'word-spacing': CSS_NORMAL,
				border: '1px solid #3CAFAB',
				'border-radius': '2px',
				'vertical-align': 'middle'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_VISITOR_CLASS
				+ ', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_NORMAL_CLASS
				+ ', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_SYSTEM_CLASS, {
				display: CSS_NONE
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_VIP_CLASS + '1'
				+ ', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_VIP_CLASS + '2'
				+ ', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_VIP_CLASS + '3', {
				color: '#3CAFAB',
				'border-color': '#3CAFAB'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_VIP_CLASS + '4'
				+ ', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_VIP_CLASS + '5'
				+ ', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_VIP_CLASS + '6'
				+ ', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_VIP_CLASS + '7', {
				color: '#77C773',
				'border-color': '#77C773'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_ASSISTANT_CLASS
				+ ', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_SECRETARY_CLASS
				+ ', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_ANCHOR_CLASS, {
				color: '#5382E2',
				'border-color': '#5382E2'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_ADMIN_CLASS
				+ ', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .title.' + TITLE_SU_ADMIN_CLASS, {
				color: '#F76767',
				'border-color': '#F76767'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > a', {
				color: '#5382E2',
				'text-decoration': CSS_NONE,
				cursor: 'pointer'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div .context', {
				'word-break': 'break-all',
				'word-wrap': 'break-word'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS, {
				width: CSS_100PCT,
				height: '40px',
				'line-height': CSS_100PCT,
				'background-color': 'inherit',
				overflow: CSS_HIDDEN
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' > *', {
				margin: '6px 0',
				'text-align': 'center',
				display: 'block'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' .shieldtext', {
				'float': 'left'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' .clearscreen', {
				'float': 'right',
				width: '42px'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DIALOG_CLASS, {
				width: CSS_100PCT,
				height: '60px',
				overflow: CSS_HIDDEN
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DIALOG_CLASS + ' textarea', {
				padding: '6px 10px',
				width: _this.config.width - 124 + 'px',
				height: '48px',
				resize: CSS_NONE,
				border: '0 none',
				'background-color': '#E6E6E6'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DIALOG_CLASS + ' button', {
				'float': 'right',
				width: '42px',
				height: '48px'
			});
		}
		
		_this.resize = function(width, height) {
			var wrapper = document.getElementById(_this.config.id);
			var consoleLayer = document.getElementById(_this.config.id + '-console');
			var textInput = document.getElementById(_this.config.id + '-input');
			
			css.style(consoleLayer, {
				height: wrapper.clientHeight - 100 - (_this.config.title ? 40 : 0) + 'px'
			});
			
			css.style(textInput, {
				width: wrapper.clientWidth - 96 + 'px'
			});
		};
		
		_init();
	};
})(chatease);
