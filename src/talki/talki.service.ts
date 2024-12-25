import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateTalkiDto } from './dto/create-talki.dto';
// import { UpdateTalkiDto } from './dto/update-talki.dto';
import db from 'src/db/db';
import { serverTable } from 'src/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TalkiService {
  async createServer(createTalkiDto: CreateTalkiDto) {
    const { name, created_by, description, badge, icon } = createTalkiDto;

    try {
      // Verificar si el servidor existe
      const serverExist = await db
        .select()
        .from(serverTable)
        .where(eq(serverTable.name, name));

      if (serverExist.length > 0) {
        return { message: 'Server already exist', error: true };
      }

      // Crear el servidor
      await db.insert(serverTable).values({
        id: uuidv4(),
        name,
        created_by,
        description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        badge,
        icon,
      });

      return { message: 'Server created', error: false };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {
    try {
      const data = await db.select().from(serverTable);
      const servers = data.map((server) => ({
        id: server.id,
        name: server.name,
        created_by: server.created_by,
        icon: server.icon,
        description: server.description,
        created_at: server.created_at,
        updated_at: server.updated_at,
        badge: server.badge,
      }));
      return servers;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} talki`;
  // }

  // update(id: number, updateTalkiDto: UpdateTalkiDto) {
  //   return `This action updates a #${id} talki`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} talki`;
  // }
}
