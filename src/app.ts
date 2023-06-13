import 'reflect-metadata';
import cors from 'cors';
import express, {
  Application,
  Response,
  Request,
  NextFunction,
  urlencoded,
  json,
} from 'express';
import helmet from 'helmet';
import * as swaggerUi from 'swagger-ui-express';

import logger from './logging/winstonLogger';
import { errorAPIHandler } from './middlewares/apiErrors';
import morganMiddlewareLogger from './middlewares/morganLogger';
import swaggerJSON from './swagger.json';
import { RegisterRoutes } from './tsoa_generated/routes';

const app: Application = express();

app.use(
  urlencoded({
    extended: true,
  }),
);

app.use(json());

app.get('/', (req, res) => {
  logger.info(`GETTING HELLO WORLD`);
  res.status(200).json({ message: 'Hello World!!' });
});

/**
 * REGISTER ROUTES FROM TSOA
 */

RegisterRoutes(app);

/**
 * MIDDLEWARES
 */
// CORS
app.use(cors());

// API ERROR HANDLER
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorAPIHandler(err, req, res, next);
});

// MORGAN LOGGER
app.use(morganMiddlewareLogger);

// HELMET
app.use(helmet());

// SWAGGER DOCUMENTATION
app.use('/docs', swaggerUi.serve, async (_req: Request, res: Response) => {
  return res.send(swaggerUi.generateHTML(await import('./swagger.json')));
});
swaggerUi.setup(swaggerJSON);

// export default server;
export default app;
