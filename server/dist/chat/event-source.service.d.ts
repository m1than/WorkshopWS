interface Event {
    type: string;
    payload: any;
    timestamp: number;
}
export declare class EventSourceService {
    private events;
    addEvent(event: Event): void;
    getEvents(): Event[];
    getMessages(): Event[];
    replayEvents(): any;
    private applyEvent;
}
export {};
