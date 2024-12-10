import { PartialType } from '@nestjs/mapped-types';
import { CreateTalkiAppDto } from './create-talki-app.dto';

export class UpdateTalkiAppDto extends PartialType(CreateTalkiAppDto) {}
