export const getExpressMulterFileInfo = (file: Express.Multer.File) => ({
  size: file.size,
  buffer: file.buffer.toString('base64'),
  originalname: file.originalname,
  mimetype: file.mimetype,
});
