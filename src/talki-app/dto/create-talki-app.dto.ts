import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTalkiAppDto {
  @IsString()
  name: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsNumber()
  @IsOptional()
  online?: number;
  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  icon: string;

  @IsString()
  badge: string;
}
