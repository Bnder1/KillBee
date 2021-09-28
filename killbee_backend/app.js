var express = require('express');
var app = express();
var ActiveDirectory = require('activedirectory');
var cors = require('cors');
var config = require('./AD_config.json');
var ad = new ActiveDirectory(config);
var port = 3000;

app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 next();
});

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { json } = require('body-parser');
dotenv.config();
process.env.TOKEN_SECRET;



function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

app.listen(port, function () {
  return console.log('Started listening on port ' + port);
});

app.use(express.json({
  type: ['application/json', 'text/plain']
}));



app.post('/auth', async (req, res) => {
  const resserv = "VIDE"
  console.log(JSON.stringify(req.body));
  await ad.authenticate(req.body.username, req.body.password, function (err, auth) {
    if (err) {
      console.log(err)
      console.log("1")
      res.status(403);
      res.send("1")
    }
    else {
      if (auth) {
        console.log("2")
        const token = generateAccessToken({ username: req.body.username });
        res.json(token);
        res.status(200);
        res.send();
      }
      else {
        console.log("3")
        res.status(403);
        res.send("AUTH ERROR")
      }
    }
  })

});



