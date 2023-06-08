import { IsEnum, IsMongoId, IsOptional } from 'class-validator';

import { TASK_STATE } from '../../../../utils/enum';

export class FindTaskDto {
  @IsMongoId()
  @IsOptional()
  id?: string;

  @IsEnum(TASK_STATE)
  @IsOptional()
  state?: string;
}
