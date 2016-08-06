(function(chatease) {
	chatease.events = {
		// General Events
		ERROR: 'ERROR',
		
		// API Events
		CHATEASE_READY: 'chateaseReady',
		CHATEASE_SETUP_ERROR: 'chateaseSetupError',
		CHATEASE_RENDER_ERROR: 'chateaseRenderError',
		
		CHATEASE_STATE: 'chateaseState',
		CHATEASE_CONNECT: 'chateaseConnect',
		CHATEASE_INDENT: 'chateaseIdent',
		CHATEASE_MESSAGE: 'chateaseMessage',
		CHATEASE_JOIN: 'chateaseJoin',
		CHATEASE_LEFT: 'chateaseLeft',
		CHATEASE_ERROR: 'chateaseError',
		CHATEASE_CLOSE: 'chateaseClose',
		
		CHATEASE_VIEW_SEND: 'chateaseViewSend',
		CHATEASE_VIEW_SHIELDMSG: 'chateaseViewMsgShield',
		CHATEASE_VIEW_CLEARSCREEN: 'chateaseViewClearScreen',
		CHATEASE_VIEW_NICKCLICK: 'chateaseViewNickClick'
	};
})(chatease);
