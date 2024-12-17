import { Injectable } from '@nestjs/common';
import { CreateTalkiDto } from './dto/create-talki.dto';
import { UpdateTalkiDto } from './dto/update-talki.dto';

@Injectable()
export class TalkiService {
  create(createTalkiDto: CreateTalkiDto) {
    return 'This action adds a new talki';
  }

  findAll() {
    return `This action returns all talki`;
  }

  findOne(id: number) {
    return `This action returns a #${id} talki`;
  }

  update(id: number, updateTalkiDto: UpdateTalkiDto) {
    return `This action updates a #${id} talki`;
  }

  remove(id: number) {
    return `This action removes a #${id} talki`;
  }
}
