const { VALIDATION } = require('../config/constants');

class ValidatorUtil {
  static isValidEmail(email) {
    return VALIDATION.EMAIL_REGEX.test(email);
  }

  static isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  static isValidDateFormat(dateStr) {
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date);
  }

  static isValidTimeRange(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (!(start instanceof Date && !isNaN(start))) {
      return false;
    }

    if (!(end instanceof Date && !isNaN(end))) {
      return false;
    }

    return start < end;
  }

  static parseDate(dateStr) {
    try {
      const date = new Date(dateStr);
      if (!(date instanceof Date && !isNaN(date))) {
        return null;
      }
      return date;
    } catch (error) {
      return null;
    }
  }

  static formatDate(date) {
    if (!(date instanceof Date && !isNaN(date))) {
      return null;
    }
    return date.toISOString();
  }
}

module.exports = ValidatorUtil;
