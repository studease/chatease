(function(chatease) {
	chatease.events = {
		// General Events
		ERROR: 'error',
		
		// API Events
		CHATEASE_READY: 'chateaseReady',
		CHATEASE_SETUP_ERROR: 'chateaseSetupError',
		CHATEASE_RENDER_ERROR: 'chateaseRenderError',
		
		CHATEASE_STATE: 'chateaseState',
		CHATEASE_PROPERTY: 'chateaseProperty',
		
		CHATEASE_CONNECT: 'chateaseConnect',
		CHATEASE_INDENT: 'chateaseIdent',
		CHATEASE_MESSAGE: 'chateaseMessage',
		CHATEASE_JOIN: 'chateaseJoin',
		CHATEASE_LEFT: 'chateaseLeft',
		CHATEASE_USERS: 'chateaseUsers',
		CHATEASE_CLOSE: 'chateaseClose',
		
		// View Events
		CHATEASE_VIEW_SEND: 'chateaseViewSend',
		CHATEASE_VIEW_PROPERTY: 'chateaseViewProperty',
		CHATEASE_VIEW_CLEARSCREEN: 'chateaseViewClearScreen',
		CHATEASE_VIEW_NICKCLICK: 'chateaseViewNickClick',
		
		// Timer Events
		CHATEASE_TIMER: 'chateaseTimer',
		CHATEASE_TIMER_COMPLETE: 'chateaseTimerComplete'
	};
})(chatease);
