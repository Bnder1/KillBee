// Modules
let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
let env = require('dotenv').config();
let cors = require('cors');

// DATABASE CONNECTION
let mongo = require('./plugins/mongo.js');
//let sql = require('./plugins/sqlserver.js');

// ROUTES AVAILABLE
const { application } = require("express");
let authRouter = require('./routes/auth.js');
// let consumerRouter = require('./routes/consumer.js');

// APP
let app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const options = {
  setHeaders: function (res, path, stat) {
    res.set('Access-Control-Allow-Origin', "*")
  }
}

app.use(cors());

app.use("/", indexRouter);
app.use("/ip", ipRouter);
app.use("/auth", authRouter);
// app.use("/consumers", consumerRouter);

module.exports = app;