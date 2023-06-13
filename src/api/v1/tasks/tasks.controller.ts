import {
  Route,
  Controller,
  Get,
  Path,
  Post,
  SuccessResponse,
  UploadedFile,
  Query,
} from 'tsoa';
import { injectable } from 'tsyringe';

import { TaskI } from './models/tasks.schema';
import { TasksService } from './tasks.service';

@injectable()
@Route('v1/task')
export class TasksController extends Controller {
  constructor(private tasksService: TasksService) {
    super();
  }

  @Get('/get/{taskId}')
  @SuccessResponse('200', 'OK')
  async getTask(@Path() taskId: string): Promise<TaskI> {
    this.setStatus(200);
    return this.tasksService.getTask({ id: taskId });
  }

  @Get('/tasks')
  @SuccessResponse('200', 'OK')
  async getTasks(@Query() state?: string): Promise<TaskI[]> {
    this.setStatus(200);
    const findTasksDto = state ? { state } : {};
    return this.tasksService.getTasks(findTasksDto);
  }

  @Post()
  @SuccessResponse('200', 'OK')
  async createTask(@UploadedFile() file: Express.Multer.File): Promise<TaskI> {
    this.setStatus(200);
    return this.tasksService.createTask(file);
  }

  @Post('/complete/{taskId}')
  @SuccessResponse('200', 'OK')
  async completeTask(@Path() taskId: string): Promise<TaskI> {
    this.setStatus(200);
    return this.tasksService.completeTask({ id: taskId });
  }
}
