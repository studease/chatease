(function(chatease) {
	var utils = chatease.utils;
	
	utils.filter = function(keywords) {
		var _this = this,
			_re,
			_keywords = ''; // 'keyword1|keyword2|...'
		
		function _init() {
			if (utils.typeOf(keywords) == 'string' && keywords) {
				_keywords = keywords;
				_re = new RegExp(_keywords, 'ig');
			}
		}
		
		_this.replace = function(txt) {
			if (!_keywords || !_re) 
				return txt;
			return txt.replace(_re, '**');
		};
		
		_init();
	};
})(chatease);
