chatease = function() {
	if (chatease.api) {
		return chatease.api.getInstance.apply(this, arguments);
	}
};

chatease.version = '1.0.32';
