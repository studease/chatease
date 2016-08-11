# chatease.js

> [[domain] http://studease.cn](http://studease.cn)

> [[source] https://github.com/studease/chatease](https://github.com/studease/chatease)

> [[zh_doc] http://blog.csdn.net/icysky1989/article/details/52138527](http://blog.csdn.net/icysky1989/article/details/52138527)

This is a client-side script of chat room, transmitting through websocket, with skin build in.


## Tested

* **Chrome**
* **Firefox**
* **Opera**
* **Safari**
* **IE10-11, Edge**
* **IE7-9 (using sockjs)**


## Example

### Basic configuraion:

The example below will find the element with an id of chatwrap and render a dialog into it.

```js
<div id='chatwrap'></div>
...
var chat = chatease('chatwrap').setup({
	width: 300,
	height: 464,
	url: 'ws://localhost/websocket/websck',
	channel: 1
});
```

### More configuration:

Please have a look at cn/studease/embed/chatease.embed.config.js.

```js
_defaults = {
	url: 'ws://' + window.location.host + '/websocket/websck',
	width: 300, // px
	height: 450, // px
	
	channel: 1, // Channel ID in Number type.
	
	maxlength: 30, // 0: no limit, uint: n bytes
	interval: 0, // ms
	
	maxRetries: 0, // -1: never, 0: always, uint: n times
	retryDelay: 3000, // ms
	
	render: {
		name: renderModes.DEFAULT, // 'def'
		skin: {
			name: skinModes.DEFAULT // 'def'
		}
	},
	
	keywords: '', // 'keywords1|keywords2|keywordsx'
	maxRecords: 50 // 0: no limit
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
	onError: events.ERROR, // Error occured.
	onReady: events.CHATEASE_READY, // Initialized, or UI is ready.
	onConnect: events.CHATEASE_CONNECT, // Server connected.
	onIdent: events.CHATEASE_INDENT, // Joined channel.
	onMessage: events.CHATEASE_MESSAGE, // Got message.
	onJoin: events.CHATEASE_JOIN, // Someone joined in.
	onLeft: events.CHATEASE_LEFT, // Someone left.
	onNickClick: events.CHATEASE_VIEW_NICKCLICK, // Clicked someone's nickname.
	onClose: events.CHATEASE_CLOSE // Connection closed.
}
```

### Interface:

* **send(data)**

> Params:

> 	data: An object which will be sent in json format.

* **resize(width, height)**

> Params:

> 	width: Width in px.

> 	height: Hieght in px.

### Server-side sample project:

[chatease-server](https://github.com/studease/chatease-server)


## Software License

MIT.
