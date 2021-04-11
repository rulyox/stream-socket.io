import { Writable, Readable } from 'stream';
import { v4 as uuid } from 'uuid';
import { Socket } from 'socket.io';
import Data from './Data';

class SocketStream {

    private openReadables: { [id: string]: Readable } = {};

    public emit(socket: Socket|SocketIOClient.Socket, event: string, options?: any): Writable {

        const id = uuid();

        const writable = new Writable({
            write(chunk, encoding, callback) {

                // emit data
                const data = new Data(id, undefined, chunk, options);
                socket.emit(event, data);

                callback();

            }
        });

        writable.on('finish', () => {

            // emit finish
            const data = new Data(id, true, undefined, undefined);
            socket.emit(event, data);

        });

        return writable;

    }

    public on(socket: Socket|SocketIOClient.Socket, event: string, callback: (readStream: Readable, id: string, options?: any) => void): void {

        socket.on(event, (obj) => {

            const data: Data = Data.getInstance(obj);

            const id = data.id;

            if(data.finish === true) { // received finish

                this.openReadables[id].push(null); // EOF

                delete this.openReadables[id];

            } else { // received data

                // new id
                if(!(id in this.openReadables)) {

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
