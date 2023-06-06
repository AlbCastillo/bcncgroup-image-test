import { IsMongoId } from 'class-validator';

export class FindTaskDto {
  @IsMongoId()
  id: string;
}
