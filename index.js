'use strict';

const login = require('facebook-chat-api');
const moment = require('moment');
const config = require('./config');
const Tasks = require('./models/task');


login({email: config.fb.e, password: config.fb.p}, function(err, api) {
  if (err) return console.error(err);
  api.listen(function callback(err, event) {
    console.log(event);
    // api.sendMessage('Welcome', event.threadID);
    var eventBody = event.body.toLowerCase();
    if (eventBody.includes('@bot ')) {
      // add is of form '@bot add task "subject" "task" "date"'
      var msg = eventBody.slice('@bot '.length);
      if (msg.includes('add task ')) {
        msg = msg.slice('add task '.length).split('\"');
        Tasks.create({
            threadID: event.threadID,
            taskName: msg[3],
            taskSubject: msg[1],
            addDate: moment().unix(), 
            dueDate: moment(msg[5]).unix(),
          }, function(err, message) {
            if (err) return console.error(err);
            console.log('Task added')
          }
        );
      }
    }
  })
});