const fs = require('fs');
const path = require('path');
const { Server: SocketServer } = require('socket.io');
const { SocketStream } = require('../dist');

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
