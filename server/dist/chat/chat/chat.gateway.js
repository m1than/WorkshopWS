"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ChatGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const uuid_1 = require("uuid");
const common_1 = require("@nestjs/common");
const event_source_service_1 = require("../event-source.service");
let ChatGateway = ChatGateway_1 = class ChatGateway {
    constructor() {
        this.logger = new common_1.Logger(ChatGateway_1.name);
        this.users = {};
    }
    handleDisconnect(client) {
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
    handleConnection(client, ...args) {
        this.logger.debug(`Client connected: ${client.id}`);
    }
    afterInit(server) {
        this.logger.log('Init chat gateway');
        const state = this.eventSource.replayEvents();
        this.users = state.users;
        this.server.emit('users', Object.values(this.users));
        state.messages.forEach(message => {
            this.server.emit('message', message);
        });
    }
    handleMessage(body) {
        const { event, data } = JSON.parse(body);
        this.logger.debug(`Received message from ${data.sender}: ${data.message}`);
        const eventMessage = {
            type: event,
            payload: Object.assign({ id: (0, uuid_1.v4)() }, data),
            timestamp: Date.now(),
        };
        this.eventSource.addEvent(eventMessage);
        this.server.emit('message', eventMessage.payload);
    }
    handleRegister(client, body) {
        this.logger.debug(`Registering client: ${client.id}`);
        const { username, event } = JSON.parse(body);
        const eventRegister = {
            type: event,
            payload: { clientId: client, username },
            timestamp: Date.now(),
        };
        this.eventSource.addEvent(eventRegister);
        this.users[client.id] = username;
        this.server.emit('users', Object.values(this.users));
    }
    handleReaction(data) {
        const { event, username, messageId, reaction } = JSON.parse(data);
        const eventReaction = {
            type: event,
            payload: { user: username, messageId, reaction },
            timestamp: Date.now(),
        };
        this.eventSource.addEvent(eventReaction);
        this.server.emit('reaction', data);
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, common_1.Inject)('EVENT_SOURCE'),
    __metadata("design:type", event_source_service_1.EventSourceService)
], ChatGateway.prototype, "eventSource", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('register'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleRegister", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('reaction'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleReaction", null);
exports.ChatGateway = ChatGateway = ChatGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    })
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map