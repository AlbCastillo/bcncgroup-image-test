import { model } from 'mongoose';

import { TaskI, TaskSchema } from './tasks.schema';

export default model<TaskI>('Task', TaskSchema);
