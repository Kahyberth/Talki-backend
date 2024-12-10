import { Injectable } from '@nestjs/common';
import { CreateTalkiAppDto } from './dto/create-talki-app.dto';
import { db } from 'src/db/db';
import { serverMemberships, servers } from 'src/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class TalkiAppService {
  async createServer(createTalkiAppDto: CreateTalkiAppDto, ownerId: string) {
    try {
      const { name, description, online, badge, icon } = createTalkiAppDto;

      const response = await db.insert(servers).values({
        name,
        description,
        online,
        badge,
        ownerId,
        icon,
      });
      return response;
    } catch (error) {
      console.log(error);
      return {
        error: 'Error creating server',
      };
    }
  }

  async getServers() {
    try {
      const response = await db.select().from(servers);
      return response;
    } catch (error) {
      console.log(error);
      return {
        error: 'Error getting servers',
      };
    }
  }

  async getServersByUser(userId: string) {
    try {
      const response = await db
        .select()
        .from(servers)
        .innerJoin(
          serverMemberships,
          eq(servers.id, serverMemberships.serverId),
        )
        .where(eq(serverMemberships.userId, userId));
      return response;
    } catch (error) {
      console.log(error);
      return {
        error: 'Error getting servers',
      };
    }
  }

  async joinServer(serverId: number, userId: string) {
    try {
      const isUser = await db
        .select()
        .from(serverMemberships)
        .where(eq(serverMemberships.userId, userId));

      if (isUser.length) {
        return {
          error: 'User already joined server',
        };
      }

      const response = await db.insert(serverMemberships).values({
        serverId,
        userId,
      });
      return response;
    } catch (error) {
      console.log(error);
      return {
        error: 'Error joining server',
      };
    }
  }
}
