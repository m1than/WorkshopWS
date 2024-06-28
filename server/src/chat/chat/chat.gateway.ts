import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import {Inject, Logger} from "@nestjs/common";
import {EventSourceService} from "../event-source.service";

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name);
  @WebSocketServer()
  private readonly server: Server;

  @Inject('EVENT_SOURCE')
  private readonly eventSource: EventSourceService;

  private users: { [key: string]: string } = {};

  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected: ${client.id}`);
    const event = {
      type: 'disconnect',
      payload: { clientId: client.id },
      timestamp: Date.now(),
    };
    this.eventSource.addEvent(event);
    delete this.users[client.id];
    this.server.emit('users', Object.values(this.users));
  }
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.debug(`Client connected: ${client.id}`);
  }
  afterInit(server: any) {
    this.logger.log('Init chat gateway');
    const state = this.eventSource.replayEvents();
    this.users = state.users;
    this.server.emit('users', Object.values(this.users));
    state.messages.forEach(message => {
      this.server.emit('message', message);
    });
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() body: unknown): void {
    const {event, data} = JSON.parse(body as string) as {event: string, data: {sender: string, message: string }}
    this.logger.debug(`Received message from ${data.sender}: ${data.message}`);
    const eventMessage = {
      type: event,
      payload: { id: uuidv4(), ...data},
      timestamp: Date.now(),
    };
    this.eventSource.addEvent(eventMessage);
    this.server.emit('message', eventMessage.payload);
  }

  @SubscribeMessage('register')
  handleRegister(@ConnectedSocket() client: Socket, @MessageBody() body: any): void {
    this.logger.debug(`Registering client: ${client.id}`);
    const {username, event} = JSON.parse(body) as {username: string, event: string};
    const eventRegister = {
      type: event,
      payload: { clientId: client, username},
      timestamp: Date.now(),
    };
    this.eventSource.addEvent(eventRegister);
    this.users[client.id] = username;
    this.server.emit('users', Object.values(this.users));
  }

  @SubscribeMessage('reaction')
  handleReaction(@MessageBody() data: any): void {
    const {event, username, messageId, reaction} = JSON.parse(data) as { event: string, username: string, messageId: string, reaction: string }
    const eventReaction = {
      type: event,
      payload: { user: username, messageId, reaction },
      timestamp: Date.now(),
    };
    this.eventSource.addEvent(eventReaction);
    this.server.emit('reaction', data);
  }
}
