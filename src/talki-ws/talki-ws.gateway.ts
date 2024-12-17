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

    console.log('Message:', payload.message, 'Server:', payload.server);

    // Obtener el usuario desde la BD, en caso de ser necesario para el nombre
    const user = await axios.get(`${envs.API_URL}/users/${id}`);
    if (!user.data) return;

    // Emitir el mensaje a todos los clientes del servidor especificado
    this.wss.to(payload.server).emit('message', {
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
