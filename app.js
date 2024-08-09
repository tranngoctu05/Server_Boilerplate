const express = require('express');

const app = express();
const helmet = require('helmet');
const routes = require('./routes');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const TodoService = require('./services/TodoService');
const UserService = require('./services/UserService');
const AuthService = require('./services/AuthService');

module.exports = (config, sequelize) => {
  const log = config.log();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  const todoService = new TodoService(sequelize);
  const userService = new UserService(sequelize);
  const authService = new AuthService(sequelize);

  // Add a request logging middleware in development mode
  if (app.get('env') === 'development') {
    app.use((req, res, next) => {
      log.debug(`${req.method}: ${req.url}`);
      return next();
    });
  }

  app.use('/api', routes({ todoService, userService ,authService}));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use(helmet());
  // eslint-disable-next-line no-unused-vars
  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    // Log out the error to the console
    log.error(error);
    return res.json({
      error: {
        message: error.message,
      },
    });
  });
  return app;
};
