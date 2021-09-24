// Variables
var express = require('express');
var app = express();
var ActiveDirectory = require('activedirectory');



var config = require('./AD_config.json');

var ad = new ActiveDirectory(config);
var username = 'test@test.com';
var password = '12345678';

ad.authenticate(username, password, function(err, auth) {
    if (err) {
        console.log('ERROR: '+JSON.stringify(err));
        return;
    }
    if (auth) {
        console.log('Authenticated!');
    }
    else {
        console.log('Authentication failed!');
    }
});

// // Then simply use your express app

// app.listen(3000, function() {
//   return console.log('Example app listening on port 3000!');
// });  
