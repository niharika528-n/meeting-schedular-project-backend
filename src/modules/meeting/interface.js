const MeetingService = require('./service');
const { createMeetingSchema, updateMeetingSchema } = require('./dto');
const { HTTP_STATUS, MESSAGES } = require('../../config/constants');
const logger = require('../../utils/logger');

class MeetingInterface {
  static async create(req, res, next) {
    try {
      const { error, value } = await createMeetingSchema.validate(req.body);
      if (error) {
        error.isJoi = true;
        return next(error);
      }

      const meeting = await MeetingService.createMeeting(value);

      res.status(HTTP_STATUS.CREATED).json({
        status: 'success',
        message: MESSAGES.MEETING_CREATED,
        data: meeting
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const meeting = await MeetingService.getMeetingById(id);

      res.status(HTTP_STATUS.OK).json({
        status: 'success',
        message: MESSAGES.MEETING_FETCHED,
        data: meeting
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const { offset, limit, userId, startDate, endDate } = req.query;

      const options = {
        offset: offset ? parseInt(offset, 10) : 0,
        limit: limit ? parseInt(limit, 10) : 100,
        userId: userId || null,
        startDate: startDate || null,
        endDate: endDate || null
      };

      const result = await MeetingService.getAllMeetings(options);

      res.status(HTTP_STATUS.OK).json({
        status: 'success',
        message: MESSAGES.MEETINGS_FETCHED,
        ...result
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { error, value } = await updateMeetingSchema.validate(req.body);
      if (error) {
        error.isJoi = true;
        return next(error);
      }

      const { id } = req.params;
      const meeting = await MeetingService.updateMeeting(id, value);

      res.status(HTTP_STATUS.OK).json({
        status: 'success',
        message: MESSAGES.MEETING_UPDATED,
        data: meeting
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      await MeetingService.deleteMeeting(id);

      res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MeetingInterface;
