import {
  IsString,
  IsInt,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  isNumber,
} from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @IsNotEmpty()
  page: number;

  @IsNumber()
  @IsNotEmpty()
  size: number;
}
