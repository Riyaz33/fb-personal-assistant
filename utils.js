'use strict';

const moment = require('moment');

var isEmpty = function(s) {
  return s === '';
}

var parseDate = function(date) {
  return date;
}

module.exports = {
  isEmpty: isEmpty,
  parseDate: parseDate
}

