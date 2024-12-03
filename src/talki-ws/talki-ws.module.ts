import { Module } from '@nestjs/common';
import { TalkiWsService } from './talki-ws.service';
import { TalkiWsGateway } from './talki-ws.gateway';

@Module({
  providers: [TalkiWsGateway, TalkiWsService],
})
export class TalkiWsModule {}
