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
    if (eventBody === '@taskbot') {
      api.sendMessage('Welcome to TaskBot.\nType "@taskbot help" for a list of commands.', event.threadID);
    }
    if (eventBody.includes('@taskbot ')) {
      var msg = eventBody.slice('@taskbot '.length);
      if (msg.includes('help')) {
        var out = '';
        out += 'TaskBot Commands\n\n';
        out += '@taskbot add task "subject" "task" "due date" - add new task\n';
        out += '@taskbot show tasks - view pending tasks\n';
        out += '@taskbot show tasks for "subject" - view pending tasks for subject\n';
        out += '@taskbot remove "subject" "task name" - remove task';
        api.sendMessage(out, event.threadID);
      } else if (msg.includes('add task ')) {
        // create tasks w/ '@taskbot add task "subject" "task" "date"'
        msg = msg.slice('add task '.length).split('\"');
        // date must be of form YYYY-MM-DD (TODO date processing for natural lang input)
        Tasks.create({
            threadID: event.threadID,
            taskName: msg[3],
            taskSubject: msg[1],
            addDate: moment().unix(), 
            dueDate: moment(utils.parseDate(msg[5])).unix(),
          }, function(err, message) {
            if (err) return console.error(err);
            return api.sendMessage('Task added', event.threadID);
          }
        );
      } else if (msg.includes('show tasks')) {
        // find tasks w/ '@taskbot show tasks', '@taskbot show tasks for "subject"'
        msg = msg.slice('show tasks'.length);
        var query = {}, 
            subj;

        if (!utils.isEmpty(msg)) {
          subj = msg.slice(' for '.length).split('\"')[1];
          query['taskSubject'] = subj;
        }

        Tasks.find(query, function(err, tasks) {
          if (err) return console.error(err);
          if (utils.isEmpty(tasks)) return api.sendMessage('No tasks found', event.threadID);
          tasks.forEach(function(task) {
            var out = task.taskName + ' | ' + moment.unix(task.dueDate).format('MMM Do, YYYY');
            if (subj == null) out = task.taskSubject + ' | ' + out
            api.sendMessage(out, event.threadID);
          });
        });
      } else if (msg.includes('remove ')) {
        // remove tasks w/ '@taskbot remove "subject" "task name"'
        msg = msg.slice('remove '.length).split('\"');
        Tasks.remove({
          taskSubject: msg[1],
          taskName: msg[3]
        }, function(err, count) {
          if (err) return console.error(err);
          if (count.result.n == 0) return api.sendMessage('Task not found', event.threadID);
          return api.sendMessage('Task removed', event.threadID);
        });
      }
    }
  })
});