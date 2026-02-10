const User = require('./model');
const UserService = require('./service');
const UserInterface = require('./interface');
const userRoutes = require('./routes');

module.exports = {
  User,
  UserService,
  UserInterface,
  userRoutes
};
