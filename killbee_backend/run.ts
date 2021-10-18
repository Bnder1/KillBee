/**
 * Module dependencies.
 */

var app = require('./src/app');
var debug = require('debug')('myapp:server');
var http = require('http');
var https = require('https');
var fs = require('fs');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || 3000);
app.set('port', port);


let key = fs.readFileSync('./key.pem', 'utf8');
let cert = fs.readFileSync('./server.crt', 'utf8');

/**
 * Create HTTP server.
 */

//var httpserver = http.createServer(app);
var httpserver = https.createServer({key: key, cert: cert}, app);


/**
 * Listen on provided port, on all network interfaces.
 */


httpserver.listen(port);
httpserver.on('error', onError);
httpserver.on('listening', onListening);

/*
httpsserver.listen(port);
httpsserver.on('error', onError);
httpsserver.on('listening', onListening(httpsserver));
*/
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = httpserver.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
