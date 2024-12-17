import { Injectable } from '@nestjs/common';

// import { db } from 'src/db/db'; // Asumiendo que aquí tienes tu instancia de Drizzle
// import { messages } from 'src/db/schema'; // Tus tablas de drizzle

interface Participant {
  email: string;
  username: string;
  avatarColor: string;
}

@Injectable()
export class TalkiWsService {
  private serverParticipants: Map<string, Participant[]> = new Map();
  private serverDisconnected: Map<string, Participant[]> = new Map();

  constructor() {
    // Inicialización, si es necesario
  }

  onClientConnectToServer(userEmail: string, userName: string, server: string) {
    const participants = this.serverParticipants.get(server) ?? [];
    const disconnected = this.serverDisconnected.get(server) ?? [];

    console.log(
      'User:',
      userEmail,
      'userName:',
      userName,
      'joined server:',
      server,
    );

    // Si el usuario estaba en desconectados, lo removemos
    const wasDisconnectedIndex = disconnected.findIndex(
      (p) => p.email === userEmail,
    );
    if (wasDisconnectedIndex !== -1) {
      disconnected.splice(wasDisconnectedIndex, 1);
      this.serverDisconnected.set(server, disconnected);
    }

    // Si no existe en participantes, lo agregamos
    const existingIndex = participants.findIndex((p) => p.email === userEmail);
    if (existingIndex === -1) {
      participants.push({
        email: userEmail,
        username: userName,
        avatarColor: this.getRandomAvatarColor(),
      });
      this.serverParticipants.set(server, participants);
    }
  }

  onClientLeaveServer(userEmail: string, server: string) {
    const participants = this.serverParticipants.get(server) ?? [];
    const disconnected = this.serverDisconnected.get(server) ?? [];

    const index = participants.findIndex((p) => p.email === userEmail);
    if (index !== -1) {
      const [leavingParticipant] = participants.splice(index, 1);
      disconnected.push(leavingParticipant);
      this.serverParticipants.set(server, participants);
      this.serverDisconnected.set(server, disconnected);
    }
  }

  getParticipants(server: string): Participant[] {
    return this.serverParticipants.get(server) ?? [];
  }

  getDisconnectParticipants(server: string): Participant[] {
    return this.serverDisconnected.get(server) ?? [];
  }

  getServersForClient(userEmail: string): string[] {
    const servers: string[] = [];
    for (const [server, participants] of this.serverParticipants.entries()) {
      const isParticipant = participants.some((p) => p.email === userEmail);
      if (isParticipant) {
        servers.push(server);
      }
    }
    return servers;
  }

  private getRandomAvatarColor(): string {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-indigo-500',
      'bg-purple-500',
      'bg-pink-500',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // async saveMessage(channelId: number, userId: string, content: string) {
  //   await db.insert(messages).values({
  //     channelId,
  //     userId,
  //     content,
  //   });
  // }
}
