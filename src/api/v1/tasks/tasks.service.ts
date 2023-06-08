import { singleton } from 'tsyringe';

import { FindTaskDto } from './dto/find-task.dto';
import taskModel from './models/tasks.model';
import { TaskI } from './models/tasks.schema';
import { CONFIG } from '../../../config';
import { ApiError } from '../../../middlewares/apiErrors';
import { TASK_STATE } from '../../../utils/enum';
import { HTTP_ERRORS } from '../../../utils/httpErrors';
import { ImagesService } from '../images/images.service';

@singleton()
export class TasksService {
  IMAGES_PATH = CONFIG.IMAGES.PATH;

  MAX_FILE_SIZE = CONFIG.IMAGES.MAX_FILE_SIZE;

  SUPPORTED_IMAGES = CONFIG.IMAGES.SUPPORTED_FORMATS;

  constructor(private imagesService: ImagesService) {}

  async createTask(file: Express.Multer.File): Promise<TaskI> {
    const { originalImageAbsolutePath, imagesPath } =
      await this.imagesService.createOriginalImage(file);

    const newTask = await taskModel.create({
      fileName: file.originalname,
      path: imagesPath,
      imagesPath: {
        original: originalImageAbsolutePath,
      },
    });

    return newTask;
  }

  async completeTask(findTaskDto: FindTaskDto): Promise<TaskI> {
    const task = await this.getTask({ id: findTaskDto.id });

    const resizedPaths = await this.imagesService.resizeImages(task);

    const updatedTask = await taskModel.findByIdAndUpdate(
      task._id,
      {
        state: TASK_STATE.DONE,
        imagesPath: {
          original: task.imagesPath.original,
          image800: resizedPaths[0],
          images1024: resizedPaths[1],
        },
      },
      {
        new: true,
      },
    );
    if (updatedTask) return updatedTask;
    throw new ApiError(HTTP_ERRORS.NOT_FOUND, 'Task not found');
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
