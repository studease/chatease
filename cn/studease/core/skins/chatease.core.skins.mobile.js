(function(chatease) {
	var utils = chatease.utils,
		events = chatease.events,
		core = chatease.core,
		message = core.message,
		roles = message.roles,
		skins = chatease.core.skins,
		skinModes = skins.modes,
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
		
		AREA_CLASS = 'area',
		USER_CLASS = 'user',
		ICON_CLASS = 'icon',
		ROLE_CLASS = 'role',
		NICK_CLASS = 'nick',
		CONTEXT_CLASS = 'context',
		
		AREAS_CLASS = {
			0: 'uni',
			1: '',
			2: '',
			3: 'outdated'
		},
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
		CSS_INLINE = 'inline',
		CSS_INLINE_BLOCK = 'inline-block';
	
	skins.mobile = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('skins.mobile'));
		
		function _init() {
			_this.name = skinModes.MOBILE;
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
				display: CSS_INLINE_BLOCK
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
				display: CSS_INLINE_BLOCK,
				'-webkit-font-smoothing': 'subpixel-antialiased',
				'-moz-osx-font-smoothing': 'grayscale',
				transition: '150ms ease-in-out',
				'transition-property': 'background-color, color'
			});
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS + '.red', {
				color: '#F0FFF0',
				'background-color': '#D9534C'
			});
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS + '.red:hover', {
				'background-color': '#DC143C'
			});
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS + '.green', {
				color: '#F0FFF0',
				'background-color': '#4CAE4C'
			});
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS + '.green:hover', {
				'background-color': '#449d44'
			});
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS + '.blue', {
				color: '#F0FFF0',
				'background-color': '#00A1D7'
			});
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS + '.blue:hover', {
				'background-color': '#0B7EF4'
			});
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS + '.white', {
				color: '#2F4F4F',
				'background-color': '#F5F5F5'
			});
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS + '.white:hover', {
				'background-color': '#D3D3D3'
			});
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS + '.gray', {
				color: '#F0FFF0',
				'background-color': '#A9A9A9'
			});
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS + '.gray:hover', {
				'background-color': '#808080'
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
				'overflow-y': _this.config.smoothing ? CSS_HIDDEN : 'scroll'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + '.more .' + CONSOLE_CLASS, {
				bottom: '130px'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div', {
				padding: '0 6px ' + (_this.config.smoothing ? '6px' : '0') + ' 6px'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' > div > div', {
				margin: '6px 0',
				'line-height': '20px'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + USER_CLASS, {
				cursor: 'pointer'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + AREA_CLASS, {
				'margin-right': '2px',
				'vertical-align': 'middle'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + AREA_CLASS + '.uni', {
				color: '#F76767'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + AREA_CLASS + '.outdated', {
				color: '#F76767'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ICON_CLASS, {
				'margin-right': '4px',
				width: '20px',
				height: '20px',
				display: CSS_INLINE_BLOCK,
				'vertical-align': 'middle'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLE_CLASS, {
				'margin-right': '2px',
				padding: '0 2px',
				font: 'normal 12px Microsoft YaHei,arial,sans-serif',
				'white-space': 'nowrap',
				'word-spacing': CSS_NORMAL,
				border: '1px solid #3CAFAB',
				'border-radius': '2px',
				'vertical-align': 'middle'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.VISITOR] + ' .' + ROLE_CLASS +
				', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.NORMAL] + ' .' + ROLE_CLASS +
				', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.SYSTEM] + ' .' + ROLE_CLASS, {
				display: CSS_NONE
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.VIP] + '1' + ' .' + ROLE_CLASS +
				', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.VIP] + '2' + ' .' + ROLE_CLASS +
				', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.VIP] + '3' + ' .' + ROLE_CLASS, {
				color: '#3CAFAB',
				'border-color': '#3CAFAB'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.VIP] + '4' + ' .' + ROLE_CLASS +
				', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.VIP] + '5' + ' .' + ROLE_CLASS +
				', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.VIP] + '6' + ' .' + ROLE_CLASS +
				', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.VIP] + '7' + ' .' + ROLE_CLASS, {
				color: '#77C773',
				'border-color': '#77C773'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.ASSISTANT] + ' .' + ROLE_CLASS +
				', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.SECRETARY] + ' .' + ROLE_CLASS +
				', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.ANCHOR] + ' .' + ROLE_CLASS, {
				color: '#5382E2',
				'border-color': '#5382E2'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.ADMIN] + ' .' + ROLE_CLASS +
				', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.SU_ADMIN] + ' .' + ROLE_CLASS, {
				color: '#F76767',
				'border-color': '#F76767'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + NICK_CLASS, {
				color: '#5382E2',
				'text-decoration': CSS_NONE
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.SYSTEM] +
				', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + ROLES_CLASS[roles.SYSTEM] + ' .' + NICK_CLASS, {
				color: '#33CC00',
				cursor: 'default',
				'pointer-events': CSS_NONE
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONSOLE_CLASS + ' .' + CONTEXT_CLASS, {
				'word-wrap': 'break-word',
				display: CSS_INLINE
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
				display: CSS_INLINE_BLOCK
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' .shieldtext .icon', {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACeklEQVRYR8VX0XUTMRAcVQAdQCrAVJCkAkIFkAqyqSChAg8VkFQAqQCnApwKEiqIXYF4c0h6ynG6k87mWe/dl6Td2dHu7J7DgZc7sH9UAzCzhXPu2Hv/GoC+BYCVAnDOrb33DySfWgMaBWBmbwFcATgLTqfsr51zXC6Xt1MH4/4gADNThEsAn2sN9c6JiUuSP6bu/wPAzE4AfK+MeMq+AJyT3JQOvgBgZor425TVxv01gNMSiATAzPTOivx/rBXJ0yHDHYDw5o97or0UwBeS1/3NCIAALvYQ+l0oTdGeL+WVGD7rl6oL0T/v6PwrgOuxZCsmoZlZKLk5GB5UqiRTxBIsAB9SnTu38d7flURKDEjNjmd4l/OTGHWoIImWxGtoyY/yoFPPBNDMhP5dI4CtHMl5eMKfQZprzNyQPM8B+JpbvTOq69UM59FMAqEnkEq9agBxT1JZrfKV0qX3brCho5JqzsmBj9L4INmifu5S4EcC0BLFlqQa1a7RR9CXAiA6ayPJ6e8/3W8AU/OAKuRNRtl9VEJdzDdKtHZyGuYESXdc73MtGHuTXs/ZRAC1jSgCyFlLrNQmg5mlysu7YU0/iACkdr9mMpDf3fbngSlVlKSKLSVhrh/Kh34DKhHSlXBYf3MgX2Z2A+BT4fYTyaO9VsGQo4kG1SVcY/UMuZGcL4pT8QgTtyS7YXWHRqbrXT6NARjTh8iCREkl3CLlcp4qZwzA0JygeV85olzoRCdogtS0tqPKhsU2Xvov6I/mUjldGpzzQ1cUYH0lNmRDU5MCSGuoCiSXGh5Fr0prXfODES0GpVOty47KU5+m4heDSDxf/W9Yq3Kt5w4O4A9JNgxutXqzoAAAAABJRU5ErkJggg==)'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' .shieldtext.checked .icon', {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB0klEQVRYR81X0VHCUBDcV4F0oHYgFQAVqBUIFXh2YAdZKhA7wAqECsQOpAOtIM4ySSZ5JOQBedGbyUcyye3e3r27i8Mfm/tjfAQTMLOBc26UpukYwA2Aq+xSDF/ZtXHOrdI0XZP8DgmulYCZCegBgAEYhDgFIHACeCUpco12kICZCTQJBK19zTlnSZLMm3zUEpDcAF4A3J0DXvp2CWBWl5Y9Ahn4e5bnjvB3blYkJ77DOgKLLOddgue+FiRnZccVAmamClf0MW1CcpUD+ARUsZcx0XVcSV7vEegp+hx3SHKjm0IBM4uZe1/UOUkd8QoB5WUUWf7cvTql6q1CoI/85wQ2JIc+AbXPi54U2JJUi/9fKVC7vO1JAQ2pqa+AHqj/92H3JBVwJQUaQCrE2HXwQ7IY634n1Ax/jCzBE0nh7MwnIGbqULHacXH+awnooZlp3fqIoMIngLG/EzQtJCKhzthVPWy13OT9vxxc40qWKaFKPTcdbwCmTUtq2054znxYA3guz/66tHZNQHkW6WUbcGMRllmama/ATs7sHdVJbloyDq7fTUUdqoCKSHksVqmuTkkIAYGqdwT96RxLrI3AIBZwUA0cG80p77f+G57i9JhvfgHYZaIhgJsBwwAAAABJRU5ErkJggg==)'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + CONTROLS_CLASS + ' .clearscreen .icon', {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACx0lEQVRYR8WWjXETQQyF31YAHWAqACogqYBQAaEClAogFVhUAFRAqICkAkgFmA5CBcd8N6ubvb0/nwmOZjyJz7e7T9J7T5v0wJEe+HwdFYCZnUj6Lsnd/YLkjw3gWtJLSb/dfXNUAGZ2JulrbvlHd7djA9hJepIBvHD3nz0AZvZc0lbSF3f/fJ/kNLNzSZ/ynrfuzlltdBwwsztJj/Lzp+6+y6DeSaJkLeJDwszK7C9g4BgADngm6Y+kjbvfmdkHSe8lXbo7/6+OYo9Y2yY3BuCxJIhxFdmaWTwDNBVaFXn9L0nsQ3xzd8jYxX+VoZkhNSr3Jp/4tubXJADQp5Roibbb7c0+qWepwRmCMtM6uBRArK7kKIBcOhwr2Hrt7qdzICqml69iPgDh7yCmAMDSyCQW9dhb75RtlnLjdGMBAPboqWkKQFhmudGkEqhYlDZLFzJH38s9IDImNFRB+ZaZsQGmVMZrd78ayZw2/ZCEeZFhq5bcdwyIvcJf+KmzYb7MkZA2sAGBDAc+kLOFK8jsxt2Zdr3IfEJ6rMeKe1I8WIaZ8dgrh99KOlnyiryGbLpKrgaQyYY7RraLh5ccqSs0C4A+ppQo26ZpGg6klOFqbT8p7R6ZhxnR/24OTHKgmt01aGYFhGOvjs0T0msfF8NoIOUpGdYqoMxIs/0sZVwpKq5h3ZArf59TAVlOejjt2acCZhaewj0jVNVhWOIAbH2V36bXl5mEVOi8rkSWHKbUtiZ7AdOQ6G5Be1UgXjKzshLxeLBZPox3zwozirWjHjFrRFUfKR3sDUdj45h0qIK5QVUYt63Giys4X09XDaMxRucMAREt4TX6ixUDoudwRe8Hl5BVLRixVlg9NvWYclcppV3TNDH/Wd67gq0yogVtkzmtwZziul0vWbxLrrbiifYABiBkzoc7wSTx/qkFc1U55Ld7qcAhB8eav3TZQDD7fopnAAAAAElFTkSuQmCC)'
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
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABpklEQVRIS7VW7VHCQBTc68AS0gGxA6xAS8AKfFYgVuBagXRAqEA6ECogJdjBOZt5lzlDEkDJm8nkRy5v9+37uoARM7MihHAfY5wDKACUfnwHoA4hbGOMG5L1kJvQ90GOAbwAuANQAdjqIfmt82Z2A0Cgeh4AfAJ47QM6AjAz/UAAK72T0yGGDmYAFsImKUKt/QIwMx1aihVJyXC2mZnkk/MlSZFrrAXImJdDrF06hdWruUcjYm0kDYD/KJ1HmZtZEz5JydhrWSRzEUkACqkmKXkGzcxEQgBK7tg5+SlILkLGflCa5OkCAFWZZCwFoAoQmt6jdi6Ayy5VdgKQrqtuefUhXQigPDUSKetKSNNE18hBVjiVACLJvFzVxW8ApGPX8lHR/SaCz3kJy/cQgDr5LwCq/7ZHEsDkEk2e5MnLVElVh1670Q4AbqcfFVnNTjfsHCQtmv+O6y/vh2byXnvhrH11Hi+cbGKmSD4AvJ8aIb5kngA8nlyZGYgqSzNdc3/tt4d96lK/bcxijCKjZ+Or8mjT9d4qOkBykK4tM/+293mvwqjGri0/+EslZhJDzTgAAAAASUVORK5CYII=)',
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
