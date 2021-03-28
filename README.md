# stream-socket.io

Use stream through Socket.IO.

Both socket server and client can receive and send streams.

Any pipeable streams can be used. (Files, Processes, Networks, etc.)

* [npm](https://www.npmjs.com/package/stream-socket.io)
* [GitHub](https://github.com/rulyox/stream-socket.io)

## Installation

```shell script
npm install stream-socket.io
```

## Example

### Server

```javascript
const fs = require('fs');
const path = require('path');
const { Server: SocketServer } = require('socket.io');
const { SocketStream } = require('stream-socket.io');

const socketServer = new SocketServer();
const socketStream = new SocketStream();

const initEventHandlers = (socket) => {

    socketStream.on(socket, 'file-transfer', (readStream, id, options) => {

        const target = path.join(__dirname, 'file_received_' + id);
        const fileStream = fs.createWriteStream(target);

        readStream.pipe(fileStream);

        // for debugging
        console.log(`Receiving File : ${id} : ${options.message}`);
        readStream.on('end', () => console.log('Socket Read End'));
        fileStream.on('finish', () => console.log('File Write Finish'));

    });

};

socketServer.on('connection', (socket) => initEventHandlers(socket));
socketServer.attach(8080);
```

### Client

```javascript
const fs = require('fs');
const path = require('path');
const { io: SocketClient } = require('socket.io-client');
const { SocketStream } = require('stream-socket.io');

const socket = SocketClient.connect('ws://localhost:8080');
const socketStream = new SocketStream();

const writeStream = socketStream.emit(socket, 'file-transfer', {
    message: 'Dog Image'
});

const target = path.join(__dirname, 'dog.png');
const fileStream = fs.createReadStream(target);

fileStream.pipe(writeStream);

// for debugging
console.log(`Sending File : ${target}`);
writeStream.on('finish', () => console.log('Socket Write Finish'));
fileStream.on('end', () => console.log('File Read End'));
```

## API

### socketStream.on(socket, event, callback)

Used on the receiving side.

* `socket` : Socket from Socket.IO server or client.
* `event` : Name of event to be used for stream communication. This name should not be used for other events.
* `callback(readStream, id, options)` : Callback function to declare what to do with the received stream.
* `readStream` : Received read stream.
* `id` : Randomly generated uuid.
* `options` : Any additional data received.

### socketStream.emit(socket, event, options)

Used on the sending side.

* `socket` : Socket from Socket.IO server or client.
* `event` : Name of event to be used for stream communication. This name should not be used for other events.
* `options` : Any additional data to send.
