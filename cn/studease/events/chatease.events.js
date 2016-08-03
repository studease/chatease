(function(chatease) {
	chatease.events = {
		// General Events
		ERROR: 'ERROR',
		
		// API Events
		chatease_READY: 'chateaseReady',
		chatease_SETUP_ERROR: 'chateaseSetupError',
		chatease_RENDER_ERROR: 'chateaseRenderError',
		
		chatease_STATE: 'chateaseState',
		chatease_CONNECT: 'chateaseConnect',
		chatease_INDENT: 'chateaseIdent',
		chatease_MESSAGE: 'chateaseMessage',
		chatease_JOIN: 'chateaseJoin',
		chatease_LEFT: 'chateaseLeft',
		chatease_ERROR: 'chateaseError',
		chatease_CLOSE: 'chateaseClose',
		
		chatease_VIEW_SEND: 'chateaseViewSend',
		chatease_VIEW_SHIELDMSG: 'chateaseViewMsgShield',
		chatease_VIEW_CLEARSCREEN: 'chateaseViewClearScreen',
		chatease_VIEW_NICKCLICK: 'chateaseViewNickClick'
	};
})(chatease);
