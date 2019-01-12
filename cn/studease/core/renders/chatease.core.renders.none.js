(function(chatease) {
	var utils = chatease.utils,
		events = chatease.events,
		core = chatease.core,
		message = core.message,
		roles = message.roles,
		renders = core.renders,
		rendermodes = renders.modes,
		css = utils.css,
		
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
		CSS_IMPORTANT = ' !important',
		CSS_HIDDEN = 'hidden',
		CSS_NONE = 'none',
		CSS_BLOCK = 'block';
	
	renders.none = function(layer, config) {
		var _this = utils.extend(this, new events.eventdispatcher('renders.none')),
			_defaults = {},
			_titleLayer,
			_consoleLayer,
			_controlsLayer,
			_dialogLayer,
			_textInput,
			_sendButton;
		
		function _init() {
			_this.name = rendermodes.NONE;
			_this.config = utils.extend({}, _defaults, config);
			
			if (utils.isMSIE('(8|9)')) {
				layer.innerHTML = ''
					+ '<object id="cha-swf" name="cha-swf" align="middle" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000">'
						+ '<param name="movie" value="' + _this.config.swf + '">'
						+ '<param name="quality" value="high">'
						+ '<param name="bgcolor" value="#ffffff">'
						+ '<param name="allowscriptaccess" value="sameDomain">'
						+ '<param name="allowfullscreen" value="true">'
						+ '<param name="wmode" value="transparent">'
						+ '<param name="FlashVars" value="id=' + _this.config.id + '">'
					+ '</object>';
				
				_object = _this.WebSocket = layer.firstChild;
			}/* else {
				_object = utils.createElement('object');
				_object.id = _object.name = 'cha-swf';
				_object.align = 'middle';
				_object.innerHTML = ''
					+ '<param name="quality" value="high">'
					+ '<param name="bgcolor" value="#ffffff">'
					+ '<param name="allowscriptaccess" value="sameDomain">'
					+ '<param name="allowfullscreen" value="true">'
					+ '<param name="wmode" value="transparent">'
					+ '<param name="FlashVars" value="id=' + _this.config.id + '">';
				
				if (utils.isMSIE()) {
					_object.classid = 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000';
					_object.movie = _this.config.swf;
				} else {
					_object.type = 'application/x-shockwave-flash';
					_object.data = _this.config.swf;
				}
				
				_this.WebSocket = _object;
				_object.style.width = _object.style.height = '0';
				layer.appendChild(_object);
			}*/
		}
		
		_this.setup = function() {
			if (utils.isMSIE('(8|9)')) {
				if (_object.setup) {
					_this.config.debug = true;
					_object.setup(_this.config);
					_this.dispatchEvent(events.CHATEASE_READY, { id: _this.config.id });
				}
			} else {
				_this.dispatchEvent(events.CHATEASE_READY, { id: _this.config.id });
			}
		};
		
		_this.show = function(text, user, mode) {
			
		};
		
		_this.send = function() {
			
		};
		
		_this.clearInput = function() {
			
		};
		
		_this.clearScreen = function() {
			
		};
		
		_this.element = function() {
			return _object;
		};
		
		_this.resize = function(width, height) {
			
		};
		
		_this.destroy = function() {
			
		};
		
		_init();
	};
})(chatease);
