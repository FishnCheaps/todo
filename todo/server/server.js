const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
mongoose.connect('mongodb://localhost/todo');
//Handling DB errors
var db = mongoose.connection;
db.on('error', function (err) {
    console.log('connection error:', err.message);
});
db.once('open', function callback () {
    console.log("Connected to DB!");
});





const app = express();

// API file for interacting with MongoDB
const api = require('./routes/api');

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));

// API location
app.use('/api', api);

// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));
