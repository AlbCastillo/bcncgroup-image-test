import { singleton } from 'tsyringe';

import { FindTaskDto } from './dto/find-task.dto';
import taskModel from './models/tasks.model';
import { TaskI } from './models/tasks.schema';
import { CONFIG } from '../../../config';
import { ApiError } from '../../../middlewares/apiErrors';
import { getExpressMulterFileInfo, saveImage } from '../../../utils/file';
import { HTTP_ERRORS } from '../../../utils/httpErrors';

@singleton()
export class TasksService {
  IMAGES_PATH = CONFIG.IMAGES.PATH;

  MAX_FILE_SIZE = CONFIG.IMAGES.MAX_FILE_SIZE;

  SUPPORTED_IMAGES = CONFIG.IMAGES.SUPPORTED_FORMATS;

  async createTask(file: Express.Multer.File): Promise<TaskI> {
    this.validateImageFormat(file);
    const fileInfo = getExpressMulterFileInfo(file);
    const originalImagePath = `${CONFIG.IMAGES.PATH}/${fileInfo.name}/original`;
    const newTask = await taskModel.create({
      fileName: fileInfo.originalname,
      path: originalImagePath,
    });
    await saveImage(fileInfo, originalImagePath);
    // TODO: ADD LAMBDA FUNCTION
    return newTask;
  }

  async getAllTasks(): Promise<TaskI[]> {
    return await taskModel.find();
  }

  async getTask(findTaskDto: FindTaskDto): Promise<TaskI> {
    const task = await taskModel.findById(findTaskDto.id);
    if (task) return task;
    throw new ApiError(HTTP_ERRORS.NOT_FOUND);
  }

  private validateImageFormat(file: Express.Multer.File) {
    if (
      file.size > this.MAX_FILE_SIZE ||
      !this.SUPPORTED_IMAGES.includes(file.mimetype)
    ) {
      throw new ApiError(
        HTTP_ERRORS.BAD_REQUEST,
        'Invalid image format or the image is too huge',
      );
    }
  }
}
