import { Module } from '@nestjs/common';
import { TalkiWsModule } from './talki-ws/talki-ws.module';
import { ConfigModule } from '@nestjs/config';
import { LiveKitModule } from './talki-ws/modules/livekit.module';
import { TalkiModule } from './talki/talki.module';

@Module({
  imports: [TalkiWsModule, ConfigModule.forRoot(), LiveKitModule, TalkiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
