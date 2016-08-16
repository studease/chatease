chatease = function() {
	if (chatease.api) {
		return chatease.api.getInstance.apply(this, arguments);
	}
};

chatease.version = '0.1.19';
chatease.debug = false;
