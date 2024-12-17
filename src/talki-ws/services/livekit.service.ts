import { Injectable } from '@nestjs/common';
import {
  AccessToken,
  CreateOptions,
  RoomServiceClient,
  VideoGrant,
} from 'livekit-server-sdk';
import { envs } from 'src/common/envs';

@Injectable()
export class LiveKitService {
  private client: RoomServiceClient;

  constructor() {
    const apiKey = envs.LIVEKIT_API_KEY;
    const apiSecret = envs.LIVEKIT_API_SECRET;
    const serverUrl = envs.LIVEKIT_SERVER_URL;

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

  async generateAccessToken(
    roomName: string,
    userName: string,
  ): Promise<string> {
    const apiKey = envs.LIVEKIT_API_KEY;
    const apiSecret = envs.LIVEKIT_API_SECRET;

    const token = new AccessToken(apiKey, apiSecret, {
      identity: userName,
      ttl: '10m',
    });

    const videoGrant: VideoGrant = {
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    };

    token.addGrant(videoGrant);

    return await token.toJwt();
  }
}
