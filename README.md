# server-sent-events

This is a simple example of how to setup a server with Server sent Events along side the Client side implementation on how to receive them.  Compared to webSockets this is a one way event where the client receives from the server but cannot send any data back.

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
