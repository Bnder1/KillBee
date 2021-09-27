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
    const  resserv="VIDE"
    await ad.authenticate(req.query.username, req.query.password, function (err, auth){
       if (err) {
                console.log("1")
                    res.send("1")
                }
                else{
                if (auth) {
                console.log("2")
                res.send(  "ok")
                }
                else {
                console.log("3")
                res.send("AUTH ERROR")
                }}})
    
    
});



