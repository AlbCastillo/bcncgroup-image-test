import * as crypto from 'crypto';
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

interface SaveImageInput {
  buffer: Buffer;
  name: string;
}

/**
 * It removes the file extension from a given filename string.
 * @param {string} filename - The parameter `filename` is a string that represents the name of a file, including its extension.
 * @returns The function `removeExtension` takes a `filename` string as input and returns a new string with the extension removed. If the input
 * `filename` has an extension, the function returns the substring of the `filename` up to the last occurrence of the dot character. If the
 * `filename` does not have an extension, the function returns the original `filename`.
 */
export function removeExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex !== -1) {
    return filename.substring(0, lastDotIndex);
  }
  return filename;
}

/**
 * It returns the extension of a file given its filename.
 * @param {string} filename - The `filename` parameter is a string that represents the name of a file, including its extension.
 * @returns The function `getExtension` returns the file extension of the input `filename` as a string. It does this by finding the last
 * occurrence of the dot character in the filename and returning the substring that follows it.
 */
const getExtension = (filename: string): string => {
  const lastDotIndex = filename.lastIndexOf('.');
  return filename.substring(lastDotIndex + 1);
};

/**
 * It takes a SaveImageInput object and returns an MD5 hash of its buffer property concatenated with its file extension.
 * @param {SaveImageInput} saveImageInput - `saveImageInput` is an object of type `SaveImageInput` which contains the following properties:
 */
const bufferToMd5 = (saveImageInput: SaveImageInput): string =>
  `${crypto.createHash('md5').update(saveImageInput.buffer).digest('hex')}.${getExtension(
    saveImageInput.name,
  )}`;

/**
 * Ittakes in a file object from the Express Multer library and returns an object with information about the file, including its
 * size, base64-encoded buffer, name, original name, mimetype, and buffer.
 * @param file - The `file` parameter is an object of type `Express.Multer.File`, which is a file object that is created by the Multer
 * middleware when a file is uploaded to a server. It contains information about the uploaded file, such as its size, name, original name,
 * mimetype, and
 */
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

/**
 * It creates a directory if it does not already exist.
 * @param {string} directoryPath - The directory path is a string parameter that represents the path of the directory that needs to be created
 * if it does not already exist.
 */
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
 * It converts a base64 file to a SaveImageInput object with a buffer and name property.
 * @param {string} base64File - A string representing a file encoded in base64 format.
 * @param {string} name - The name parameter is a string that represents the name of the image file that will be saved.
 * @returns a `SaveImageInput` object with two properties: `buffer` and `name`. The `buffer` property is a `Buffer` object created from the
 * `base64File` string input using the `Buffer.from()` method with the `'base64'` encoding. The `name` property is a string input passed as an
 * argument to the function.
 */
export function base64ToSaveImageInput(base64File: string, name: string): SaveImageInput {
  return {
    buffer: Buffer.from(base64File, 'base64'),
    name: name,
  };
}

/**
 * It saves an image to a specified destination path.
 * @param {ExpressMulterFileInfo} fileInfo - The file to save information about.
 * @param {string} imagePathDst - The path to save the image to.
 * @return {Promise<void>} A Promise that resolves when the image is saved successfully.
 */
export async function saveImage(
  fileInfo: SaveImageInput,
  imagePathDst: string,
): Promise<string> {
  try {
    const outputDirectory = resolve(join(__dirname, '..', '..', `${imagePathDst}`));
    const imagePath = join(outputDirectory, bufferToMd5(fileInfo));
    await createDirectoryIfNotExists(dirname(imagePath));
    await fsPromises.writeFile(imagePath, fileInfo.buffer);
    return imagePath;
  } catch (err) {
    throw new Error('Error saving image');
  }
}

/**
 *  It converts an image file to a base64 encoded string.
 * @param {string} imagePath - The `imagePath` parameter is a string that represents the file path of the image that needs to be converted to
 * base64 format.
 * @returns The function `imageToBase64` returns a Promise that resolves to a string representing the base64 encoding of the image file located
 * at the `imagePath` provided as an argument to the function.
 */
export async function imageToBase64(imagePath: string): Promise<string> {
  const buffer = await fsPromises.readFile(imagePath);
  return buffer.toString('base64');
}
