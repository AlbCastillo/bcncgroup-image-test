import { IsMongoId, IsString, IsOptional } from 'class-validator';

export class FindImageDto {
  @IsMongoId()
  @IsOptional()
  taskId?: string;

  @IsString()
  @IsOptional()
  width?: string;

  @IsMongoId()
  @IsOptional()
  id?: string;
}
