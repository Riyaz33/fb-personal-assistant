'use strict';
const mongoose = require('mongoose');
const db = mongoose.createConnection('mongodb://localhost/fb-assistant');

const TaskSchema = new mongoose.Schema({
  threadID: String,
  senderID: String,
  taskName: String,
  taskSubject: String,
  addDate: Number,
  dueDate: Number,
}, {strict: false});

module.exports = db.model('tasks', TaskSchema);
