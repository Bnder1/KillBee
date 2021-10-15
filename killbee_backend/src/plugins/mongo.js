let mongoose = require("mongoose");

class Mongo {
  
  constructor() {
    this._connect()
  }

  _connect() {
    mongoose.connection.close();
    mongoose.connect("mongodb://" + process.env.URL_NOSQL + "/" + process.env.DB_NAME_NOSQL, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      "auth": { "authSource": "admin" },
      "user": process.env.USERNAME_NOSQL,
      "pass": process.env.PASSWORD_NOSQL
      })
      .then(() => {
        console.log('Database connection successful\n');
      })
      .catch(err => {
        console.error('Database connection error:\n' + err);
      })
  }

}

module.exports = new Mongo()