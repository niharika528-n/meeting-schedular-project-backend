const Meeting = require('./model');
const User = require('../user/model');
const logger = require('../../utils/logger');
const { Op } = require('sequelize');

class MeetingService {
  static async checkMeetingOverlap(userId, startTime, endTime, excludeMeetingId = null) {
    try {
      const query = {
        where: {
          userId,
          [Op.and]: [
            {
              startTime: {
                [Op.lt]: endTime
              }
            },
            {
              endTime: {
                [Op.gt]: startTime
              }
            }
          ]
        }
      };

      if (excludeMeetingId) {
        query.where.id = {
          [Op.ne]: excludeMeetingId
        };
      }

      const conflictingMeeting = await Meeting.findOne(query);
      return conflictingMeeting ? true : false;
    } catch (error) {
      logger.error('Error checking meeting overlap:', error);
      throw error;
    }
  }

  static async createMeeting(meetingData) {
    try {
      // Verify user exists
      const user = await User.findByPk(meetingData.userId);
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        error.code = 'USER_NOT_FOUND';
        throw error;
      }

      // Check for overlapping meetings
      const hasOverlap = await this.checkMeetingOverlap(
        meetingData.userId,
        meetingData.startTime,
        meetingData.endTime
      );

      if (hasOverlap) {
        const error = new Error('Time slot already booked');
        error.statusCode = 400;
        error.code = 'SCHEDULING_CONFLICT';
        throw error;
      }

      const meeting = await Meeting.create(meetingData);
      logger.info(`Meeting created: ${meeting.id}`);
      return meeting;
    } catch (error) {
      logger.error('Error creating meeting:', error);
      throw error;
    }
  }

  static async getMeetingById(meetingId) {
    try {
      const meeting = await Meeting.findByPk(meetingId, {
        include: {
          model: User,
          attributes: ['id', 'name', 'email']
        }
      });

      if (!meeting) {
        const error = new Error('Meeting not found');
        error.statusCode = 404;
        error.code = 'MEETING_NOT_FOUND';
        throw error;
      }

      return meeting;
    } catch (error) {
      if (error.statusCode === 404) {
        throw error;
      }
      logger.error('Error fetching meeting:', error);
      throw error;
    }
  }

  static async getAllMeetings(options = {}) {
    try {
      const {
        offset = 0,
        limit = 100,
        userId = null,
        startDate = null,
        endDate = null
      } = options;

      const where = {};

      if (userId) {
        where.userId = userId;
      }

      if (startDate && endDate) {
        where.startTime = {
          [Op.gte]: new Date(startDate)
        };
        where.endTime = {
          [Op.lte]: new Date(new Date(endDate).setHours(23, 59, 59, 999))
        };
      } else if (startDate) {
        where.startTime = {
          [Op.gte]: new Date(startDate)
        };
      } else if (endDate) {
        where.endTime = {
          [Op.lte]: new Date(new Date(endDate).setHours(23, 59, 59, 999))
        };
      }

      const { count, rows } = await Meeting.findAndCountAll({
        where,
        include: {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        offset,
        limit,
        order: [['startTime', 'ASC']]
      });

      return {
        data: rows,
        total: count
      };
    } catch (error) {
      logger.error('Error fetching meetings:', error);
      throw error;
    }
  }

  static async updateMeeting(meetingId, updateData) {
    try {
      const meeting = await this.getMeetingById(meetingId);

      // If time is being updated, check for overlaps
      if (updateData.startTime || updateData.endTime) {
        const startTime = updateData.startTime || meeting.startTime;
        const endTime = updateData.endTime || meeting.endTime;

        // Check for overlaps excluding current meeting
        const hasOverlap = await this.checkMeetingOverlap(
          meeting.userId,
          startTime,
          endTime,
          meetingId
        );

        if (hasOverlap) {
          const error = new Error('Time slot already booked');
          error.statusCode = 400;
          error.code = 'SCHEDULING_CONFLICT';
          throw error;
        }
      }

      await meeting.update(updateData);
      logger.info(`Meeting updated: ${meetingId}`);
      return meeting;
    } catch (error) {
      if (error.statusCode === 404 || error.statusCode === 400) {
        throw error;
      }
      logger.error('Error updating meeting:', error);
      throw error;
    }
  }

  static async deleteMeeting(meetingId) {
    try {
      const meeting = await this.getMeetingById(meetingId);
      await meeting.destroy();
      logger.info(`Meeting deleted: ${meetingId}`);
      return true;
    } catch (error) {
      if (error.statusCode === 404) {
        throw error;
      }
      logger.error('Error deleting meeting:', error);
      throw error;
    }
  }

  static async getMeetingsByUserId(userId) {
    try {
      const meetings = await Meeting.findAll({
        where: { userId },
        order: [['startTime', 'ASC']]
      });
      return meetings;
    } catch (error) {
      logger.error('Error fetching user meetings:', error);
      throw error;
    }
  }
}

module.exports = MeetingService;
