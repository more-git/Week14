var express = require('express');
var app = express();
var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost/projectsdb');
var projectSchema = require('./project_schema.js').projectSchema;
var Projects = mongoose.model('Projects', projectSchema);
//
//var taskSchema = require('./task_schema.js').taskSchema;
//var Tasks = mongoose.model('Tasks', taskSchema);
//
//var timerSchema = require('./timer_schema.js').timerSchema;
//var Timer = mongoose.model('Timer', timerSchema);
//
//var http = require('http').createServer(app);
//var http = require('http').Server(app);
//var io = require('socket.io')(http)
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
        //console.log(newProject)
        newProject.save(function (err, doc) {
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
    })

    app.put('/update/*',function(req, res)  {
        var query = Projectss.findByIdAndUpdate(req.body._id, {"name": req.body.name});
        query.exec(function (err, doc) {
            res.status(200);
            res.send(JSON.stringify(doc));
        });
    })

});
    

// Socket
io.sockets.on('connection', function (socket) {
    socket.on('user message', function (msg) {
        // You're going to want to include the nickname for the final project - IM project only
        // socket.broadcast.emit('user message', socket.nickname, msg);
        io.sockets.emit('user message', msg);
    })

    socket.on('nickname', function (nick) {
        // Instead of checking against an array you'll check against the database
        if (nicknames[nick]) {
            console.log("nickname exists!")
        } else {
            console.log("nickname added!")
            nicknames[nick] = nick;
            socket.nickname = nick;

            io.sockets.emit('nicknames', nicknames);
        }
    })

    socket.on('timer', function (start) {
        if (start) {
            // Add the current datetime to the db
            console.log('Timer has started!')
        } else {
            console.log('Timer has stopped!')
            // Get appropriate datetime from db
            // Remove the datetime from the db
        }
    })
})




