import { Injectable } from '@nestjs/common';
import { CreateTalkiWDto } from './dto/create-talki-w.dto';
import { UpdateTalkiWDto } from './dto/update-talki-w.dto';

@Injectable()
export class TalkiWsService {
  create(createTalkiWDto: CreateTalkiWDto) {
    return 'This action adds a new talkiW';
  }

  findAll() {
    return `This action returns all talkiWs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} talkiW`;
  }

  update(id: number, updateTalkiWDto: UpdateTalkiWDto) {
    return `This action updates a #${id} talkiW`;
  }

  remove(id: number) {
    return `This action removes a #${id} talkiW`;
  }
}
