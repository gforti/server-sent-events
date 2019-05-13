# Server Sent Events (SSE)

This is a simple example of how to setup a server with Server sent Events along side the Client side implementation on how to receive them.  Compared to webSockets this is a one way event where the client receives from the server but cannot send any data back.

The EventSource API instance opens a persistent connection to an HTTP server, which sends events in `text/event-stream` format.

> Sending data requires an extra `\n` at the end of the `text/event-stream` format

| Field  | Info |
|:---------:|:---------:|
| event | A string identifying the type of event described. |
| data | The data field for the message. |
| id | The event ID to set the EventSource object's last event ID value. |
| retry | The reconnection time to use when attempting to send the event.|

Reasons to use 

- Low latency delivery via a single, long-lived connection
- Efficient browser message parsing with no unbounded buffers
- Automatic tracking of last seen message and auto reconnect
- Client message notifications as DOM events

For more information visit https://developer.mozilla.org/en-US/docs/Web/API/EventSource

With `node.js` and `npm` installed you can run the following command where the `package.json` file directory is located.

```sh
$ npm install
```

once installed you can run the following command to start

```sh
$ npm start
```

The server will run on port 9000.  Visit <http://localhost:9000> to try out the client JavaScript code.

Alternatively you can go to <http://localhost:9000/stream>  to see the server side events being sent.

### Issues with shutting down

Use the following command to kill all instances of node.js running

```sh
$ killall node
```
