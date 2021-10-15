//TODO: transcript to app.ts

// Modules
let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
let env = require('dotenv').config();
var cors = require('cors')

// DATABASE CONNECTION
let mongo = require('./plugins/mongo.js');
//test
//let sql = require('./plugins/sqlserver.js');

// ROUTES AVAILABLE
let indexRouter = require('./routes/index.js');
let authRouter = require('./routes/auth.js');
let ipRouter = require('./routes/ip.js');
const { application } = require("express");
// let consumerRouter = require('./routes/consumer.js');
// let addressRouter = require('./routes/address.js');
// let walletRouter = require('./routes/wallet.js');
// let restaurantRouter = require('./routes/restaurant.js');
// let delivererRouter = require('./routes/deliverer.js');
// let orderRouter = require('./routes/order.js');
// let itemRouter = require('./routes/item.js');
// let categoryRouter = require('./routes/category.js');

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
// app.use("/restaurants", restaurantRouter);
// app.use("/deliverers", delivererRouter);
// app.use("/items", itemRouter);
// app.use("/categories", categoryRouter);
// app.use("/addresses", addressRouter); // Create model, test and remove this, only accessible through users routes
// app.use("/wallets", walletRouter); 		// Create model, test and remove this, only accessible through users routes
// app.use("/orders", orderRouter);      // Create model, test and remove this, only accessible through users routes

module.exports = app;
