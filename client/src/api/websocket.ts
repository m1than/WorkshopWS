import { io, Socket } from 'socket.io-client';

export class WebsocketClient {
    entryPoint: Socket;

    constructor() {
        this.entryPoint = io('http://localhost:8000');
    }

    on(event: string, callback: (...args: any[]) => void) {
        this.entryPoint.on(event, callback);
    }

    off(event: string) {
        this.entryPoint.off(event);
    }

    emit(event: string, data: any) {
        this.entryPoint.emit(event, data);
    }

    register(username: string) {
        this.emit('register', JSON.stringify({ event: 'register', username }));
    }

    sendMessage(username: string, message: string) {
        this.emit('message', JSON.stringify({ event: 'message', data: { sender: username, message } }));
    }
}