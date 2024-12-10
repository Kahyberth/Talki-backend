import { Injectable } from '@nestjs/common';
import { AccessToken, CreateOptions, RoomServiceClient } from 'livekit-server-sdk';
import { ConfigService } from '@nestjs/config';  // Asegúrate de que ConfigService esté importado

@Injectable()
export class LiveKitService {
  private client: RoomServiceClient;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('LIVEKIT_API_KEY');
    const apiSecret = this.configService.get<string>('LIVEKIT_API_SECRET');
    const serverUrl = this.configService.get<string>('LIVEKIT_SERVER_URL');

    this.client = new RoomServiceClient(serverUrl, apiKey, apiSecret);
  }

  async createRoom(roomName: string) {
    try {
      const createOptions: CreateOptions = {
        name: roomName,
        // Add other properties as needed
      };
      const room = await this.client.createRoom(createOptions);
      return room;
    } catch (error) {
      throw new Error(`Error creating room: ${error.message}`);
    }
  }

  async generateAccessToken(roomName: string, userName: string): Promise<string> {
    const apiKey = this.configService.get<string>('LIVEKIT_API_KEY');
    const apiSecret = this.configService.get<string>('LIVEKIT_API_SECRET');
    
    const token = new AccessToken(apiKey, apiSecret);
    token.addGrant({
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });
    token.identity = userName;

    return await token.toJwt();
  }
}
