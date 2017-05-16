(function(chatease) {
	var utils = chatease.utils,
		events = chatease.events,
		core = chatease.core,
		states = core.states,
		roles = core.protocol.roles,
		renders = core.renders,
		renderModes = renders.modes,
		skins = core.skins,
		skinmodes = skins.modes,
		css = utils.css,
		
		WRAP_CLASS = 'cha-wrapper',
		SKIN_CLASS = 'cha-skin',
		RENDER_CLASS = 'cha-render',
		CONTEXTMENU_CLASS = 'cha-contextmenu';
	
	core.view = function(model) {
		var _this = utils.extend(this, new events.eventdispatcher('core.view')),
			_wrapper,
			_object,
			_renderLayer,
			_contextmenuLayer,
			_render,
			_skin,
			_errorOccurred = false;
		
		function _init() {
			_wrapper = utils.createElement('div', WRAP_CLASS + ' ' + SKIN_CLASS + '-' + model.getConfig('skin').name);
			_wrapper.id = model.getConfig('id');
			_wrapper.tabIndex = 0;
			
			_renderLayer = utils.createElement('div', RENDER_CLASS);
			_contextmenuLayer = utils.createElement('div', CONTEXTMENU_CLASS);
			
			_wrapper.appendChild(_renderLayer);
			_wrapper.appendChild(_contextmenuLayer);
			
			_initRender();
			_initSkin();
			
			var replace = document.getElementById(model.getConfig('id'));
			replace.parentNode.replaceChild(_wrapper, replace);
			
			try {
				_wrapper.addEventListener('keydown', _onKeyDown);
				window.addEventListener('resize', _onResize);
			} catch (err) {
				_wrapper.attachEvent('onkeydown', _onKeyDown);
				window.attachEvent('onresize', _onResize);
			}
		}
		
		function _initRender() {
			var cfg = utils.extend({}, model.getConfig('render'), {
				id: model.getConfig('id'),
				url: model.getConfig('url'),
				width: model.getConfig('width'),
				height: model.getConfig('height'),
				maxlength: model.getConfig('maxlength'),
				maxrecords: model.getConfig('maxrecords')
			});
			
			try {
				_render = _this.render = new renders[cfg.name](_renderLayer, cfg);
				_render.addEventListener(events.CHATEASE_READY, _forward);
				_render.addEventListener(events.CHATEASE_VIEW_SEND, _forward);
				_render.addEventListener(events.CHATEASE_VIEW_PROPERTY, _forward);
				_render.addEventListener(events.CHATEASE_VIEW_CLEARSCREEN, _forward);
				_render.addEventListener(events.CHATEASE_VIEW_NICKCLICK, _forward);
				_render.addEventListener(events.CHATEASE_RENDER_ERROR, _onRenderError);
			} catch (err) {
				utils.log('Failed to init render ' + cfg.name + '!');
			}
		}
		
		function _initSkin() {
			var cfg = utils.extend({}, model.getConfig('skin'), {
				id: model.getConfig('id'),
				width: model.config.width,
				height: model.config.height
			});
			
			try {
				_skin = new skins[cfg.name](cfg);
			} catch (err) {
				utils.log('Failed to init skin ' + cfg.name + '!');
			}
		}
		
		_this.setup = function() {
			// Ignore components & skin failure.
			if (!_render) {
				_this.dispatchEvent(events.CHATEASE_SETUP_ERROR, { message: 'Render not available!', name: model.config.render.name });
				return;
			}
			
			_render.setup();
			_this.resize();
		};
		
		_this.show = function(text, user, type) {
			if (user && !(user.role & roles.SYSTEM) && model.getProperty('shield')) {
				return;
			}
			
			if (_render) {
				_render.show(text, user, type);
			}
		};
		
		function _onKeyDown(e) {
			if (e.ctrlKey || e.metaKey) {
				return true;
			}
			
			switch (e.keyCode) {
				case 13: // enter
					if (_render) {
						_render.send();
					}
					break;
				case 32: // space
					
					break;
				default:
					break;
			}
			
			if (/13|32/.test(e.keyCode)) {
				// Prevent keypresses from scrolling the screen
				e.preventDefault ? e.preventDefault() : e.returnValue = false;
				return false;
			}
		}
		
		function _onResize(e) {
			_this.resize();
		}
		
		_this.resize = function(width, height) {
			if (_render) {
				_render.resize(width, height);
			}
			if (_skin) {
				_skin.resize(width, height);
			}
		};
		
		_this.destroy = function() {
			if (_wrapper) {
				_wrapper.removeEventListener('keydown', _onKeyDown);
			}
			if (_render) {
				_render.destroy();
			}
		};
		
		function _onRenderError(e) {
			_forward(e);
		}
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
		
		_init();
	};
})(chatease);
