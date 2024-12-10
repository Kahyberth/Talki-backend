import { Module } from '@nestjs/common';
import { TalkiWsModule } from './talki-ws/talki-ws.module';
import { TalkiAppModule } from './talki-app/talki-app.module';

@Module({
  imports: [TalkiWsModule, TalkiAppModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
