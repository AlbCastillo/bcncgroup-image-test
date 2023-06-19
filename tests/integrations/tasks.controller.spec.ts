import 'reflect-metadata';
import { Readable } from 'stream';

import { Types } from 'mongoose';
import request = require('supertest');

import { ImagesService } from '../../src/api/v1/images/images.service';
import tasksModel from '../../src/api/v1/tasks/models/tasks.model';
import { TaskI } from '../../src/api/v1/tasks/models/tasks.schema';
import app from '../../src/app';
import { ApiError } from '../../src/middlewares/apiErrors';
import { connectMongoDBTest } from '../../src/mongoose';
import { HTTP_ERRORS } from '../../src/utils/httpErrors';

const server = app.listen('5556');

beforeAll(done => {
  connectMongoDBTest();
  done();
});

afterAll(done => {
  server.close();
  done();
});

describe('Task Controller', () => {
  const fileMock1: Express.Multer.File = {
    fieldname: 'file',
    originalname: 'test.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    size: 12345,
    buffer: Buffer.from('file contents'),
    stream: new Readable(),
    destination: '',
    filename: '',
    path: '',
  };
  afterAll(async () => await tasksModel.deleteMany({}));

  describe('POST /v1/task', () => {
    let taskTestId: string;
    let imagesServiceMock: jest.Mocked<ImagesService>;
    beforeAll(async () => {
      imagesServiceMock = {
        resizeImages: jest.fn().mockResolvedValue('Images resized successfully.'),
      } as unknown as jest.Mocked<ImagesService>;
    });
    afterAll(async () => {
      await tasksModel.deleteMany({});
      jest.restoreAllMocks();
    });
    it('It should return a new task', async () => {
      const response = await request(app)
        .post('/v1/task')
        .attach('file', fileMock1.buffer, fileMock1.originalname);

      taskTestId = response.body._id;
      expect(response.body._id).toBeDefined();
      expect(response.body.fileName).toBeDefined();
      expect(response.body.fileName).toEqual(fileMock1.originalname);
      expect(response.body.state).toEqual('PENDING');
    });

    it('/task/complete{taskId} It should return an updated task', async () => {
      jest
        .spyOn(ImagesService.prototype, 'resizeImages')
        .mockImplementation(imagesServiceMock.resizeImages);
      const response = await request(app).post(`/v1/task/complete/${taskTestId}`);
      expect(response.status).toBe(200);
      expect(response.body.state).toEqual('DONE');
    });
  });
  describe('GET /v1/task', () => {
    let task1: TaskI;
    let task2: TaskI;
    beforeAll(async () => {
      task1 = await tasksModel.create({
        fileName: 'test1.jpg',
        path: 'output/test1',
      });
      task2 = await tasksModel.create({
        fileName: 'test2.jpg',
        path: 'output/test2',
      });
    });
    afterAll(async () => await tasksModel.deleteMany({}));

    it('/tasks It should return all tasks', async () => {
      const response = await request(app).get('/v1/task/tasks');

      expect(response.body.length).toBe(2);
    });

    it('/get/{taskId} It should return a task', async () => {
      const response1 = await request(app).get(`/v1/task/get/${task1._id.toString()}`);
      const response2 = await request(app).get(`/v1/task/get/${task2._id.toString()}`);
      expect(response1.body._id).toEqual(task1._id.toString());
      expect(response2.body._id).toEqual(task2._id.toString());
    });
  });
});

describe('Task Controller when errors happen', () => {
  const randomMongoId = new Types.ObjectId().toHexString();
  let imagesServiceMock: jest.Mocked<ImagesService>;
  beforeAll(async () => {
    imagesServiceMock = {
      createOriginalImage: jest
        .fn()
        .mockRejectedValue(
          new ApiError(
            HTTP_ERRORS.INTERNAL_SERVER_ERROR,
            'Error creating original image',
          ),
        ),
      resizeImages: jest
        .fn()
        .mockRejectedValue(
          new ApiError(HTTP_ERRORS.INTERNAL_SERVER_ERROR, 'Error resizing images'),
        ),
    } as unknown as jest.Mocked<ImagesService>;
  });
  afterAll(async () => {
    await tasksModel.deleteMany();
    jest.restoreAllMocks();
  });
  describe('POST v1/task', () => {
    const fileFailMock1: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'test.pdf',
      encoding: '7bit',
      mimetype: 'image/pdf',
      size: 12345,
      buffer: Buffer.from('file contents'),
      stream: new Readable(),
      destination: '',
      filename: '',
      path: '',
    };

    const fileMock1: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'test.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 12345,
      buffer: Buffer.from('file contents'),
      stream: new Readable(),
      destination: '',
      filename: '',
      path: '',
    };
    it('It should throw an HTTP error when an error happens creating a task with an invalid format', async () => {
      const response = await request(app)
        .post('/v1/task')
        .attach('file', fileFailMock1.buffer, fileFailMock1.originalname);
      expect(response.status).toBe(HTTP_ERRORS.INTERNAL_SERVER_ERROR.statusCode);
      expect(response.body.message).toBe('Error creating task!');
    });
    it('It should throw an HTTP error when an error happens completing a task. The error occurs because the lambda function fails', async () => {
      const createTaskResponse = await request(app)
        .post('/v1/task')
        .attach('file', fileMock1.buffer, fileMock1.originalname);

      jest
        .spyOn(ImagesService.prototype, 'resizeImages')
        .mockImplementation(imagesServiceMock.resizeImages);
      const response = await request(app).post(
        `/v1/task/complete/${createTaskResponse.body._id}`,
      );
      expect(response.status).toBe(HTTP_ERRORS.INTERNAL_SERVER_ERROR.statusCode);
      expect(response.body.message).toBe('Error resizing images');
    });
    it('It should throw an HTTP error when an error happens completing a task. The error is thrown by Mongoose', async () => {
      jest
        .spyOn(ImagesService.prototype, 'resizeImages')
        .mockImplementation(
          jest.fn().mockResolvedValueOnce('Images resized successfully.'),
        );

      const response = await request(app).post(`/v1/task/complete/${randomMongoId}`);
      expect(response.status).toBe(HTTP_ERRORS.NOT_FOUND.statusCode);
      expect(response.body.message).toEqual(
        'The requested resource could not be found but may be available in the future.',
      );
    });
  });

  describe('GET v1/task', () => {
    it('/get/{taskId} It should throw an HTTP error when a task is not found', async () => {
      const response = await request(app).get(`/v1/task/get/${randomMongoId}`);
      expect(response.status).toBe(HTTP_ERRORS.NOT_FOUND.statusCode);
      expect(response.body.message).toEqual(
        'The requested resource could not be found but may be available in the future.',
      );
    });
  });
});
