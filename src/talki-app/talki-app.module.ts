import { Module } from '@nestjs/common';
import { TalkiAppService } from './talki-app.service';
import { TalkiAppController } from './talki-app.controller';

@Module({
  controllers: [TalkiAppController],
  providers: [TalkiAppService],
})
export class TalkiAppModule {}
