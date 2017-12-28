# chatease.js

> [[domain] http://studease.cn](http://studease.cn/chatease.html)

> [[source] https://github.com/studease/chatease](https://github.com/studease/chatease)

> [[中文] http://blog.csdn.net/icysky1989/article/details/52138527](http://blog.csdn.net/icysky1989/article/details/52138527)

> 公众号：STUDEASE

> QQ群：528109813

This is a client-side script for websocket chat, with skin built in.


## Tested
---------

* **Chrome**
* **Firefox**
* **Opera**
* **Safari**
* **IE10-11, Edge**
* **IE7-9 (Flash is needed.)**


## Example
----------

### Basic Configuraion

The example below will find the element with an id of "chatwrap" and render a dialog into it.

```js
<div class='ol-status' style='width: 100%; max-width: 640px;'>
	<label>Online: </label>
	<span id='ol-users'>0</span>
</div>
<div id='chatwrap' style='width: 100%; height: 400px; max-width: 640px;'>
	<div id='chat'></div>
</div>
...

var users = document.getElementById('ol-users');
var events = chatease.events;

var chat = chatease('chat');
chat.addEventListener(events.CHATEASE_INDENT, onIdent);
chat.addEventListener(events.CHATEASE_CLOSE, onClose);
chat.setup({
	url: 'ws://localhost/ch1?token=123456',
	width: 640,
	height: 400
});

function onIdent(e) {
	users.innerText = e.channel.total;
}

function onClose(e) {
	users.innerText = 0;
}
```

We append token right after the URL, while some browsers won't bring cookies when upgrading protocol.

### More Configuration

Please have a look at cn/studease/embed/chatease.embed.config.js.

```js
_defaults = {
	url: 'ws://' + window.location.host + '/ch1?token=',
	width: 640,
	height: 400,
	keywords: '',
	maxlength: 30,  // -1: no limit
	maxrecords: 50,
	maxretries: -1, // -1: always
	retrydelay: 3000,
	smoothing: false,
	debug: false,
	render: {
		name: rendermodes.DEFAULT,
		title: 'CHATEASE ' + chatease.version,
		swf: 'swf/chatease.swf'
	},
	skin: {
		name: skinmodes.DEFAULT
	}
}
```

### Add Callback

```js
var chat = chatease('chatwrap').setup({
	...
	events: {
		onReady: function(e) {
			console.log('onReady');
		},
		...
	}
});

// or

var events = chatease.events;
var chat = chatease('chat');
chat.addEventListener(events.CHATEASE_READY, onReady);
chat.setup({
	...
});

function onReady(e) {
	console.log('onReady');
}
```

For more events, please check cn/studease/api/chatease.api.js, or the source of test/index.html.

```js
_eventMapping = {
	onError: events.ERROR,
	onReady: events.CHATEASE_READY,
	onConnect: events.CHATEASE_CONNECT,
	onIdent: events.CHATEASE_INDENT,
	onMessage: events.CHATEASE_MESSAGE,
	onJoin: events.CHATEASE_JOIN,
	onLeft: events.CHATEASE_LEFT,
	onUsers: events.CHATEASE_USERS,
	onExtern: events.CHATEASE_EXTERN,
	onNickClick: events.CHATEASE_NICKCLICK,
	onClose: events.CHATEASE_CLOSE
}
```

### Interface

* **send(data)**

> 	data: An object which will be sent in json format.

* **close()**

* **getState()**

* **resize(width, height)**

> 	width: Width in px.

> 	height: Height in px.

### Websocket Server

[chatease-server https://github.com/studease/chatease-server](https://github.com/studease/chatease-server)


## License
----------

MIT
