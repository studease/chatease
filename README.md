# chatease

This is a client-side script of chat room, transmitting through websocket.


## Tested

* **Chrome**
* **Firefox**
* **Opera**
* **Safari**
* **IE9-11, Edge**
* **IE5-8(sockjs)**


## Example

```js
		<div id='chatwrap'></div>
		...
		var chat = chatease('chatwrap').setup({
			width: 300,
			height: 464,
			url: 'ws://192.168.1.202/websocket/websck',
			maxlog: 20,
			events: {
				onReady: function(e) {
					cblog('onReady');
				},
				onConnect: function(e) {
					cblog('onConnect');
				},
				onIdent: function(e) {
					cblog('onIdent', e.user.name + '[' + e.user.id + ', ' + e.user.role + ', ' + e.user.interval + '] in channel ' + e.channel + '.');
				},
				onMessage: function(e) {
					//cblog('onMessage', e.user.name + ': ' + e.data);
				},
				onJoin: function(e) {
					cblog('onJoin', e.user.name + '[' + e.user.id + ', ' + e.user.role + '] joined channel ' + e.channel + '.');
				},
				onLeft: function(e) {
					cblog('onJoin', e.user.name + '[' + e.user.id + ', ' + e.user.role + '] left channel ' + e.channel + '.');
				},
				onNickClick: function(e) {
					cblog('onNickClick', e.user.name + '[' + e.user.id + ', ' + e.user.role + ']');
				},
				onError: function(e) {
					cblog('onError');
				},
				onClose: function(e) {
					cblog('onClose');
				}
			}
		});
		
		function cblog(cb, msg) {
			console.log('[cb.' + cb + '] ' + (msg || ''));
		}
```

For more configuration, please have a look at cn/studease/embed/chatease.embed.config.js


## Software License

MIT
