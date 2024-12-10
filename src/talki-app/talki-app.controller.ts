import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { TalkiAppService } from './talki-app.service';
import { CreateTalkiAppDto } from './dto/create-talki-app.dto';

@Controller('talki-app')
export class TalkiAppController {
  constructor(private readonly talkiAppService: TalkiAppService) {}

  @Post('create/:ownerId')
  create(
    @Body() createTalkiAppDto: CreateTalkiAppDto,
    @Param('ownerId') ownerId: string,
  ) {
    return this.talkiAppService.createServer(createTalkiAppDto, ownerId);
  }

  @Get('servers')
  getServers() {
    return this.talkiAppService.getServers();
  }

  @Post('join/:serverId/:userId')
  join(@Param('serverId') serverId: number, @Param('userId') userId: string) {
    return this.talkiAppService.joinServer(serverId, userId);
  }

  @Get('servers/:userId')
  getServersByUser(@Param('userId') userId: string) {
    return this.talkiAppService.getServersByUser(userId);
  }
}
