import dotenv from 'dotenv';

dotenv.config({ silent: process.env.NODE_ENV === 'production' });

export const databasePort = process.env.DB_PORT.toString();
export const databaseHost = process.env.DB_HOST.toString();
export const databaseUserName = process.env.DB_USER.toString();
export const databasePassword = process.env.DB_PASSWORD.toString();
export const databaseDialect = process.env.DB_DIALECT.toString();
export const databaseName = process.env.DB_DATABASE.toString();
export const port = process.env.PORT;
export const salt = process.env.SALT ?? 10;
