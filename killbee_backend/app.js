var express = require('express');
var app = express();
var ActiveDirectory = require('activedirectory');
var cors = require('cors');
var config = require('./AD_config.json');
var ad = new ActiveDirectory(config);
ad.baseDN = config.baseDN;
var port = 3000;

app.use(cors(
));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
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
  console.log(req.body.username);
  ad.baseDN = config.baseDN;
  await ad.authenticate(req.body.username + "@killbee.com", req.body.password, async function (err, auth) {
    if (err) {
      console.log(err)
      console.log("1")
      res.status(403);
      res.send(err);
    }
    else {
      if (auth) {
        ad.baseDN = config.baseDN;
        console.log("2")
        const token = generateAccessToken({ username: req.body.username });
        await ad.findUser(req.body.username, function (err, user) {
          if (err) {
            console.log('ERROR: ' + JSON.stringify(err));
            res.status(500);
            res.send();
          }
          if (!user) console.log('User: ' + username + ' not found.');
          else {
            var jsonreturn = {}
            jsonreturn['token'] = token
            jsonreturn['user'] = user
            res.json(jsonreturn);
            console.log(jsonreturn)
            res.status(200);
            res.send();
          }

        });

        const user = finduser(req.body.username).then(data => {
          console.log(data);


        }).catch(e => console.log(e));

      }
      else {
        console.log("3")
        res.status(403);
        res.send("AUTH ERROR")
      }
    }
  })


});


async function finduser(username) {
  console.log(ad)
  //ad.baseDN = config.baseDN
  console.log(ad.baseDN)
  await ad.findUser(username, function (err, user) {
    if (err) {
      console.log('ERROR: ' + JSON.stringify(err));
      return;
    }
    if (!user) console.log('User: ' + username + ' not found.');
    else console.log(JSON.stringify(user));
  });
}
