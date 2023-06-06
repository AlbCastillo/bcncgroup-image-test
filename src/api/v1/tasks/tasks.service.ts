import { singleton } from 'tsyringe';

import { FindTaskDto } from './dto/find-task.dto';
import taskModel from './models/tasks.model';
import { TaskI } from './models/tasks.schema';
import { CONFIG } from '../../../config';
import { ApiError } from '../../../middlewares/apiErrors';
import { getExpressMulterFileInfo } from '../../../utils/file';

@singleton()
export class TasksService {
  async createTask(file: Express.Multer.File): Promise<TaskI> {
    const fileInfo = getExpressMulterFileInfo(file);
    const newTask = await taskModel.create({
      fileName: fileInfo.originalname,
      path: `${CONFIG.IMAGES.PATH}/${fileInfo.originalname}`,
    });

    // TODO: ADD LAMBDA FUNCTION
    return newTask;
  }

  async getAllTasks(): Promise<TaskI[]> {
    return await taskModel.find();
  }

  async getTask(findTaskDto: FindTaskDto): Promise<TaskI> {
    const task = await taskModel.findById(findTaskDto.id);
    if (task) return task;
    throw new ApiError({
      name: 'NotFound',
      statusCode: 404,
      message: 'Resource not found',
    });
  }
}
