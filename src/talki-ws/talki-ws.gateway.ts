import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { envs } from 'src/common/envs';

@WebSocketGateway({
  cors: {
    origin: envs.ORIGIN_CORS,
    credentials: true,
  },
})
export class TalkiWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  // Almacenar los participantes conectados
  participants: Map<string, string> = new Map();

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);

    // Por ahora, asignaremos un nombre genérico
    const username = `User_${client.id.substring(0, 5)}`;
    this.participants.set(client.id, username);

    // Notificar a todos los clientes sobre el nuevo participante
    this.wss.emit('participants', Array.from(this.participants.values()));
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);

    this.participants.delete(client.id);

    this.wss.emit('participants', Array.from(this.participants.values()));
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() payload: { message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const username = this.participants.get(client.id) || 'Anónimo';
    const time = new Date().toLocaleTimeString();

    const chatMessage = {
      user: username,
      time,
      message: payload.message,
      avatarColor: this.getAvatarColor(username),
    };

    this.wss.emit('receiveMessage', chatMessage);
  }

  getAvatarColor(username: string): string {
    const colors = [
      'bg-red-500',
      'bg-green-500',
      'bg-blue-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-gray-500',
    ];
    const index =
      username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      colors.length;
    return colors[index];
  }
}
