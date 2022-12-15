import express from 'express';

import cookieParser from 'cookie-parser';
import cors from 'cors/lib/index.js';
import expressPinoLogger from 'express-pino-logger';

import { port } from './app/config/config.js';
import logger from './app/api/middleware/logger.js';
import sequelize from './app/config/db.config.js';
import models from './app/config/models/index.js';
import routes from './app/api/routes/index.js';

const app = express();

app.use(cookieParser());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(
  cors({
    credentials: true,
    origin: ['*'], // only allow certain IP-address
  }),
);

app.use('/', routes);

app.use(expressPinoLogger({ logger, autoLogging: false }));

sequelize
  .authenticate()
  .then(async () => {
    await models.sequelize.sync({}); // create tables after successful connection
    logger.info('Connection To Database has been established successfully.');
    if (process.send) {
      process.send('ready');
    }
  })
  .catch((error) => {
    logger.error('Unable to connect to the database:');
    logger.error(error);
  });

app.listen(port, () => logger.info(`App running on port ${port}`));
