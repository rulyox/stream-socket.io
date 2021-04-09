import { Writable, Readable } from 'stream';
import { v4 as uuid } from 'uuid';
import { Socket } from 'socket.io';

class SocketStream {

    private openReadables: { [id: string]: Readable } = {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    public emit(socket: Socket|SocketIOClient.Socket, event: string, options?: any): Writable {

        const id = uuid();

        const writable = new Writable({
            write(chunk, encoding, callback) {

                // emit data
                socket.emit(event, {
                    id: id,
                    chunk: chunk,
                    options: options
                });

                callback();

            }
        });

        writable.on('finish', () => {

            // emit finish
            socket.emit(event, {
                id: id,
                finish: true
            });

        });

        return writable;

    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public on(socket: Socket|SocketIOClient.Socket, event: string, callback: (readStream: Readable, id: string, options?: any) => void): void {

        socket.on(event, (data) => {

            const id = data.id;

            if('finish' in data) { // received finish

                this.openReadables[id].push(null); // EOF

                delete this.openReadables[id];

            } else { // received data

                if(!(id in this.openReadables)) { // new id

                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    const readable = new Readable({ read() {} });

                    this.openReadables[id] = readable;

                    callback(readable, id, data.options);

                }

                this.openReadables[id].push(data.chunk);

            }

        });

    }

}

export default SocketStream;
