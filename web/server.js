// Node JS application for proxing the json server to web clients.

// Copyright 2014 Ralph Giles <giles@thaumas.net>
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
// MA 02110-1301, USA.

var express = require('express');
var app = express();
var http = require('http').Server(app);

var net = require('net');
var query = {
  list: {
    action: 'list',
    seq: 0,
  },
  register: {
    action: 'register',
    data: [ 'hps_1_tc', 'hps_2_tc' ],
    seq: 1,
  },
}

app.get('/', function(req, res) {
  res.send('ISEE-3 Reboot!');
});

app.get('/list', function(req, res) {
  var list = [];
  var client = net.connect({port: 21012}, function() {
    // On connect.
    console.log('client connected');
    client.write(JSON.stringify(query.list) + '\n');
  });
  client.on('data', function(data) {
    parse = JSON.parse(data);
    res.send({
      result: parse.result[0],
      error: parse.error,
    });
    client.end();
  });
  client.on('end', function() {
    console.log('client disconnected');
  });
});

// Instantiate server.
var server = http.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});


// Error handling. Note 'next' propagation to later handlers.
function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}
function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.send(500, { error: 'Error handling request.' });
  } else {
    next(err);
  }
}
function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}
