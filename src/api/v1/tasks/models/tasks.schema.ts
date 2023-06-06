import { Schema, Document } from 'mongoose';

import { TASK_STATE } from '../../../../utils/enum';

// MONGOOSE TASK INTERFACE
export interface TaskI extends Document {
  state: TASK_STATE;
  fileName: string;
  path: string;
}

// MONGOOSE TASK SCHEMA
export const TaskSchema: Schema<TaskI> = new Schema(
  {
    state: {
      type: String,
      required: true,
      default: TASK_STATE.PENDING,
    },
    fileName: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
