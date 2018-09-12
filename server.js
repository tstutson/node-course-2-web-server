const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const request = require('request');

const port = process.env.PORT || 3000;
var app = express();

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');

app.use(function (req, res, next) {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`
    console.log(log);
    fs.appendFile('server.log', log + '\n', function (err) {
        if(err) {
            console.log('Unable to append to server.log.');
        }
    });
    next();
});

// app.use(function (req,res,next) {
//     res.render('maintenance.hbs');
// });

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', function () {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', function (text) {
    return text.toUpperCase();
});

app.get('/', function (req, res) {
   //res.send('<h1>Hello, Express!!</h1>');
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Yeah, dis my page, hoe. What you want doh?',
    })
});

app.get('/about', function (req, res) {
    res.render('about.hbs', {
        pageTitle: 'About Page',
    });
});

app.get('/bad', function (req, res) {
    res.send({
        errorMessage: 'Unable to handle request'
    })
});

app.get('/projects', function (req, res) {
    res.render('projects.hbs', {
        pageTitle: 'Projects Page',
        welcomeMessage: 'Dis the projects page biatch',
    })
});

function bootstrapEmbeddedURL(req, res, next) {
    if (!req.context) req.context = {};
    var client_id = '58dc305a75089c733ebc8487';
    var access_token = 'WpkFloEPcFj3OWSAMCoebBYlchW0zA5Ie7XjPmQUBCo_';
    var revision = '5b99190f94e9292a52fee3a5';

    var embedded_editor_url = 'https://dev-api.pactsafe.com/v1.1/revisions/' + revision + '/embedded_url?state=something';

    request.get({
            url: embedded_editor_url,
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'Content-Type': 'application/json'
            }
        },
        function(err, response, body) {
            if (err || !body) return next(err);
            try {
                body = JSON.parse(body);
                req.context.embedded_url = body.data.location;
            }
            catch (ex) {
                console.error(ex);
            }
            next();
        });
}

app.get('/embedded', bootstrapEmbeddedURL, function (req, res) {
    res.render('embedded.hbs', {
        pageTitle: 'Embedded Page',
        context: req.context
    })
});

app.listen(port, function () {
    console.log(`Server is up on ${port}.`);
});
