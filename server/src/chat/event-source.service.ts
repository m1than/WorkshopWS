import {Injectable} from "@nestjs/common";

interface Event {
    type: string;
    payload: any;
    timestamp: number;
}


@Injectable()
export class EventSourceService {
    private events: Event[] = [];

    addEvent(event: Event): void {
        this.events.push(event);
    }
    getEvents(): Event[] {
        return this.events;
    }

    getMessages() {
        return this.events.filter(event => event.type === 'message');
    }
    replayEvents(): any {
        const state = {
            users: {},
            messages: [],
        };

        for (const event of this.events) {
            this.applyEvent(state, event);
        }

        return state;
    }

    private applyEvent(state: any, event: Event): void {
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
}