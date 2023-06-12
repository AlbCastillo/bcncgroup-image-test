import axios from 'axios';
import { singleton } from 'tsyringe';

import { FindImageDto } from './dto/find-image.dto';
import imageModel from './models/image.model';
import { ImageI } from './models/image.schema';
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

  /**
   * It resizes images by sending them to a Lambda function and saving the resized versions to the database.
   * @param {TaskI} task - The `task` parameter is an object of type `TaskI` which contains information about the task that needs to be
   * performed, such as the task ID, file name, and path.
   * @returns a Promise that resolves to an array of undefined values.
   */
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

  /**
   * It creates an original image by validating its format, saving it to a specified path, and creating a corresponding entry in the
   * image model.
   * @param {ExpressMulterFileInfo} file - An object containing information about the uploaded file, including its original name, buffer, and
   * mimetype.
   * @param {string} imagesPath - The path where the images will be saved.
   * @param {string} taskId - The `taskId` parameter is a string that represents the ID of a task associated with the image being created.
   * @returns An object containing the absolute path of the saved original image and the imagesPath parameter passed to the function.
   */
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

  /**
   * It downloads an image based on a search query and returns it, or throws an error if the image is not found or if
   * there is an internal server error.
   * @param {FindImageDto} downloadImageDto - FindImageDto is a data transfer object that contains information needed to find and download an
   * image. It likely includes fields such as the image ID or URL, and possibly additional search criteria.
   * @returns a Promise that resolves to an object of type ImageI.
   */
  async downloadImage(downloadImageDto: FindImageDto): Promise<ImageI> {
    try {
      const search = this.whereFieldGenerator(downloadImageDto);
      const image = await imageModel.findOne(search);

      if (!image) throw new ApiError(HTTP_ERRORS.NOT_FOUND, 'Image not found');

      return image;
    } catch (error) {
      throw new ApiError(HTTP_ERRORS.INTERNAL_SERVER_ERROR, 'Error downloading image');
    }
  }

  /**
   * It retrieves all images from a database and returns them as an array of ImageI objects, or throws an error if there is a problem.
   * @returns The `getAllImages` function is returning a Promise that resolves to an array of `ImageI` objects. The function uses `await` to wait
   * for the result of the `imageModel.find()` method, which is a database query to retrieve all images. If there is an error, the function
   * throws an `ApiError` with a 500 status code and a message indicating that there was an
   */
  async getAllImages(): Promise<ImageI[]> {
    try {
      return await imageModel.find();
    } catch (error) {
      throw new ApiError(HTTP_ERRORS.INTERNAL_SERVER_ERROR, 'Error getting images');
    }
  }

  /**
   * It validates if the image format is supported and if the image size is within the maximum limit.
   * @param {ExpressMulterFileInfo} file - ExpressMulterFileInfo is an interface provided by the multer library in Express.js. It represents
   * information about a file that has been uploaded through a form. The file parameter in the validateImageFormat function is an object of type
   * ExpressMulterFileInfo that contains information about the uploaded image file, such as its
   */
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

  /**
   *  It generates a search query object based on the properties of a FindImageDto object.
   * @param {FindImageDto} search - `search` is an object of type `FindImageDto` which contains properties that are used to generate a `where`
   * clause for a database query. The `where` clause is used to filter the results of the query based on the values of the properties in the
   * `search` object. The
   * @returns The function `whereFieldGenerator` returns an object that contains properties based on the values of the `search` parameter. The
   * properties included in the returned object are `task`, `width`, and `_id`, depending on whether the corresponding properties in the `search`
   * object are truthy.
   */
  private whereFieldGenerator(search: FindImageDto) {
    let result: any = {};
    if (search) {
      if (search.taskId) result = { ...result, task: search.taskId };
      if (search.width) result = { ...result, width: search.width };
      if (search.id) result = { ...result, _id: search.id };
    }
    return result;
  }
}
