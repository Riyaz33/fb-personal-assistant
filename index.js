'use strict';

const login = require('facebook-chat-api');
const moment = require('moment');
const config = require('./config');
const Task = require('./models/task');


login({email: config.fb.e, password: config.fb.p}, function(err, api) {
  if (err) return console.error(err);
  api.listen(function callback(err, event) {
    //  console.log(event);
    api.sendMessage('Welcome', event.threadID);
  })
});