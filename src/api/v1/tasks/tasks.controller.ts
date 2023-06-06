import { Route, Controller, Get, Path, Post, SuccessResponse, UploadedFile } from 'tsoa';
import { injectable } from 'tsyringe';

import { TaskI } from './models/tasks.schema';
import { TasksService } from './tasks.service';
import logger from '../../../logging/winstonLogger';

@injectable()
@Route('v1/task')
export class TasksController extends Controller {
  constructor(private tasksService: TasksService) {
    super();
  }

  @Get('/{taskId}')
  @SuccessResponse('200', 'OK')
  async getTask(@Path() taskId: string): Promise<TaskI> {
    this.setStatus(200);
    return this.tasksService.getTask({ id: taskId });
  }

  @Get('/all')
  @SuccessResponse('200', 'OK')
  async getAllTask(): Promise<TaskI[]> {
    this.setStatus(200);
    return this.tasksService.getAllTasks();
  }

  @Post()
  @SuccessResponse('200', 'OK')
  async createTask(@UploadedFile() file: Express.Multer.File): Promise<TaskI> {
    this.setStatus(200);
    logger.info('ENTRO CONTROLLER');
    return this.tasksService.createTask(file);
  }
}
