import { singleton } from 'tsyringe';

import { FindTaskDto } from './dto/find-task.dto';
import taskModel from './models/tasks.model';
import { TaskI } from './models/tasks.schema';
import { CONFIG } from '../../../config';
import { ApiError } from '../../../middlewares/apiErrors';
import { TASK_STATE } from '../../../utils/enum';
import { getExpressMulterFileInfo } from '../../../utils/file';
import { HTTP_ERRORS } from '../../../utils/httpErrors';
import { ImagesService } from '../images/images.service';

@singleton()
export class TasksService {
  IMAGES_PATH = CONFIG.IMAGES.PATH;

  MAX_FILE_SIZE = CONFIG.IMAGES.MAX_FILE_SIZE;

  SUPPORTED_IMAGES = CONFIG.IMAGES.SUPPORTED_FORMATS;

  constructor(private imagesService: ImagesService) {}

  async createTask(file: Express.Multer.File): Promise<TaskI> {
    try {
      const fileInfo = getExpressMulterFileInfo(file);
      const imagesPath = `${CONFIG.IMAGES.PATH}/${fileInfo.name}`;

      const newTask = await taskModel.create({
        fileName: file.originalname,
        path: imagesPath,
      });

      await this.imagesService.createOriginalImage(fileInfo, imagesPath, newTask._id);

      return newTask;
    } catch (error) {
      throw new ApiError(HTTP_ERRORS.INTERNAL_SERVER_ERROR, 'Error creating task!');
    }
  }

  async completeTask(findTaskDto: FindTaskDto): Promise<TaskI> {
    const task = await this.getTask({ id: findTaskDto.id });

    const imageMessage = await this.imagesService.resizeImages(task);

    if (imageMessage) {
      const updatedTask = await taskModel.findByIdAndUpdate(
        task._id,
        {
          state: TASK_STATE.DONE,
          updatedAt: new Date(),
        },
        {
          new: true,
        },
      );
      if (updatedTask) return updatedTask;
      throw new ApiError(HTTP_ERRORS.INTERNAL_SERVER_ERROR, 'Error completing task!');
    }
    throw new ApiError(HTTP_ERRORS.NOT_FOUND, 'Image not found');
  }

  async getTasks(findTaskDto: FindTaskDto | {}): Promise<TaskI[]> {
    const search = this.whereFieldGenerator(findTaskDto);
    return await taskModel.find(search).exec();
  }

  async getTask(findTaskDto: FindTaskDto): Promise<TaskI> {
    const task = await taskModel.findById(findTaskDto.id);
    if (task) return task;
    throw new ApiError(HTTP_ERRORS.NOT_FOUND);
  }

  private whereFieldGenerator(search: FindTaskDto) {
    let result: any = {};
    if (search) {
      if (search.state) result = { ...result, state: search.state };
    }
    return result;
  }
}
