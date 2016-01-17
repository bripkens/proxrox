var express = require('express');
var util = require('util');
var app = express();

app.use(function(req, res) {
  var response = {
    method: req.method,
    query: req.query,
    params: req.params,
    originalUrl: req.originalUrl,
    headers: req.headers,
    socket: {
      remoteAddress: req.socket.remoteAddress,
      remotePort: req.socket.remotePort
    }
  };

  // avoid leaking cookies during presentations ;)
  delete response.headers['cookie'];

  console.log('Got request', util.inspect(response, {colors: true}));

  res.json(response);
});

app.listen(4001, function () {
  console.log('Server listening on port 4001!');
});
