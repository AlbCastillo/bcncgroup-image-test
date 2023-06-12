import axios from 'axios';
import { singleton } from 'tsyringe';

import imageModel from './models/image.model';
import { CONFIG } from '../../../config';
import { ApiError } from '../../../middlewares/apiErrors';
import {
  ExpressMulterFileInfo,
  base64ToSaveImageInput,
  imageToBase64,
  saveImage,
} from '../../../utils/file';
import { HTTP_ERRORS } from '../../../utils/httpErrors';
import { TaskI } from '../tasks/models/tasks.schema';

@singleton()
export class ImagesService {
  IMAGES_PATH = CONFIG.IMAGES.PATH;

  IMAGE_WIDTHS = CONFIG.IMAGES.WIDTHS;

  MAX_FILE_SIZE = CONFIG.IMAGES.MAX_FILE_SIZE;

  SUPPORTED_IMAGES = CONFIG.IMAGES.SUPPORTED_FORMATS;

  RESIZE_LAMBDA_URL = CONFIG.AWS.RESIZE_LAMBDA;

  async resizeImages(task: TaskI): Promise<any> {
    try {
      const imageOriginal = await imageModel.findOne({
        task: task._id,
        width: 'original',
      });

      if (imageOriginal) {
        const resizeImages = await axios.post(this.RESIZE_LAMBDA_URL, {
          imageBase64: await imageToBase64(imageOriginal.imagePath),
          widths: this.IMAGE_WIDTHS,
        });

        const response = resizeImages.data;

        const result = await Promise.all(
          this.IMAGE_WIDTHS.map(async width => {
            const resizedImage64 = response[width.toString()];
            const resizedImagePath = await saveImage(
              base64ToSaveImageInput(resizedImage64, task.fileName),
              `${task.path}/${width}`,
            );
            await imageModel.create({
              task: task._id,
              filename: imageOriginal.filename,
              contentType: imageOriginal.contentType,
              imagePath: resizedImagePath,
              width: width.toString(),
            });
            return;
          }),
        );
        return result;
      }
    } catch (error) {
      throw new ApiError(HTTP_ERRORS.INTERNAL_SERVER_ERROR, 'Error resizing images');
    }
  }

  async createOriginalImage(
    file: ExpressMulterFileInfo,
    imagesPath: string,
    taskId: string,
  ): Promise<any> {
    try {
      this.validateImageFormat(file);

      const originalImageAbsolutePath = await saveImage(
        { name: file.originalname, buffer: file.buffer },
        `${imagesPath}/original`,
      );

      await imageModel.create({
        task: taskId,
        filename: file.originalname,
        contentType: file.mimetype,
        imagePath: originalImageAbsolutePath,
        width: 'original',
      });

      return { originalImageAbsolutePath, imagesPath };
    } catch (error) {
      throw new ApiError(
        HTTP_ERRORS.INTERNAL_SERVER_ERROR,
        'Error creating original image',
      );
    }
  }

  async downloadImage(downloadImageDto: any): Promise<any> {
    try {
      const image = await imageModel.findOne({
        task: downloadImageDto.taskId,
        width: downloadImageDto.width,
      });
      return image;
    } catch (error) {
      throw new ApiError(HTTP_ERRORS.INTERNAL_SERVER_ERROR, 'Error downloading image');
    }
  }
  private validateImageFormat(file: ExpressMulterFileInfo) {
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
