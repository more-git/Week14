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

    app.get('/tasks', function (request, response) {
        var query = Tasks.find();
        query.exec(function (err, docs){
            response.status(200);
            response.send(JSON.stringify({docs}));
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

    app.delete('/task/*', function (req, res){
        query = Tasks.deleteOne({'_id': req.params[0]});
        query.exec(function (err) {
                res.status(200);
                res.send(JSON.stringify({}));
            }
        );
    })

    app.put('/update/*',function(req, res)  {
        var query = Projects.findByIdAndUpdate(req.body._id, {"name": req.body.name});
        query.exec(function (err, doc) {
            res.status(200);
            res.send(JSON.stringify(doc));
        });
    })


    app.get('/time', function (request, response) {
        console.log("app.get: '/time'");
        var query = Timer.find();
        query.exec(function (err, docs){
            console.log("getTimer = "+docs);
            response.status(200);
            response.send(JSON.stringify({docs}));
        });
    })

    app.put('/updateTime/*',function(req, res)  {
        var query = Timer.findByIdAndUpdate(req.body._id, {"datetime": req.body.name});
        query.exec(function (err, doc) {
            res.status(200);
            res.send(JSON.stringify(doc));
        });
    })

     app.get('/diff', function (request, response) {

        var query = Timer.findOne({task_name: request.body.task_name});
        query.exec(function (err, docs){
            console.log("getDiff = "+docs);
            response.status(200);
            response.send(JSON.stringify({docs}));
        });

    })

    app.put('/updateTimer/*',function(req, res)  {

        var stopDate = new Date();
        var startDate;

        var query = Timer.findOne({task_name: req.body.task_name});

        query.exec(function (err, docs){
            startDate = docs.datetime;
            // calculate totalTime
            var diff = stopDate -  startDate;
            console.log('diff (milliseconds) '+diff);
            diff /= 60000;
            diff = diff.toFixed(2);
            console.log('diff (minutes)'+diff);
            res.status(200);
            res.send(diff.toString());// send totalTime(minutes)
        });
        
        /*
        var query = Timer.findByIdAndUpdate(req.body._id, {"datetime": req.body.name});
        query.exec(function (err, doc) {
            res.status(200);
            res.send(JSON.stringify(doc));
        });*/

    }) 


    app.put('/updateTotalTime/*',function(req, res)  {

        var stopDate = new Date();
        var startDate;

        var diff = 0;

        var query = Tasks.findOne({_id: req.body.task_id});
        query.exec(function (err, docs){
            startDate = docs.datetime;
            // calculate totalTime
            diff = stopDate -  startDate;
            console.log('diff (milliseconds) '+diff);
            diff /= 60000;
            diff = diff.toFixed(2);
            console.log('diff (minutes)'+diff);
            res.status(200);
            res.send(diff.toString());// send totalTime(minutes)

            /**/
            var query = Tasks.findByIdAndUpdate(req.body.task_id, {"totalTime": diff.toString()});
            query.exec(function (err, doc) {
                res.status(200);
                res.send(JSON.stringify(doc));
            });
            /**/
        });

        /*
        var query = Tasks.findByIdAndUpdate(req.body._id, {"totalTime": diff.toString()});
        query.exec(function (err, doc) {
            res.status(200);
            res.send(JSON.stringify(doc));
        });*/
        

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


        socket.on('startTimer', function (taskName) {
            console.log("start("+taskName+")");
            var startDate = new Date();
            var taskStarted = Projects.find({name: taskName}).exec(function (err, docs){

                 var timer = new Timer({
                    task_id: docs._id, 
                    datetime: startDate,
                    task_name: taskName
                });
                timer.save(function(err, doc) {
                })
                console.log('docs = ' + docs);
                io.emit("time",docs);

            });
        })  

        socket.on('stopTimer', function (name) {
            console.log("stop("+name+")"); 
            var stopDate = new Date();

            var timer = Timer.findOne({task_name: name}).exec(function (err, docs){
                
                console.log('stopDate = ' + stopDate);
                var startDate = docs.datetime;
                if (startDate) {
                    console.log('startDate = ' + startDate);
                    var diff = stopDate -  startDate;
                    console.log('diff (milliseconds) '+diff);
                    diff /= 60000;
                    diff = diff.toFixed(2);
                    console.log('diff (minutes)'+diff);
                } 
            }); 
            // update task with task_name == name
            // remove timer associated with task_id
        })   

        socket.on('getTimers', () => {
            let ms = 'max'
            io.emit("time",ms);
        });


        var startDate;
        socket.on('timer', function (start, id) {
            if (!startDate) {
                startDate= new Date();
            }

            if (start) {
                var taskDate = new Date();
                startDate = new Date();
                // Add the current datetime to the db

            } else {
                // calculate totalTime 
                var stopDate = new Date();

                // update totalTime
                var taskStopped = Tasks.find({project_id: id});
                var stoppedTimer = Timer.find({task_id: id});

                if (startDate) {
                    // update Timer.datetime
                }

                // remove timer
                //Timer.deleteOne({task_id: id}).exec(function (err, doc) {})

            }

        })


 





        // tasksComponent
        socket.on('startTask', function (taskName) {
            console.log("start("+taskName+")");
            var startDate = new Date();
            var taskStarted = Tasks.find({name: taskName}).exec(function (err, docs){

                 var timer = new Timer({
                    task_id: docs._id, 
                    datetime: startDate,
                    task_name: taskName
                });
                timer.save(function(err, doc) {
                })
                console.log('docs = ' + docs);
                io.emit("time",docs);

            });
        })  

        socket.on('stopTask', function (name) {
            console.log("stop("+name+")"); 
            var stopDate = new Date();

            var timer = Timer.findOne({task_name: name}).exec(function (err, docs){
                
                console.log('stopDate = ' + stopDate);
                var startDate = docs.datetime;
                if (startDate) {
                    console.log('startDate = ' + startDate);
                    var diff = stopDate -  startDate;
                    console.log('diff (milliseconds) '+diff);
                    diff /= 60000;
                    diff = diff.toFixed(2);
                    console.log('diff (minutes)'+diff);
                } 
            }); 
            // update task with task_name == name
            // remove timer associated with task_id
        }) 
    })

});
    

