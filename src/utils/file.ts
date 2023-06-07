import { promises as fsPromises } from 'fs';
import { dirname, join, resolve } from 'path';

interface ExpressMulterFileInfo {
  size: number;
  buffer64: string;
  name: string;
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}

export function removeExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex !== -1) {
    return filename.substring(0, lastDotIndex);
  }
  return filename;
}

export const getExpressMulterFileInfo = (
  file: Express.Multer.File,
): ExpressMulterFileInfo => ({
  size: file.size,
  buffer64: file.buffer.toString('base64'),
  name: removeExtension(file.originalname),
  originalname: file.originalname,
  mimetype: file.mimetype,
  buffer: file.buffer,
});

async function createDirectoryIfNotExists(directoryPath: string): Promise<void> {
  try {
    await fsPromises.access(directoryPath);
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      await fsPromises.mkdir(directoryPath, { recursive: true });
    } else if (err.code !== 'EEXIST') {
      throw new Error('Error creating directory');
    }
  }
}

/**
 * Saves an image to a specified destination path.
 *
 * @param {ExpressMulterFileInfo} fileInfo - The file to save information about.
 * @param {string} imagePathDst - The path to save the image to.
 * @return {Promise<void>} A Promise that resolves when the image is saved successfully.
 */
export async function saveImage(
  fileInfo: ExpressMulterFileInfo,
  imagePathDst: string,
): Promise<void> {
  try {
    const outputDirectory = resolve(join(__dirname, '..', '..', imagePathDst));
    const imagePath = join(outputDirectory, fileInfo.originalname);
    await createDirectoryIfNotExists(dirname(imagePath));
    await fsPromises.writeFile(imagePath, fileInfo.buffer);
  } catch (err) {
    throw new Error('Error saving image');
  }
}
