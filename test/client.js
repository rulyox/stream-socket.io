const fs = require('fs');
const path = require('path');
const { io: SocketClient } = require('socket.io-client');
const { SocketStream } = require('../dist');

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
