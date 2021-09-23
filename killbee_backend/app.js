// Variables
var express = require('express');
var app = express();
var handler = require('lemonldap-ng-handler');


// and load it
app.use(handler.run);

// Then simply use your express app
app.get('/', function(req, res) {
  return res.send('Hello ' + req.headers['Auth-User'] + ' !');
});
app.listen(3000, function() {
  return console.log('Example app listening on port 3000!');
});