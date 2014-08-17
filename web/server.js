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

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Serve our pages.
app.get('/', function(req, res) {
  res.sendfile('index.html');
});

// Repeat available data.
var telemetry_status = {
  msg: 'no data',
  last: null,
  update: function(msg) {
    this.msg = msg;
    this.last = new Date();
  }
};
var query = {
  list: {
    action: 'list',
    seq: 0,
  },
  register: {
    action: 'register',
    data: [
      'hps_1_tc',
      'hps_2_tc',
      'hps_1_temp_supercom',
      'hps_2_temp_supercom',
      'accelerometer',
      'spin_rate',
      'spin_angle',
      'spacecraft_clock',
      'frame_counter',
      '28v_bus',
      'sa_current',
    ],
    seq: 1,
  },
}

io.on('connection', function(socket){
  console.log('socket.io connect', socket.handshake.address);
  io.emit('status', telemetry_status);
  socket.on('disconnect', function(){
    console.log('socket.io disconnect');
  });
});

var net = require('net');
var client = net.connect({port: 21012}, function() {
  // On connect.
  console.log('telemetry connected');
  client.write(JSON.stringify(query.register) + '\n');
});
client.on('data', function(data) {
  try {
    // The server sends a json representation of each data point.
    // Unfortunately we sometimes receive multiple objects in a
    // single buffer. Assume we can split them at newlines.
    data.toString().split('\n').forEach(function(stanza) {
      stanza.length && io.emit('data', JSON.parse(stanza));
    });
    // Keep track of how recently we've see telemetry.
    telemetry_status.update('data');
  }
  catch (e) {
    console.log('Failed to forward json from server:\n', data.toString(), e);
  }
});
client.on('end', function() {
  console.log('telemetry disconnected');
  telemetry_status.update('no data');
  io.emit('status', telemetry_status);
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
