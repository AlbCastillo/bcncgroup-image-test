import axios from 'axios';
import { singleton } from 'tsyringe';

import { CONFIG } from '../../../config';
import { ApiError } from '../../../middlewares/apiErrors';
import {
  base64ToSaveImageInput,
  getExpressMulterFileInfo,
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

  // 	{
  //   "state": "PENDING",
  //   "fileName": "CandongoQR-EntityDiagram.drawio.png",
  //   "path": "output/CandongoQR-EntityDiagram.drawio",
  //   "imagesPath": {
  //     "original": "/home/albcastillo/PROJECTS/PERSONAL/Prueba/bcncgroup-image-test/output/CandongoQR-EntityDiagram.drawio/original/2771302ffd45b72cd884838bbddd62cc.png"
  //   },
  //   "_id": "648206043fec42f58749fcdb",
  //   "createdAt": "2023-06-08T16:47:00.286Z",
  //   "updatedAt": "2023-06-08T16:47:00.286Z",
  //   "__v": 0
  // }
  async resizeImages(task: TaskI): Promise<any> {
    try {
      const resizeImages = await axios.post(this.RESIZE_LAMBDA_URL, {
        imageBase64: await imageToBase64(task.imagesPath.original),
        widths: this.IMAGE_WIDTHS,
      });

      const response = resizeImages.data;

      const result = await Promise.all(
        this.IMAGE_WIDTHS.map(async width => {
          const resizedImage64 = response[width.toString()];
          return await saveImage(
            base64ToSaveImageInput(resizedImage64, task.fileName),
            `${task.path}/${width}`,
          );
        }),
      );
      return result;
    } catch (error) {
      throw new ApiError(HTTP_ERRORS.INTERNAL_SERVER_ERROR, 'Error resizing images');
    }
  }

  async createOriginalImage(file: Express.Multer.File): Promise<any> {
    try {
      this.validateImageFormat(file);

      const fileInfo = getExpressMulterFileInfo(file);

      const imagesPath = `${CONFIG.IMAGES.PATH}/${fileInfo.name}`;

      const originalImageAbsolutePath = await saveImage(
        { name: fileInfo.originalname, buffer: fileInfo.buffer },
        `${imagesPath}/original`,
      );

      return { originalImageAbsolutePath, imagesPath };
    } catch (error) {
      throw new ApiError(
        HTTP_ERRORS.INTERNAL_SERVER_ERROR,
        'Error creating original image',
      );
    }
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
