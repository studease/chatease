# chatease.js

> [[domain] http://studease.cn](http://studease.cn)

> [[source] https://github.com/studease/chatease](https://github.com/studease/chatease)

This is a client-side script of chat room, transmitting through websocket, with skin build in.


## Tested

* **Chrome**
* **Firefox**
* **Opera**
* **Safari**
* **IE10-11, Edge**
* **IE5-9 (With modified sockjs)**


## Example

### Basic configuraion:

```js
<div id='chatwrap'></div>
...
var chat = chatease('chatwrap').setup({
	width: 300,
	height: 464,
	url: 'ws://192.168.1.202/websocket/websck'
});
```

### More configuration:

Please have a look at cn/studease/embed/chatease.embed.config.js.

```js
_defaults = {
	url: 'ws://' + window.location.host + '/websocket/websck',
	width: 300,
	height: 450,
	renderMode: renderModes.DEFAULT,
	retryDelay: 3,
	maxRetries: 0,
	messageInterval: 0,
	maxlog: 50,
	fallback: true
}
```

### Add callback:

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
```

For more events, check cn/studease/api/chatease.api.js.

```js
_eventMapping = {
	onError: events.ERROR,
	onReady: events.chatease_READY,
	onConnect: events.chatease_CONNECT,
	onIdent: events.chatease_INDENT,
	onMessage: events.chatease_MESSAGE,
	onJoin: events.chatease_JOIN,
	onLeft: events.chatease_LEFT,
	onNickClick: events.chatease_VIEW_NICKCLICK,
	onClose: events.chatease_CLOSE
}
```

### Interface:

* **send(message, userId)**
* **resize(width, height)**

### Server-side sample project:

[chatease-server](https://github.com/studease/chatease-server)


## Software License

MIT.
