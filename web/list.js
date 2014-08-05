var net = require('net');

var query = {
  action: 'list',
  seq: 0,
};

var client = net.connect({port: 21012}, function() {
  // On connect.
  console.log('client connected');
  // Commands are newline-terminated json.
  client.write(JSON.stringify(query) + '\n');
});
client.on('data', function(data) {
  result = JSON.parse(data);
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
  client.end();
});
client.on('end', function() {
  console.log('client disconnected');
});
