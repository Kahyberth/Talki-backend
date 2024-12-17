import { PartialType } from '@nestjs/mapped-types';
import { CreateTalkiDto } from './create-talki.dto';

export class UpdateTalkiDto extends PartialType(CreateTalkiDto) {}
