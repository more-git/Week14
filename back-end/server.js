var express = require('express');
var app = express();
var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost/projectsdb');
var projectSchema = require('./project_schema.js').projectSchema;
var Projects = mongoose.model('Projects', projectSchema);

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
