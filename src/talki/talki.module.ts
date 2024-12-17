import { Module } from '@nestjs/common';
import { TalkiService } from './talki.service';
import { TalkiController } from './talki.controller';

@Module({
  controllers: [TalkiController],
  providers: [TalkiService],
})
export class TalkiModule {}
