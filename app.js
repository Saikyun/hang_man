/// <reference path="typings/node/node.d.ts"/>
'use strict';

var app = require('express')();
var socketio = require('socket.io');
var ruleCheckerFactory = require('rule_checker');

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

app.get('/js/bundle.js', function(req, res) {
	res.sendFile(__dirname + '/public/js/bundle.js');
});

var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
	console.log('listening on 127.0.0.1:' + port);
});

var io = socketio(server);

var data = require('./game_specific/data.js');

var clients = {};
	
var rules = require('./game_specific/rules.js');
var ruleChecker = ruleCheckerFactory();

io.on('connection', function(socket) {
	clients[socket.id] = socket;
	
	console.log('someone connected', socket.id);
	
	
	ruleChecker.addEvent(
		'guess',
		rules['guess'],
		function(event, callback) { socket.on(event, callback); },
		function error(message) {
			socket.emit('error_message', message);
		},
		data
	);
	
	socket.on('disconnect', function() {
		console.log('someone disconnected', socket.id);
	});
});