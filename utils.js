'use strict';

const moment = require('moment');

var isEmpty = function(e) {
  return typeof(s) == 'string' ? e === '' : e.length == 0 
}

var parseDate = function(date) {
  return date;
}

module.exports = {
  isEmpty: isEmpty,
  parseDate: parseDate
}

