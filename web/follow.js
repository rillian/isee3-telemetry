// Node JS script for testing the json server.

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

var net = require('net');

var elements = ['hps_1_tc', 'hps_2_tc'];
var register = {
  action: 'register',
  data: elements,
  seq: 0,
};
var unregister = {
  action: 'unregister',
  data: elements,
  seq: 1,
};

var client = net.connect({port: 21012}, function() {
  // On connect.
  console.log('client connected');
  // Commands are newline-terminated json.
  client.write(JSON.stringify(register) + '\n');
});
client.on('data', function(data) {
  result = JSON.parse(data);
  console.log(result);
  if (result.action == 'list') {
    console.log ('Available elements:');
    elements = result.result[0];
    for (id in elements) {
      console.log('  ' + elements[id])
    }
  } else {
    console.log('misunderstood response');
    console.log(data.toString());
  }
  client.end(JSON.stringify(unregister) + '\n');
});
client.on('end', function() {
  console.log('client disconnected');
});
