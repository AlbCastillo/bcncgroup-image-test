import * as mongoose from 'mongoose';

import { CONFIG } from './config';
import logger from './logging/winstonLogger';

/**
 * This function connects to a MongoDB database using a URI and returns the connection object.
 * @returns {Promise<mongoose.Connection>} The `connectMongoDB` function returns a Promise that resolves to a `mongoose.Connection`
 * object.
 */
export async function connectMongoDB(): Promise<mongoose.Connection> {
  try {
    // Connect to the MongoDB database using the URI from the configuration
    await mongoose
      .connect(`${CONFIG.MONGO.URI}`)
      // Log a message when the connection is successful
      .then(() => logger.info(`MongoDB connected`));
    return mongoose.connection;
  } catch (error: any) {
    // Log an error message if the connection fails
    logger.error(`MongoDB Connection error ${error.message}`);
    throw new Error(error);
  }
}

/**
 * This function connects to a TEST MONGO database  using a URI and returns the connection object.
 * @returns {Promise<mongoose.Connection>} The `connectMongoDB` function returns a Promise that resolves to a `mongoose.Connection`
 * object.
 */
export async function connectMongoDBTest(): Promise<mongoose.Connection> {
  try {
    // Connect to the MongoDB database using the URI from the configuration
    await mongoose
      .connect(`${CONFIG.MONGO.URI_TEST}`)
      // Log a message when the connection is successful
      .then(() => logger.info(`MongoDB Test connected`));
    return mongoose.connection;
  } catch (error: any) {
    // Log an error message if the connection fails
    logger.error(`MongoDB Connection error ${error.message}`);
    throw new Error(error);
  }
}
