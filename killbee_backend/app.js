// Variables
var express = require('express');
var app = express();
var ActiveDirectory = require('activedirectory');
var config = {
  url : '192.168.1.10', //mettre lien AD ici
  basedn : 'dc=domain, dc=com',
};

var ad = new ActiveDirectory(config);
var username = 'mettre utilisateur ici';
var password = 'mettre MDP ici';

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