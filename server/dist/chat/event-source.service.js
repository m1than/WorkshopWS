"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventSourceService = void 0;
const common_1 = require("@nestjs/common");
let EventSourceService = class EventSourceService {
    constructor() {
        this.events = [];
    }
    addEvent(event) {
        this.events.push(event);
    }
    getEvents() {
        return this.events;
    }
    getMessages() {
        return this.events.filter(event => event.type === 'message');
    }
    replayEvents() {
        const state = {
            users: {},
            messages: [],
        };
        for (const event of this.events) {
            this.applyEvent(state, event);
        }
        return state;
    }
    applyEvent(state, event) {
        switch (event.type) {
            case 'register':
                state.users[event.payload.clientId] = event.payload.username;
                break;
            case 'message':
                state.messages.push({
                    id: event.payload.id,
                    sender: event.payload.sender,
                    message: event.payload.message,
                    reactions: []
                });
                break;
            case 'reaction':
                const message = state.messages.find(msg => msg.id === event.payload.messageId);
                if (message) {
                    message.reactions.push({
                        user: event.payload.user,
                        reaction: event.payload.reaction
                    });
                }
                break;
            case 'disconnect':
                delete state.users[event.payload.clientId];
                break;
        }
    }
};
exports.EventSourceService = EventSourceService;
exports.EventSourceService = EventSourceService = __decorate([
    (0, common_1.Injectable)()
], EventSourceService);
//# sourceMappingURL=event-source.service.js.map