const Meeting = require('./model');
const MeetingService = require('./service');
const MeetingInterface = require('./interface');
const meetingRoutes = require('./routes');

module.exports = {
  Meeting,
  MeetingService,
  MeetingInterface,
  meetingRoutes
};
