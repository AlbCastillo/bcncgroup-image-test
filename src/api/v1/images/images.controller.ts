import fs from 'fs';
import path from 'path';

import { Controller, Get, Path, Route, SuccessResponse, Tags } from 'tsoa';
import { injectable } from 'tsyringe';

import { ImagesService } from './images.service';

@injectable()
@Tags('Images')
@Route('v1/image')
export class ImagesController extends Controller {
  constructor(private imagesService: ImagesService) {
    super();
  }

  @Get('/download/{taskId}/{width}')
  @SuccessResponse('200', 'OK')
  async donwloadImage(@Path() taskId: string, @Path() width: string): Promise<any> {
    this.setStatus(200);
    const image = await this.imagesService.downloadImage({ taskId, width });
    const filePath = path.join(image.imagePath);
    this.setHeader('Content-Type', image.contentType);
    this.setHeader('Content-Disposition', `attachment; filename=${image.filename}`);
    return fs.createReadStream(filePath);
  }
}
