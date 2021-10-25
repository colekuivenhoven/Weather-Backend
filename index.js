console.log('');

// Import Resources
const global_functions = require('./resources/globalFunctions.js');
var express = require("express");
const bodyParser = require("body-parser");
var cors = require('cors');
require('dotenv').config();

const expressPort = 3040;
const app = express();
const logFolder = './logs/';

var corsOptions = {
    "origin": '*',
    "Access-Control-Allow-Origin": "*"
}

// Routes
const route_weather = require('./routes/Weather.js')(app);

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Express Landing Page
app.get('/', (req, res) => {
    global_functions.logConnectionRecord('Landing Page', req.method);
    res.status(200).send('Weather Project Server - Landing Page');
});

app.listen(expressPort, () => {
    global_functions.logConnectionRecord("Inital Server Start - port: "+expressPort, "Server IP", "SERVER START");
});