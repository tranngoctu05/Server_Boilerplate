const bunyan = require('bunyan');
require('dotenv').config();
const pjs = require('../package.json');
const { name, version } = pjs;

const getLogger = (serviceName, serviceVersion, level) =>
  bunyan.createLogger({ name: `${serviceName}:${serviceVersion}`, level });

module.exports = {
  development: {
    name,
    version,
    serviceTimeout: process.env.SERVICE_TIMEOUT,
    postgres: {
      options: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_DATABASE_DEV,
        dialect: 'postgres',
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        logging: (msg) => getLogger(name, version, 'debug').info(msg),
      },
      client: null,
    },
    log: () => getLogger(name, version, 'debug'),
  },
  production: {
    name,
    version,
    serviceTimeout: process.env.SERVICE_TIMEOUT,
    postgres: {
      options: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_DATABASE_PROD,
        dialect: 'postgres',
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        logging: (msg) => getLogger(name, version, 'info').info(msg),
      },
      client: null,
    },
    log: () => getLogger(name, version, 'info'),
  },
  test: {
    name,
    version,
    serviceTimeout: process.env.SERVICE_TIMEOUT,
    postgres: {
      options: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_DATABASE_TEST,
        dialect: 'postgres',
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        logging: (msg) => getLogger(name, version, 'fatal').info(msg),
      },
      client: null,
    },
    log: () => getLogger(name, version, 'fatal'),
  },
};
