import { Controller, Get, Post, Body } from '@nestjs/common';
import { TalkiService } from './talki.service';
import { CreateTalkiDto } from './dto/create-talki.dto';
// import { UpdateTalkiDto } from './dto/update-talki.dto';

@Controller('talki')
export class TalkiController {
  constructor(private readonly talkiService: TalkiService) {}

  @Post('create-server')
  create(@Body() createTalkiDto: CreateTalkiDto) {
    return this.talkiService.createServer(createTalkiDto);
  }

  @Get('servers')
  findAll() {
    return this.talkiService.findAll();
  }

  @Get('ping')
  ping() {
    return 'pong';
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.talkiService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTalkiDto: UpdateTalkiDto) {
  //   return this.talkiService.update(+id, updateTalkiDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.talkiService.remove(+id);
  // }
}
