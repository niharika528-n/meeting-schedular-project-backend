const User = require('./model');
const logger = require('../../utils/logger');

class UserService {
  static async createUser(userData) {
    try {
      const user = await User.create(userData);
      logger.info(`User created: ${user.id}`);
      return user;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  static async getUserById(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        error.code = 'USER_NOT_FOUND';
        throw error;
      }
      return user;
    } catch (error) {
      if (error.statusCode === 404) {
        throw error;
      }
      logger.error('Error fetching user:', error);
      throw error;
    }
  }

  static async getAllUsers(options = {}) {
    try {
      const { offset = 0, limit = 100 } = options;
      const { count, rows } = await User.findAndCountAll({
        offset,
        limit,
        order: [['createdAt', 'DESC']]
      });
      return {
        data: rows,
        total: count
      };
    } catch (error) {
      logger.error('Error fetching users:', error);
      throw error;
    }
  }

  static async updateUser(userId, userData) {
    try {
      const user = await this.getUserById(userId);
      await user.update(userData);
      logger.info(`User updated: ${userId}`);
      return user;
    } catch (error) {
      if (error.statusCode === 404) {
        throw error;
      }
      logger.error('Error updating user:', error);
      throw error;
    }
  }

  static async deleteUser(userId) {
    try {
      const user = await this.getUserById(userId);
      await user.destroy();
      logger.info(`User deleted: ${userId}`);
      return true;
    } catch (error) {
      if (error.statusCode === 404) {
        throw error;
      }
      logger.error('Error deleting user:', error);
      throw error;
    }
  }

  static async getUserByEmail(email) {
    try {
      const user = await User.findOne({
        where: { email: email.toLowerCase() }
      });
      return user;
    } catch (error) {
      logger.error('Error finding user by email:', error);
      throw error;
    }
  }
}

module.exports = UserService;
