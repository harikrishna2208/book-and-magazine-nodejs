/* eslint-disable object-curly-newline */
import { Sequelize } from 'sequelize';

import {
  databaseDialect,
  databaseName,
  databasePassword,
  databaseHost,
  databasePort,
  databaseUserName,
} from './config.js';

const sequelize = new Sequelize(databaseName, databaseUserName, databasePassword, {
  host: databaseHost, // server name
  port: databasePort,
  dialect: databaseDialect,
  logging: false, // (msg) => logger.debug(msg),
  timezone: '+05:30',
  schema: 'bookAndMagazine',
  define: {
    freezeTableName: true,
  },
});

export default sequelize;
