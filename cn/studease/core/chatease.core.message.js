(function(chatease) {
	chatease.core.message = {};
	
	var message = chatease.core.message;
	
	message.keys = {
		CMD:     'cmd',
		SEQ:     'seq',
		DATA:    'data',
		MODE:    'mode',
		USER:    'user',
		SUB:     'sub',
		CHANNEL: 'channel',
		GROUP:   'group',
		ERROR:   'error',
		
		ID:      'id',
		NAME:    'name',
		ICON:    'icon',
		ROLE:    'role',
		STAT:    'stat',
		STATUS:  'status',
		CODE:    'code'
	};
	
	message.cmds = {
		INFO:   'info',
		TEXT:   'text',
		USER:   'user',
		JOIN:   'join',
		LEFT:   'left',
		CTRL:   'ctrl',
		EXTERN: 'extern',
		PING:   'ping',
		PONG:   'pong',
		ERROR:  'error'
	};
	
	message.opts = {
		MUTE:   'mute',
		FORBID: 'forbid'
	};
	
	message.modes = {
		UNI:       0x00,
		MULTI:     0x01,
		BROADCAST: 0x02,
		OUTDATED:  0x04
	};
	
	message.roles = {
		VISITOR:   0x00,
		NORMAL:    0x01,
		VIP:       0x0E,
		ASSISTANT: 0x10,
		SECRETARY: 0x20,
		ANCHOR:    0x30,
		ADMIN:     0x40,
		SU_ADMIN:  0x80,
		SYSTEM:    0xC0
	};
	
	message.status = {
		BadRequest:          400,
		Unauthorized:        401,
		Forbidden:           403,
		NotFound:            404,
		MethodNotAllowed:    405,
		NotAcceptable:       406,
		ProxyAuthRequired:   407,
		RequestTimeout:      408,
		TooManyRequests:     429,
		
		InternalServerError: 500,
		NotImplemented:      501,
		BadGateway:          502,
		ServiceUnavailable:  503,
		GatewayTimeout:      504
	};
	
	message.parseControl = function(data) {
		var reg = new RegExp('^([a-z]+):([0-9]+)$', 'i')
		var arr = reg.exec(data);
		if (arr == null) {
			return null
		}
		
		return [arr[1], parseInt(arr[2])];
	};
})(chatease);
