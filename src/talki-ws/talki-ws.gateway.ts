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
import db from 'src/db/db';
import { chatsTable, serverTable } from 'src/db/schema';
import { eq, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';

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

    try {
      // Verificar si el servidor existe
      const alreadyServerExist = await db
        .select()
        .from(serverTable)
        .where(eq(serverTable.name, payload.server));

      console.log('Already server exist:', alreadyServerExist);
      console.log('Server:', payload.server);
      console.log('User:', user.data[0].name);
      console.log('id:', id);

      // Si no existe, lo creamos
      if (alreadyServerExist.length > 0) {
        console.log('Already server exist:', alreadyServerExist);
        client.data.server = alreadyServerExist[0].id;
        console.log('Client data:', client.data);
      } else {
        const newServer = await db.insert(serverTable).values({
          id: nanoid(),
          name: payload.server,
          description: 'Server created by ' + user.data[0].name,
          created_by: id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        console.log('New server:', newServer);
        client.data.server = newServer[0].id;
      }
    } catch (error) {
      console.log('Error al buscar o crear el servidor:', error);
      return;
    }

    client.join(payload.server);
    this.talkiService.onClientConnectToServer(
      user.data[0].email,
      user.data[0].name,
      payload.server,
    );

    // Recuperar los mensajes del servidor
    console.log('Client handshake:', client.handshake.auth);
    const lastMessage_id = client.handshake.auth.serverOffset ?? 0;

    const messages = await db
      .select()
      .from(chatsTable)
      .where(
        sql`${chatsTable.id} > ${lastMessage_id} and ${chatsTable.server_id} = ${client.data.server}`,
      );

    for (const message of messages) {
      console.log('Message:', message);
    }

    // const sender = await axios.get(
    //   `${envs.API_URL}/users/${messages[0].sender}`,
    // );
    // if (!sender.data) return;

    // console.log('SENDER', sender.data[0]);

    messages.forEach((message) => {
      client.emit('message', {
        username: message.username,
        message: message.message,
        time: new Date().toLocaleTimeString(),
        serverOffset: message.id,
      });
    });

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

    if (!client.data.server) return;

    console.log('Chateando desde el servidor', client.data.server);

    try {
      await db.insert(chatsTable).values({
        message: payload.message,
        sender: id,
        username: user.data[0].name,
        server_id: client.data.server,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.log('Error al guardar el mensaje:', error);
      return;
    }

    // Emitir el mensaje a todos los clientes del servidor especificado
    this.wss.to(payload.server).emit('message', {
      email: user.data[0].email,
      username: user.data[0].name,
      message: payload.message,
      time: new Date().toLocaleTimeString(),
      serverOffset: 0,
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
