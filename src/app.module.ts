import { Module } from '@nestjs/common';
import { TalkiWsModule } from './talki-ws/talki-ws.module';
import { ConfigModule } from '@nestjs/config';
import { LiveKitModule } from './talki-ws/modules/livekit.module';

@Module({
  imports: [TalkiWsModule, ConfigModule.forRoot(), LiveKitModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
