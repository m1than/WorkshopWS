import {Controller, Get, Inject} from '@nestjs/common';
import { AppService } from './app.service';
import {EventSourceService} from "./chat/event-source.service";

@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject('EVENT_SOURCE')
    private readonly eventSource: EventSourceService;

  @Get('/messages')
  public async readMessages(): Promise<unknown> {
    return this.eventSource.getMessages();
  }
}
