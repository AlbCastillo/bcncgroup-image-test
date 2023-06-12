import { model } from 'mongoose';

import { ImageI, ImageSchema } from './image.schema';

export default model<ImageI>('Image', ImageSchema);
