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
	
	skins.mobile = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('skins.mobile'));
		
		function _init() {
			_this.name = skinmodes.MOBILE;
			
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
				color: '#E6E6E6',
				cursor: 'pointer'
			});
			css('.' + SKIN_CLASS + ' .' + CHECKBOX_CLASS + ' .icon', {
				'float': 'left',
				padding: '0 5px',
				width: '14px',
				height: '14px',
				'background-repeat': 'no-repeat',
				'background-position': 'center',
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOAgMAAABiJsVCAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAJUExURUxpcebm5ubm5kbBEu0AAAACdFJOUwCgoEVu0AAAABpJREFUCNdjYAABqVWrHBi0Vq1qII0AawMBACnPF0kf/g8sAAAAAElFTkSuQmCC)',
				display: 'inline-block'
			});
			css('.' + SKIN_CLASS + ' .' + CHECKBOX_CLASS + '.checked .icon', {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAA40lEQVQ4T52SvXHCQBCF3wuUKDHp7QXYFZgOrBKgAqADOsDuRK7ALoEOGDqwk1UoSHSBZrTMMWhGY358w0YbvG9/3i7xYDByqloCmKfUMLPSe7/sQUuADmfNk4gwCTSzXZZli7ZtS5KvSWCE8jwvmqZZkVzHrv+CPRRCKAB89etcA38BjM+CA8lJzLuu25Ic3QJ/RORl4PBMRL5VdQPgbWjeRUcz+/Dev1dVVTjnNqo6HY54b1SQXDrnyrquRyGELYDnv6e6Z87MzCa9i8mgme2jeGjIrR2TXw7Ap4gsTp/zSBwBq1l6D5ci9L8AAAAASUVORK5CYII=)'
			});
			
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS, {
				padding: '0 10px',
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
				height: CSS_100PCT,
				position: CSS_RELATIVE,
				overflow: CSS_HIDDEN
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
				color: '#242424',
				top: (_this.config.title ? 40 : 0) + 'px',
				right: '0',
				bottom: '40px',
				left: '0',
				position: CSS_ABSOLUTE,
				'background-color': '#F8F8F8',
				'overflow-x': CSS_HIDDEN,
				'overflow-y': 'scroll'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + '.more .' + CONSOLE_CLASS, {
				bottom: '120px'
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
				margin: '0',
				padding: '0',
				height: '90px',
				bottom: '-90px',
				right: '0',
				left: '0',
				position: CSS_ABSOLUTE,
				overflow: CSS_HIDDEN,
				'background-color': '#F8F8F8'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + '.more .' + CONTROLS_CLASS, {
				bottom: '0'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' > *', {
				'float': 'left',
				margin: '8px 0 0 8px',
				padding: '0',
				width: '60px',
				color: '#8A8A8A',
				'font-size': '12px',
				'text-align': 'center',
				'white-space': CSS_NORMAL,
				'background-color': 'transparent'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' > *:hover', {
				'background-color': 'transparent'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' > * .icon', {
				'float': CSS_NONE,
				margin: '0 4px',
				padding: '0',
				width: '50px',
				height: '50px',
				border: '1px solid #E6E6E6',
				'border-radius': '5px',
				'background-repeat': 'no-repeat',
				'background-position': 'center',
				display: 'inline-block'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' .shieldtext .icon', {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAABTklEQVRIx82VW5mDMBCFR0IkICEScLA42DrojwLiYHFQHCwOwEFxUByAg+xDaYGQhOxbmRf4wjlzOzMR+cgHXV6p+KGjoiq/yNKhGTcm7MHu5fc5WHHzQFd7UMTgudeza78oP/ySAF6S8VBQJMMtlu6Y+/QvAovZE9QJkBbIFzMMm8aiTsF1oHALAVHwgH6Ji4qKqrw6sqKPwtXSo8e+jOQrwRCEzygRFHfv6e1FEPafR+ArBXPguBcRoY1WiFgNChHyk/5MqJCPOcH/M4aAl36X3kjv2Lj57/3hiJVsedde/TznZwqNknlXoA9K0GKxoWkwIuhoBHqtla8X7UYjE53HrBMfzX59JXchOFY6QQezO1jbKJrTUXMXy8GjFkEFpe7rzyaJhvwZHllgXpvDmnkv9nG//1EYJ46Ri+9OamgxocuDAkNDjdksk494/gA7tENEtjQPhQAAAABJRU5ErkJggg==)'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' .shieldtext.checked .icon', {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAA50lEQVRIx9WVWxXCMAxAJ6ESkDAJdTAk4IA7BeBgc8AcbA42B+BgdbA5CF+wV6EP+IDm+942OUmaJD95UHlGQUuPIPS0FHmG8oN3nBgQSwyc2LlwrOgs8uObh1O7cAShtiaD4uqFC0JrE1TeuCBc1rgOwgVBLwUmWNB/dr8gpLH5P6KcBF2UoPukAoJwnQRjlMB8MYUmSlBNgkOUYD+fg/AqjMtOLIMFrGfRRBbwqUgD8Jt9I6SelTCzKdgo3Ik0b5ero6W61RYIENwonfBC0KBQaDTauco3AuN110vB2fMHevU3JH937stTHesqyDanAAAAAElFTkSuQmCC)'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' .clearscreen .icon', {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAABcElEQVRIx9WUUXmEMBCEIyESkICDQwIO7iT8KCAOigOQgIPg4HDQcwAOtg+EI+ESSq8P/Zq8Jbuz+83OrFL/9FAgfPwGYEB4vJ9eIgjN+wAPBCHfHnIst9PpNwRh9J9mBCFTipzWQz6qj/80IsxopTAI5jDdIGu57VFjlrpoDPogXTMhCP279GV0CJJgDF1dqkticBZLS+ZAdLy9O4JgE7wv11Kk2mueQbwId/AgBBudlBdkws6cVjoPYgqm4AJ5fpfKF5nQOpAM4zQTFzINM7Nfn5wJYQiYuvE4OUhKJoTxlXNKv8uU4+2i+X36kdAUWXWprrROb0ITqW743M/Jd/l6Z5oI06uZogDrFEYaylSjFKvxYp87ncc6YEDo0hz0CEKtFAX9Vge9gJHtdlGyiyCMjMFJqQtVkVpZi9oW72lqpmXqFAiSNFPg+v5pm2lTHcMPVkngwDt1daV+WWXfguQ0boVGfXoextAxnKDvT84XhbA72NjAQfwAAAAASUVORK5CYII=)'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DIALOG_CLASS, {
				height: '40px',
				right: '0',
				bottom: '0',
				left: '0',
				position: CSS_ABSOLUTE,
				'background-color': '#E0E0E0'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + '.more .' + DIALOG_CLASS, {
				bottom: '90px'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DIALOG_CLASS + ' .more', {
				'float': 'left',
				margin: '8px 5px',
				padding: '0',
				width: '24px',
				height: '24px',
				'background-repeat': 'no-repeat',
				'background-position': 'center',
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAA9UlEQVQ4y52UUbnCMAyFI6ESKgEnVAIO+KeAOWAOVgergzsHzAF1sDkoD4Pdre2AkjwlX0/OaZpUZGPo6kzHjUDgRled0bJnaFo8DQYlIoLC0OBpsyAMnno+uskrajwmTp/wHHa5D3hOcXUVydMRzz8LOq2Ow2VY5iJY6kRET5/kauyrvvoKoJjQAjSZa2YAIlgQXNKyfYDBCUMqaBegGYSwBB1/i4+Mq6h7NZmwBjj6xSemVeTWgGJJxZcubmvJw43o8tH4Yfi+HO/7pjkfF+i+WaCF5ZJd0UtmRZ8yLJ5rdZzloKsjLSP2/c8BjoFAYMBBfPgBKQDHPbaYwxwAAAAASUVORK5CYII=)',
				display: CSS_BLOCK
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DIALOG_CLASS + ' textarea', {
				margin: '5px 0',
				padding: '5px',
				width: _this.config.width - 114 + 'px',
				height: '20px',
				resize: CSS_NONE,
				border: '0 none',
				'line-height': '20px',
				'background-color': '#F8F8F8'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DIALOG_CLASS + ' .send', {
				'float': 'right',
				margin: '5px',
				padding: '0 5px',
				width: '50px',
				height: '30px',
				top: '0',
				right: '0',
				position: CSS_ABSOLUTE
			});
		}
		
		_this.resize = function(width, height) {
			var wrapper = document.getElementById(_this.config.id);
			var textInput = document.getElementById(_this.config.id + '-input');
			
			css.style(textInput, {
				width: wrapper.clientWidth - 114 + 'px'
			});
		};
		
		_init();
	};
})(chatease);
