//TODO: transcript to ip.ts

let os = require("os");
let exec = require("child_process");
let express = require("express");

let router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("Hello World COMPONENTS [ IP: " + ip + "]\n");
});

let ip = "192.168.0.X";

let dir = exec.exec('hostname -i', function(err, stdout, stderr) {
  if (err) {
    // should have err.code here?  
  }
  ip = stdout;
});

dir.on('exit', function (code) {
  // exit code is code
});


module.exports = router;
