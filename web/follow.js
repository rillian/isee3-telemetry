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
