//TODO: transcript to index.ts

let express = require("express");

let router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("Hello World COMPONENTS");
});

module.exports = router;
