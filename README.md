toggl-events
============
Higher-level wrapper on top of the Toggl WebSockets API.

## Usage
```javascript
var TogglEvents = require('toggl-events');
TogglEvents.onMessage(function(message) {
  console.log(message);
}, process.env.TOGGL_API_TOKEN):
```

## API Documentation
### `new TogglEvents(options)`
Creates a WebSocket connection with Toggl and starts emitting events.

- `[options.token]` **(String)** - An API token
- - -
- `[options.url]` **(String)** - The Toggl WebSocket URL to hit
- `[options.origin]` **(String)** - The origin to use

### Events emitted by `TogglEvents`
`TogglEvents` is an `EventEmitter`. It emits:
- **close**
- **connect**
- **open**

### `TogglEvents.prototype.connect([options])`
Forces a re-connection with an optional new hash of options. Won't overwrite the
options property and will be merged with the hash passed into the constructor

### `TogglEvents.prototype.authenticate([token])`
Forces re-authentication with an optional new token.

### `TogglEvents.prototype.send([msg])`
Sends an object as a message through the connection.

### `TogglEvents.prototype.isConnected()`
Returns true if the connection is open.

### `TogglEvents.prototype.isAuthenticated()`
Returns true if the connection is authenticated.

### `TogglEvents.onMessage(callback[, options][, token])`
Helper to create quick message listeners.

## License
This code is licensed under the MIT license.
