var express = require('express');
var app     = express();

var cors = require('cors');
app.use(cors());

var logger = require('morgan');
app.use(logger('dev'));

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/frontend'));

var mongoose = require('mongoose');
mongoose.connect('mongodb://omistaja:asdf@ds045704.mongolab.com:45704/nh-test');
mongoose.connection.on('error', function(err) {
	console.log('Error: Could not connect to MongoDB.'.red);
});

require('./routes/routes.js')(app);

app.set('port', (process.env.PORT || 4000));

app.listen(app.get('port'), function () {
    console.log('app is listening on port', app.get('port'));
});