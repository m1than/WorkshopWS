import { Module } from '@nestjs/common';
import { ChatGateway } from './chat/chat.gateway';
import {EventSourceService} from "./event-source.service";

@Module({
  providers: [ChatGateway, {
    provide: 'EVENT_SOURCE',
    useClass: EventSourceService,
  }],
  exports: [{ provide: 'EVENT_SOURCE', useClass: EventSourceService }],
})
export class ChatModule {}
