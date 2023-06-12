import { Readable } from 'stream';

import request = require('supertest');

import tasksModel from '../../src/api/v1/tasks/models/tasks.model';
import { TaskI } from '../../src/api/v1/tasks/models/tasks.schema';
import app from '../../src/app';
import { connectMongoDBTest } from '../../src/mongoose';

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

  describe('POST /v1/task/get/{taskId}', () => {
    afterAll(async () => await tasksModel.deleteMany({}));
    it('It should return a new task', async () => {
      const response = await request(app)
        .post('/v1/task')
        .attach('file', fileMock1.buffer, 'test.jpg');
      expect(response.body._id).toBeDefined();
      expect(response.body.fileName).toBeDefined();
      expect(response.body.fileName).toEqual(fileMock1.originalname);
      expect(response.body.state).toEqual('PENDING');
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

    it('/tasks/{taskId} It should return a task', async () => {
      const response1 = await request(app).get(`/v1/task/get/${task1._id.toString()}`);
      const response2 = await request(app).get(`/v1/task/get/${task2._id.toString()}`);
      expect(response1.body._id).toEqual(task1._id.toString());
      expect(response2.body._id).toEqual(task2._id.toString());
    });
  });
});
