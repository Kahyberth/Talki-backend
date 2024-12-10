import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { envs } from 'src/common/envs';
import { TalkiWsService } from './talki-ws.service';
import axios from 'axios';
import { db } from 'src/db/db';
import { channels, serverMemberships, servers } from 'src/db/schema';
import { eq } from 'drizzle-orm';

@WebSocketGateway({
  cors: {
    origin: envs.ORIGIN_CORS,
    credentials: true,
  },
})
export class TalkiWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly talkiService: TalkiWsService) {}

  @WebSocketServer() wss: Server;
  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
    console.log('Client connected:', client.handshake.auth);
  }

  @SubscribeMessage('join')
  async handleJoin(client: Socket, payload: { server: string }) {
    if (!payload.server) return;

    const { id } = client.handshake.auth;
    if (!id) return; // Asegurar que exista

    const user = await axios.get(`${envs.API_URL}/users/${id}`);
    if (!user.data) return;

    client.join(payload.server);
    this.talkiService.onClientConnectToServer(
      user.data[0].email,
      user.data[0].name,
      payload.server,
    );

    this.wss
      .to(payload.server)
      .emit('participants', this.talkiService.getParticipants(payload.server));
    this.wss
      .to(payload.server)
      .emit(
        'disconnectedParticipants',
        this.talkiService.getDisconnectParticipants(payload.server),
      );
  }

  @SubscribeMessage('leave')
  async handleLeave(client: Socket, payload: { server: string }) {
    if (!payload.server) return;

    const { id } = client.handshake.auth;

    if (!id) return;

    const user = await axios.get(`${envs.API_URL}/users/${id}`);
    if (!user.data) return;

    const userEmail = user.data[0].email;

    client.leave(payload.server);
    this.talkiService.onClientLeaveServer(userEmail, payload.server);

    this.wss
      .to(payload.server)
      .emit('participants', this.talkiService.getParticipants(payload.server));
    this.wss
      .to(payload.server)
      .emit(
        'disconnectedParticipants',
        this.talkiService.getDisconnectParticipants(payload.server),
      );
  }

  @SubscribeMessage('message')
  async handleMessage(
    client: Socket,
    payload: { server: string; message: string },
  ) {
    const { id } = client.handshake.auth;
    if (!id || !payload.server || !payload.message.trim()) return;

    // Obtener el usuario desde la BD, en caso de ser necesario para el nombre
    const user = await axios.get(`${envs.API_URL}/users/${id}`);
    if (!user.data) return;
    const response = await db
      .select()
      .from(servers)
      .innerJoin(serverMemberships, eq(servers.id, serverMemberships.serverId))
      .where(eq(serverMemberships.userId, user.data[0].id));

    if (!response[0]) return;

    const serverChannels = await db
      .select()
      .from(channels)
      .where(eq(channels.serverId, response[0].server_memberships.serverId));

    const status = await this.talkiService.saveMessage(
      serverChannels[0].id,
      user.data[0].id,
      payload.message,
    );

    console.log(status);

    // Emitir el mensaje a todos los clientes del servidor especificado
    client.to(payload.server).emit('message', {
      email: user.data[0].email,
      username: user.data[0].name,
      message: payload.message,
      time: new Date().toLocaleTimeString(),
    });
  }

  async handleDisconnect(client: Socket) {
    const { id } = client.handshake.auth;

    if (!id) return;

    const user = await axios.get(`${envs.API_URL}/users/${id}`);
    if (!user.data) return;

    const userEmail = user.data[0].email;

    if (!userEmail) return;

    const servers = this.talkiService.getServersForClient(userEmail);
    servers.forEach((server) => {
      this.talkiService.onClientLeaveServer(userEmail, server);
      this.wss
        .to(server)
        .emit('participants', this.talkiService.getParticipants(server));
      this.wss
        .to(server)
        .emit(
          'disconnectedParticipants',
          this.talkiService.getDisconnectParticipants(server),
        );
    });
  }
}
