import { Module } from '@nestjs/common';
import { TalkiWsModule } from './talki-ws/talki-ws.module';

@Module({
  imports: [TalkiWsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
