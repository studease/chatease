(function(chatease) {
	var utils = chatease.utils,
		events = chatease.events,
		skins = chatease.core.renders.skins,
		css = utils.css,
		
		WRAP_CLASS = 'chatwrap',
		RENDER_CLASS = 'render',
		TITLE_CLASS = 'title',
		MAIN_CLASS = 'main',
		CONSOLE_CLASS = 'console',
		DIALOG_CLASS = 'dialog',
		CONTROL_CLASS = 'control',
		INPUT_CLASS = 'input',
		SUBMIT_CLASS = 'submit',
		NICK_SYSTEM_CLASS = 'system',
		NICK_MYSELF_CLASS = 'myself',
		BUTTON_CLASS = 'btn',
		CHECKBOX_CLASS = 'ch',
		
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
		
		TITLE_HEIGHT = '34px',
		CONTROL_HEIGHT = '38px',
		SENDBTN_WIDTH = '46px';
	
	skins.def = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('skins.def'));
		
		css('.' + WRAP_CLASS, {
			width: config.width + 'px',
			height: config.height + 'px',
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
		
		css('.' + RENDER_CLASS, {
			width: config.width - 2 + 'px',
			height: config.height - 2 + 'px',
			border: '1px solid #1184ce',
			'border-radius': '4px',
			position: CSS_RELATIVE
		});
		
		css(' .' + TITLE_CLASS, {
			padding: 'auto 12px',
			width: CSS_100PCT,
			height: TITLE_HEIGHT,
			
			'font-family': 'inherit',
			'font-weight': CSS_NORMAL,
			color: '#fff',
			//opacity: 0.65,
			
			'text-align': 'center',
			'line-height': TITLE_HEIGHT,
			'vertical-align': 'middle',
			
			'box-shadow': CSS_NONE,
			'background-color': '#1184ce',
			
			cursor: 'not-allowed',
			'pointer-events': CSS_NONE
		});
		css(' .' + TITLE_CLASS + ' span', {
			top: '2px',
			'margin-left': '2px'
		});
		
		css(' .' + MAIN_CLASS, {
			width: CSS_100PCT,
			height: config.height -2 - parseInt(TITLE_HEIGHT) + 'px'
		});
		
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS, {
			width: CSS_100PCT,
			height: (config.height - parseInt(TITLE_HEIGHT)) * 0.75 + 'px',
			'max-height': '75%',
			'overflow-y': 'auto',
			'background-color': '#f8f8f8'
		});
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS + ' > div', {
			margin: '5px',
			'word-break': 'break-all',
			'word-wrap': 'break-word'
		});
		
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS + ' > div > span', {
			'margin-right': '5px'
		});
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.vip1', {
			
		});
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.vip2', {
			
		});
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.vip3', {
			
		});
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.vip4', {
			
		});
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.vip5', {
			
		});
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.vip6', {
			
		});
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.vip7', {
			
		});
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.temporary', {
			
		});
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.manager', {
			
		});
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.owner', {
			
		});
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.system', {
			
		});
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS + ' > div > span.admin', {
			
		});
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS + ' > div > a', {
			'margin-right': '5px',
			color: '#1184ce',
			'text-decoration': CSS_NONE,
			cursor: 'pointer'
		});
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS + ' > div.' + NICK_SYSTEM_CLASS + ' > a', {
			'font-style': CSS_NORMAL,
			'font-weight': 'bold',
			color: 'red'
		});
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS + ' > div.' + NICK_MYSELF_CLASS, {
			//'text-align': 'right'
		});
		css(' .' + MAIN_CLASS + ' .' + CONSOLE_CLASS + ' > div.' + NICK_MYSELF_CLASS + ' > a', {
			/*'margin-right': 0,
			'margin-left': '5px'*/
		});
		
		css(' .' + MAIN_CLASS + ' .' + DIALOG_CLASS, {
			width: CSS_100PCT,
			height: (config.height -1 - parseInt(TITLE_HEIGHT)) * 0.25 + 'px',
			position: CSS_RELATIVE,
			overflow: CSS_HIDDEN
		});
		
		css(' .' + MAIN_CLASS + ' .' + DIALOG_CLASS + ' .' + CONTROL_CLASS, {
			width: CSS_100PCT,
			height: CONTROL_HEIGHT,
			border: '1px solid #1184ce',
			'border-width': '1px 0'
		});
		css(' .' + MAIN_CLASS + ' .' + DIALOG_CLASS + ' .' + CONTROL_CLASS + ' > *', {
			'margin': '0 5px',
			height: CSS_100PCT,
			'line-height': CONTROL_HEIGHT,
			'text-align': 'center',
			'vertical-align': 'middle',
			'box-sizing': 'border-box',
			display: 'inline-block'
		});
		css(' .' + MAIN_CLASS + ' .' + DIALOG_CLASS + ' .' + CONTROL_CLASS + ' > div > .' + CHECKBOX_CLASS, {
			color: '#666',
			'vertical-align': 'middle',
			cursor: 'pointer'
		});
		css(' .' + MAIN_CLASS + ' .' + DIALOG_CLASS + ' .' + CONTROL_CLASS + ' > div > .' + CHECKBOX_CLASS + ' input[type=checkbox]', {
			'margin-right': '5px',
			cursor: 'pointer'
		});
		css(' .' + MAIN_CLASS + ' .' + DIALOG_CLASS + ' .' + CONTROL_CLASS + ' > div > .' + CHECKBOX_CLASS + ' a', {
			
		});
		css(' .' + MAIN_CLASS + ' .' + DIALOG_CLASS + ' .' + CONTROL_CLASS + ' > div > .' + BUTTON_CLASS, {
			padding: '3px 5px',
			color: '#fff',
			'text-align': 'center',
			'vertical-align': 'middle',
			'border-radius': '3px',
			'background-color': '#1184ce',
			cursor: 'pointer'
		});
		css(' .' + MAIN_CLASS + ' .' + DIALOG_CLASS + ' .' + CONTROL_CLASS + ' .msgshield', {
			'float': 'left'
		});
		css(' .' + MAIN_CLASS + ' .' + DIALOG_CLASS + ' .' + CONTROL_CLASS + ' .clrscreen', {
			'float': 'right'
		});
		css(' .' + MAIN_CLASS + ' .' + DIALOG_CLASS + ' .' + CONTROL_CLASS + ' .clrscreen span', {
			top: '2px',
			'margin-left': '2px'
		});
		
		css(' .' + MAIN_CLASS + ' .' + DIALOG_CLASS + ' .' + INPUT_CLASS, {
			//padding: '0 10px 10px',
			//width: CSS_100PCT,
			//height: (config.height - parseInt(TITLE_HEIGHT)) * 0.25 - parseInt(CONTROL_HEIGHT) - 6 + 'px'
			position: 'relative'
		});
		css(' .' + MAIN_CLASS + ' .' + DIALOG_CLASS + ' .' + INPUT_CLASS + ' textarea', {
			'float': 'left',
			margin: '0',
			padding: '5px 10px',
			width: config.width -2 - parseInt(SENDBTN_WIDTH) + 'px',
			height: (config.height - parseInt(TITLE_HEIGHT)) * 0.25 - parseInt(CONTROL_HEIGHT) - 2 + 'px',
			resize: CSS_NONE,
			border: '0 none',
			'border-radius': '0 0 0 4px',
			'box-sizing': 'border-box',
			overflow: 'auto'
		});
		css(' .' + MAIN_CLASS + ' .' + DIALOG_CLASS + ' .' + INPUT_CLASS + ' button', {
			'float': 'left',
			padding: 0,
			width: SENDBTN_WIDTH,
			height: (config.height - parseInt(TITLE_HEIGHT)) * 0.25 - parseInt(CONTROL_HEIGHT) -2 + 'px',
			color: '#fff',
			border: '0 none',
			'box-sizing': 'border-box',
			'background-color': '#1184ce',
			cursor: 'pointer'
		});
		
		if (utils.isMSIE(7)) {
			css(' .' + MAIN_CLASS + ' .' + DIALOG_CLASS + ' .' + INPUT_CLASS + ' textarea', {
				width: config.width -2 - parseInt(SENDBTN_WIDTH) - 20 + 'px',
				height: (config.height - parseInt(TITLE_HEIGHT)) * 0.25 - parseInt(CONTROL_HEIGHT) - 12 + 'px'
			});
			css(' .' + MAIN_CLASS + ' .' + DIALOG_CLASS + ' .' + INPUT_CLASS + ' button', {
				height: (config.height - parseInt(TITLE_HEIGHT)) * 0.25 - parseInt(CONTROL_HEIGHT) + 'px'
			});
		}
		
		_this.resize = function(width, height) {
			utils.log('Resizing to ' + width + ', ' + height);
			config.width = parseInt(width);
			config.height = parseInt(height);
			
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
				height: (config.height - parseInt(TITLE_HEIGHT)) * 0.25 - parseInt(CONTROL_HEIGHT) - 2 + 'px'
			});
			css.style(_sendButton, {
				height: (config.height - parseInt(TITLE_HEIGHT)) * 0.25 - parseInt(CONTROL_HEIGHT) -2 + 'px'
			});
			
			if (utils.isMSIE(7)) {
				css.style(_textInput, {
					width: config.width -2 - parseInt(SENDBTN_WIDTH) - 20 + 'px',
					height: (config.height - parseInt(TITLE_HEIGHT)) * 0.25 - parseInt(CONTROL_HEIGHT) - 12 + 'px'
				});
				css.style(_sendButton, {
					height: (config.height - parseInt(TITLE_HEIGHT)) * 0.25 - parseInt(CONTROL_HEIGHT) + 'px'
				});
			}
		};
	};
})(chatease);
