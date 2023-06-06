import app from './app';
import { CONFIG } from './config';
import logger from './logging/winstonLogger';
import { connectMongoDB } from './mongoose';

const port = CONFIG.API.PORT;

/**
 * CONNECT DATABASE
 */
connectMongoDB();

/**
 * SERVER RUNNING ON
 */
const server = app.listen(port, () => {
  logger.debug(`APP LISTENING AT http://localhost:${port}`);
});

export default server;
