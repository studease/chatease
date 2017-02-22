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
		
		INPUT_CLASS = 'cha-input',
		
		NICK_SYSTEM_CLASS = 'cha-system',
		NICK_MYSELF_CLASS = 'cha-myself',
		
		ICON_VISITOR_CLASS = 'ico-visitor',
		ICON_NORMAL_CLASS = 'ico-normal',
		ICON_VIP_CLASS = 'ico-vip',
		
		ICON_ASSISTANT_CLASS = 'ico-assistant',
		ICON_SECRETARY_CLASS = 'ico-secretary',
		ICON_ANCHOR_CLASS = 'ico-anchor',
		
		ICON_ADMIN_CLASS = 'ico-admin',
		ICON_SU_ADMIN_CLASS = 'ico-suadmin',
		ICON_SYSTEM_CLASS = 'ico-system',
		
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
		
		TITLE_HEIGHT = '40px',
		CONTROLS_HEIGHT = '40px',
		SENDBTN_WIDTH = '50px';
	
	skins.def = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('skins.def')),
			_width = config.width,
			_height = config.height;
		
		function _init() {
			_this.name = skinmodes.DEFAULT;
			
			SKIN_CLASS += '-' + _this.name;
			
			css('.' + WRAP_CLASS, {
				width: _width + 'px',
				height: _height + 'px',
				'box-shadow': '0 1px 1px rgba(0, 0, 0, 0.05)'
			});
			css('.' + WRAP_CLASS + ' *', {
				margin: '0',
				padding: '0',
				'font-family': '微软雅黑,arial,sans-serif',
				'font-size': '14px',
				'font-weight': CSS_NORMAL,
				'box-sizing': 'content-box'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS, {
				width: _width - 2 + 'px',
				height: _height - 2 + 'px',
				border: '1px solid #1184ce',
				'border-radius': '4px',
				position: CSS_RELATIVE
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + TITLE_CLASS, {
				padding: 'auto 12px',
				width: CSS_100PCT,
				height: TITLE_HEIGHT,
				
				'font-family': 'inherit',
				'font-weight': CSS_NORMAL,
				color: '#FFFFFF',
				
				'text-align': 'center',
				'line-height': TITLE_HEIGHT,
				'vertical-align': 'middle',
				
				'box-shadow': CSS_NONE,
				'background-color': '#1184CE',
				
				cursor: 'not-allowed',
				'pointer-events': CSS_NONE
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS, {
				width: CSS_100PCT,
				height: (_height - 2 - parseInt(TITLE_HEIGHT) - parseInt(CONTROLS_HEIGHT)) * 0.75 + 'px',
				'max-height': (_height - 2 - parseInt(TITLE_HEIGHT) - parseInt(CONTROLS_HEIGHT)) * 0.75 + 'px',
				'overflow-y': 'auto',
				'background-color': '#F8F8F8'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div', {
				margin: '5px',
				'word-break': 'break-all',
				'word-wrap': 'break-word'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div.' + NICK_SYSTEM_CLASS + ' > a', {
				'font-style': CSS_NORMAL,
				'font-weight': 'bold',
				color: 'red'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div.' + NICK_MYSELF_CLASS, {
				//'text-align': 'right'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div.' + NICK_MYSELF_CLASS + ' > a', {
				
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.' + ICON_VISITOR_CLASS, {
				'margin-right': '5px'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.' + ICON_NORMAL_CLASS, {
				'margin-right': '5px'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.' + ICON_VIP_CLASS + '1', {
				
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.' + ICON_VIP_CLASS + '2', {
				
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.' + ICON_VIP_CLASS + '3', {
				
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.' + ICON_VIP_CLASS + '4', {
				
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.' + ICON_VIP_CLASS + '5', {
				
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.' + ICON_VIP_CLASS + '6', {
				
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.' + ICON_VIP_CLASS + '7', {
				
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.' + ICON_ASSISTANT_CLASS, {
				
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.' + ICON_SECRETARY_CLASS, {
				
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.' + ICON_ANCHOR_CLASS, {
				
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.' + ICON_ADMIN_CLASS, {
				
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.' + ICON_SU_ADMIN_CLASS, {
				
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.' + ICON_SYSTEM_CLASS, {
				
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > a', {
				'margin-right': '5px',
				color: '#1184CE',
				'text-decoration': CSS_NONE,
				cursor: 'pointer'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS, {
				width: CSS_100PCT,
				height: parseInt(CONTROLS_HEIGHT) - 2 + 'px',
				border: '1px solid #1184CE',
				'border-width': '1px 0'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' > *', {
				'margin': '5px',
				height: parseInt(CONTROLS_HEIGHT) - 12 + 'px',
				'line-height': parseInt(CONTROLS_HEIGHT) - 12 + 'px',
				'text-align': 'center',
				'vertical-align': 'middle',
				'box-sizing': 'border-box',
				display: 'inline-block'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' > .' + CHECKBOX_CLASS, {
				color: '#666666',
				'vertical-align': 'middle',
				cursor: 'pointer'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' > .' + CHECKBOX_CLASS + ' > label', {
				height: parseInt(CONTROLS_HEIGHT) - 12 + 'px',
				display: 'block'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' > .' + CHECKBOX_CLASS + ' input[type=checkbox]', {
				'margin-right': '5px',
				cursor: 'pointer'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' > .' + CHECKBOX_CLASS + ' a', {
				
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' > .' + BUTTON_CLASS, {
				padding: '3px 5px',
				color: '#FFFFFF',
				'text-align': 'center',
				'vertical-align': 'middle',
				'border-radius': '3px',
				'background-color': '#1184CE',
				cursor: 'pointer'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' .shieldtext', {
				'float': 'left'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' .clearscreen', {
				'float': 'right'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DIALOG_CLASS, {
				width: CSS_100PCT,
				height: (_height - 2 - parseInt(TITLE_HEIGHT) - parseInt(CONTROLS_HEIGHT)) * 0.25 + 'px',
				position: CSS_RELATIVE,
				overflow: CSS_HIDDEN
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DIALOG_CLASS + ' .' + INPUT_CLASS, {
				position: 'relative'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DIALOG_CLASS + ' .' + INPUT_CLASS + ' textarea', {
				'float': 'left',
				margin: '0',
				padding: '5px 10px',
				width: _width - 2 - parseInt(SENDBTN_WIDTH) + 'px',
				height: (_height - 2 - parseInt(TITLE_HEIGHT) - parseInt(CONTROLS_HEIGHT)) * 0.25 - 2 + 'px',
				resize: CSS_NONE,
				border: '0 none',
				'border-radius': '0 0 0 4px',
				'box-sizing': 'border-box',
				overflow: 'auto'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DIALOG_CLASS + ' .' + INPUT_CLASS + ' button', {
				'float': 'left',
				padding: 0,
				width: SENDBTN_WIDTH,
				height: (_height - 2 - parseInt(TITLE_HEIGHT) - parseInt(CONTROLS_HEIGHT)) * 0.25 + 'px',
				color: '#FFFFFF',
				border: '0 none',
				'box-sizing': 'border-box',
				'background-color': '#1184CE',
				cursor: 'pointer'
			});
			
			if (utils.isMSIE(7)) {
				css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DIALOG_CLASS + ' .' + INPUT_CLASS + ' textarea', {
					width: _width - 2 - parseInt(SENDBTN_WIDTH) - 20 + 'px',
					height: (_height - 2 - parseInt(TITLE_HEIGHT) - parseInt(CONTROLS_HEIGHT)) * 0.25 - 12 + 'px'
				});
				css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DIALOG_CLASS + ' .' + INPUT_CLASS + ' button', {
					height: (_height - 2 - parseInt(TITLE_HEIGHT) - parseInt(CONTROLS_HEIGHT)) * 0.25 + 'px'
				});
			}
		}
		
		_this.resize = function(width, height) {
			utils.log('Resizing to ' + width + ', ' + height);
			
			_width = parseInt(width);
			_height = parseInt(height);
			/*
			var _wrapper = document.getElementById(config.id),
				_renderLayer = document.getElementById(config.prefix + RENDER_CLASS),
				_mainLayer = document.getElementById(config.prefix + MAIN_CLASS),
				_consoleLayer = document.getElementById(config.prefix + CONSOLE_CLASS),
				_dialogLayer = document.getElementById(config.prefix + DIALOG_CLASS),
				_textInput = document.getElementById(config.prefix + INPUT_CLASS),
				_sendButton = document.getElementById(config.prefix + SUBMIT_CLASS);
			
			css.style(_wrapper, {
				width: config.width + 'px',
				height: config.height + 'px'
			});
			css.style(_renderLayer, {
				width: config.width - 2 + 'px',
				height: config.height - 2 + 'px'
			});
			css.style(_mainLayer, {
				height: config.height -2 - parseInt(TITLE_HEIGHT) + 'px'
			});
			css.style(_consoleLayer, {
				height: (config.height - parseInt(TITLE_HEIGHT)) * 0.75 + 'px'
			});
			css.style(_dialogLayer, {
				height: (config.height -1 - parseInt(TITLE_HEIGHT)) * 0.25 + 'px'
			});
			css.style(_textInput, {
				width: config.width -2 - parseInt(SENDBTN_WIDTH) + 'px',
				height: (config.height - parseInt(TITLE_HEIGHT)) * 0.25 - parseInt(CONTROLS_HEIGHT) - 2 + 'px'
			});
			css.style(_sendButton, {
				height: (config.height - parseInt(TITLE_HEIGHT)) * 0.25 - parseInt(CONTROLS_HEIGHT) -2 + 'px'
			});
			
			if (utils.isMSIE(7)) {
				css.style(_textInput, {
					width: config.width -2 - parseInt(SENDBTN_WIDTH) - 20 + 'px',
					height: (config.height - parseInt(TITLE_HEIGHT)) * 0.25 - parseInt(CONTROLS_HEIGHT) - 12 + 'px'
				});
				css.style(_sendButton, {
					height: (config.height - parseInt(TITLE_HEIGHT)) * 0.25 - parseInt(CONTROLS_HEIGHT) + 'px'
				});
			}*/
		};
		
		_init();
	};
})(chatease);
