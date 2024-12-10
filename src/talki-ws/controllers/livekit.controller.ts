import { Controller, Post, Body } from '@nestjs/common';
import { LiveKitService } from '../services/livekit.service';

@Controller('livekit')
export class LiveKitController {
  constructor(private readonly liveKitService: LiveKitService) {}

  @Post('create-room')
  async createRoom(@Body('roomName') roomName: string) {
    try {
      const room = await this.liveKitService.createRoom(roomName);
      return { room };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('generate-token')
  generateToken(@Body('roomName') roomName: string, @Body('userName') userName: string) {
    const token = this.liveKitService.generateAccessToken(roomName, userName);
    return { token };
  }
}
