'use strict';

const login = require('facebook-chat-api');
const moment = require('moment');
const Tasks = require('./models/task');

const config = require('./config');
const utils = require('./utils');

login({email: config.fb.e, password: config.fb.p}, function(err, api) {
  if (err) return console.error(err);
  api.listen(function callback(err, event) {
    // console.log(event);
    var eventBody = event.body.toLowerCase();
    if (eventBody.includes('@bot ')) {
      // add is of form '@bot add task "subject" "task" "date"'
      var msg = eventBody.slice('@bot '.length);
      if (msg.includes('add task ')) {
        msg = msg.slice('add task '.length).split('\"');
        // date must be of form YYYY-MM-DD (TODO natural-lang date processing)
        Tasks.create({
            threadID: event.threadID,
            taskName: msg[3],
            taskSubject: msg[1],
            addDate: moment().unix(), 
            dueDate: moment(utils.parseDate(msg[5])).unix(),
          }, function(err, message) {
            if (err) return console.error(err);
            // console.log('Task added')
            api.sendMessage('Task added', event.threadID);
          }
        );
      } else if (msg.includes('show tasks')) {
        msg = msg.slice('show tasks'.length);
        if (!utils.isEmpty(msg)) {
          var subj = msg.slice(' for '.length).split('\"')[1];
          Tasks.find({ taskSubject: subj }, function(err, tasks) {
            if (err) return console.error(err);
            var out;
            if (utils.isEmpty(tasks)) 
              return api.sendMessage('No tasks for ' + subj, event.threadID);
            tasks.forEach(function(task) {
              api.sendMessage(task.taskName + " | due " + moment(task.dueDate, 'x'), event.threadID);
            })
          });
        } else {
          console.log('Show all tasks');
        }
      }
    }
  })
});