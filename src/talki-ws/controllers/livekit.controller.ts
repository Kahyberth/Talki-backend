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
  async generateToken(
    @Body('roomName') roomName: string,
    @Body('userName') userName: string,
  ) {
    try {
      // Asegúrate de que el método generateAccessToken esté devolviendo un valor
      const token = await this.liveKitService.generateAccessToken(
        roomName,
        userName,
      ); // Usar await si es asíncrono

      if (!token) {
        throw new Error('Failed to generate token');
      }

      return { token }; // Envía el token al frontend
    } catch (error) {
      console.error('Error generating token:', error);
      throw new Error('Error generating token');
    }
  }
}
