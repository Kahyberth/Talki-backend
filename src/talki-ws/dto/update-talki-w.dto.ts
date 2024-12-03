import { PartialType } from '@nestjs/mapped-types';
import { CreateTalkiWDto } from './create-talki-w.dto';

export class UpdateTalkiWDto extends PartialType(CreateTalkiWDto) {
  id: number;
}
