'use strict';
const mongoose = require('mongoose');
const db = mongoose.createConnect('mongodb://localhost/fb-assistant');

const TaskSchema = new mongoose.Schema({
  
}, {strict: false});

module.exports = db.model('tasks', TaskSchema);
