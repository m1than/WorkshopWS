import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Socket } from 'socket.io';
export declare class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger;
    private readonly server;
    private readonly eventSource;
    private users;
    handleDisconnect(client: any): void;
    handleConnection(client: Socket, ...args: any[]): void;
    afterInit(server: any): void;
    handleMessage(body: unknown): void;
    handleRegister(client: Socket, body: any): void;
    handleReaction(data: any): void;
}
