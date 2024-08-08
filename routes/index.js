const express = require('express');
const router = express.Router();

const todosRoute = require('./todos');
const usersRoute = require('./users');
const authRoute = require('./auth');

module.exports = (params) => {

  router.get('/', (req, res) => {
    res.send('Home Page');
  });

  router.use('/todo', todosRoute(params.todoService));
  router.use('/user', usersRoute(params.userService));
  router.use('/auth', authRoute(params.authService));

  return router;
};