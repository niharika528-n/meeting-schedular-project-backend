const UserService = require('./service');
const { createUserSchema, updateUserSchema } = require('./dto');
const { HTTP_STATUS, MESSAGES } = require('../../config/constants');
const logger = require('../../utils/logger');

class UserInterface {
  static async create(req, res, next) {
    try {
      const { error, value } = createUserSchema.validate(req.body);
      if (error) {
        error.isJoi = true;
        return next(error);
      }

      const user = await UserService.createUser(value);

      res.status(HTTP_STATUS.CREATED).json({
        status: 'success',
        message: MESSAGES.USER_CREATED,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);

      res.status(HTTP_STATUS.OK).json({
        status: 'success',
        message: MESSAGES.USER_FETCHED,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const { offset, limit } = req.query;
      const options = {
        offset: offset ? parseInt(offset, 10) : 0,
        limit: limit ? parseInt(limit, 10) : 100
      };

      const result = await UserService.getAllUsers(options);

      res.status(HTTP_STATUS.OK).json({
        status: 'success',
        message: MESSAGES.USERS_FETCHED,
        ...result
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { error, value } = updateUserSchema.validate(req.body);
      if (error) {
        error.isJoi = true;
        return next(error);
      }

      const { id } = req.params;
      const user = await UserService.updateUser(id, value);

      res.status(HTTP_STATUS.OK).json({
        status: 'success',
        message: MESSAGES.USER_FETCHED,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      await UserService.deleteUser(id);

      res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserInterface;
