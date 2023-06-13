import { Schema, Document } from 'mongoose';

import { TaskI } from '../../tasks/models/tasks.schema';

export interface ImageI extends Document {
  task: TaskI;
  filename: string;
  imagePath: string;
  width: string;
  contentType: string;
}

export const ImageSchema = new Schema<ImageI>(
  {
    task: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
    },
    filename: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    },
    imagePath: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
