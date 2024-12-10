import { Module } from '@nestjs/common';
import { LiveKitService } from '../services/livekit.service';
import { LiveKitController } from '../controllers/livekit.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],  // Asegúrate de importar ConfigModule si no lo has hecho
  providers: [LiveKitService],
  controllers: [LiveKitController],
})
export class LiveKitModule {}
