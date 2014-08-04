var net = require('net');

var client = net.connect({port: 21012}, function() {
  // On connect.
  console.log("connected");
  client.write('{"action": "list", "seq": 0}\n');
});
client.on('data', function(data) {
  console.log(data.toString());
  client.end();
});
client.on('end', function() {
  console.log('client disconnected');
});

