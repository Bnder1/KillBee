let express = require("express");
let validator = require("validator");
let router = express.Router();
let ActiveDirectory = require('activedirectory');
let config = require('../../AD_config.json');

let ad = new ActiveDirectory(config);
ad.baseDN = config.baseDN;

const jwt = require('jsonwebtoken');
const { json } = require('body-parser');

// GET
router.get("/", function (req, res, next) {
    res.json({"message": "Please send user credentials with POST header"});
});

// POST: Authentificate the user
router.post("/", async (req, res) => {
    console.log("POST AUTH CALLED");
    console.log(res);
    await ad.authenticate(req.body.username + "@killbee.com", req.body.password, async function (err, auth) {
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
      });
});

module.exports = router;

function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

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
