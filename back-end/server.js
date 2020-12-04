var express = require('express');
var app = express();
var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost/projectsdb');
var projectSchema = require('./project_schema.js').projectSchema;
var Projects = mongoose.model('Projects', projectSchema);
var taskSchema = require('./task_schema.js').taskSchema;
var Tasks = mongoose.model('Tasks', taskSchema);
var timerSchema = require('./timer_schema.js').timerSchema;
var Timer = mongoose.model('Timer', timerSchema);

var io = require('socket.io').listen(8001)
var nicknames = {};

app.use(express.json());

mongoose.connection.once('open', function(){
    app.use(express.static('../project-management/dist/project-management/'))
    app.use('/', express.query());

    app.get('/names', function (request, response) {
        var query = Projects.find();
        query.exec(function (err, docs){
            response.status(200);
            response.send(JSON.stringify({docs}));
        });
    })

    app.post('/name', function (request, response) {
        var newProject = new Projects({
            name: request.body.name
        });
        console.log(newProject)
        newProject.save(function (err, doc) {
            response.status(200);
            response.send(JSON.stringify(doc));
        })
    })

    app.get('/tasks/*', function (request, response) {
        var query = Tasks.find();
        query.exec(function (err, docss){
            response.status(200);
            response.send(JSON.stringify({docss}));
        });
    })

    app.post('/task', function(request, response){
        var taskDate = new Date();
        taskDate = JSON.stringify(taskDate.toJSON().slice(0,19).replace('T',':'));
        var newTask = new Tasks({
            name: request.body.name,
            project_id: request.body.project_id,
            totalTime: '0',
            datetime: taskDate
        });
        console.log(newTask)
        newTask.save(function (err, doc) {
            response.status(200);
            response.send(JSON.stringify(doc));
        })
    })

    app.listen(8080, function () {
        console.log('Application is running!');
    })

    app.delete('/name/*', function (req, res){
        query = Projects.deleteOne({'_id': req.params[0]});
        query.exec(function (err) {
                res.status(200);
                res.send(JSON.stringify({}));
            }
        );
        // delete timer with task_id == req.params[0]
    })

    app.put('/update/*',function(req, res)  {
        var query = Projects.findByIdAndUpdate(req.body._id, {"name": req.body.name});
        query.exec(function (err, doc) {
            res.status(200);
            res.send(JSON.stringify(doc));
        });
    })


    // Socket
    io.sockets.on('connection', function (socket) {
        socket.on('user message', function (msg) {
        // You're going to want to include the nickname - IM project only
            io.sockets.emit('user message', msg);
        })

        socket.on('nickname', function (nick) {
            // Instead of checking against an array you'll check against the db 
            if (nicknames[nick]) {
                console.log("nickname exists!")
            } else {
                console.log("nickname added!")
                nicknames[nick] = nick;
                socket.nickname = nick;

            io.sockets.emit('nicknames', nicknames);
            }
        })

        var startDate;
        socket.on('timer', function (start, id) {
            if (!startDate) {
                startDate= new Date();
            }
            // if ((start)type == 'start')
            if (start) {
                var taskDate = new Date();
                startDate = new Date(); //use task _id
                
                var timer = new Timer({
                    task_id: id,
                    datetime: taskDate
                });
                timer.save(function(err, doc) {
                })
                // Add the current datetime to the db

                var newTask = new Tasks({
                    name: start,
                    project_id: id,
                    totalTime: '0',
                    datetime: taskDate
                });
                newTask.save(function (err, doc) {
                })
                console.log('Timer has started!')
                console.log('taskDate = ' + taskDate);
            } else {
                // calculate totalTime 
                var stopDate = new Date();

                // update totalTime
                /*Tasks.findByIdAndUpdate(id, {"project_id": id}).exec(function (err, doc) {
                });*/ 
                var taskStopped = Tasks.find({project_id: id});
                var stoppedTimer = Timer.find({task_id: id});

                if (startDate) {
                    var diff = stopDate -  startDate;
                    //var diff = stopDate -  stoppedTimer.datetime;

                    console.log('diff (milliseconds) '+diff);
                    diff /= 60000;
                    console.log('diff (minutes)'+diff);
                    //taskStopped.totalTime = Math.abs(Math.round(diff)).toString();
                }

                // remove timer
                /*Timer.deleteOne({task_id: id}).exec(function (err, doc) {
                })*/

            }
        })
    })

});
    

