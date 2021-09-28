// Variables
var express = require('express');
var app = express();
var ActiveDirectory = require('activedirectory');
var cors = require('cors');
var config = require('./AD_config.json');
var bodyParser = require('body-parser');
var ad = new ActiveDirectory(config);
//var username = 'test@test.com';
//var password = '12345678';
var port = 3000;
mode: 'no-cors'

app.use(cors());

// // Then simply use your express app

app.listen(port, function () {
    return console.log('Started listening on port ' + port);
});

app.use(express.json({
    type: ['application/json', 'text/plain']
  }));

app.post('/auth', async (req, res) => {
    const  resserv="VIDE"
    console.log(JSON.stringify(req.body));
        await ad.authenticate(req.body.username, req.body.password, function (err, auth){
       if (err) {
                console.log(err)
                console.log("1")
                res.status(403);
                    res.send("1")
                }
                else{
                if (auth) {
                console.log("2")
                res.status(200);
                res.send(  "ok")
                }
                else {
                console.log("3")
                res.status(403);
                res.send("AUTH ERROR")
                }}})
    
    
});



