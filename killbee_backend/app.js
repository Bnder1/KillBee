// Variables
var express = require('express');
var app = express();
var ActiveDirectory = require('activedirectory');



var config = require('./AD_config.json');

var ad = new ActiveDirectory(config);
//var username = 'test@test.com';
//var password = '12345678';
var port = 3000



// // Then simply use your express app

app.listen(port, function () {
    return console.log('Started listening on port ' + port);
});

app.post('/auth', async (req, res) => {
    //console.log(req.query);
    try {

        let auth_status = await auth(req.query.username, req.query.password)
        let resp = await auth_status.json();
        console.log(auth_status)
        res.send(auth_status)
    } catch {
        res.send("SERVER ERROR")
    }
});


async function auth(username, password) {

    try {
        ad.authenticate(username, password, function (err, auth) {
            if (err) {
                return "AUTH ERROR";
            }
            if (auth) {
                return "ok"
            }
            else {
                return "AUTH ERROR"
            }
        });
    }
    catch {
        return "SERVER ERROR"
    }

}