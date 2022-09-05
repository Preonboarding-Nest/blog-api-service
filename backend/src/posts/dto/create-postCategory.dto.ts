import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreatePostCategoryDto {
  @ApiProperty({ description: '게시글 종류' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  type: string;
}
