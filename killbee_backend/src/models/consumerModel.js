const mongoose = require('mongoose');
const validator = require('validator');
const timestampPlugin = require('./timestamp');
const cascadePlugin = require('./cascade');

let consumerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: (value) => {
      return validator.isEmail(value)
    }
  },
  firstName: String,
  lastName: String,
  phoneNumber: String,
  role: {
    type: String,
    default: "user"
  },
  password : String,
  sqlId: {
    type: Number
  },
  settings: [{ name: String, value: String }],
  addresses: [{type: mongoose.Schema.Types.ObjectId, ref: 'address'}],
  wallets: [{type: mongoose.Schema.Types.ObjectId, ref: 'wallet'}],
  orders: [{type: mongoose.Schema.Types.ObjectId, ref: 'order'}]
});

// Virtual property GET
consumerSchema.virtual('fullName').get(function() {
  return this.firstName + ' ' + this.lastName
});
consumerSchema.virtual('initials').get(function() {
  return this.firstName[0] + this.lastName[0]
});


// GET Consumers
consumerSchema.statics.getConsumers = async function (filter) {
  return new Promise((resolve, reject) => {
    this.find((err, docs) => {
      if(err) {
        err["error"] = "Unable to get consumers.";
        return reject(err)
      }
      resolve(docs)
    })
  })
}

// GET ConsumerByEmail
consumerSchema.statics.getConsumerByEmail = async function (email) {

  if(!validator.isEmail(email)) {
    return new Promise((resolve, reject) => {
        return reject ({
          "error": "Please provide a correct email (string)"
        });
    });
  }

  let filter = {
    email: email
  }

  return new Promise((resolve, reject) => {
    this.findOne(filter, (err, docs) => {
      if (docs) {
        resolve(docs)
      } else {
        return reject({
          "error": "No consumer found. Please check your email address."
        })
      }
    });
  });
}

// GET ConsumerById
consumerSchema.statics.getConsumerById = async function (id) {
  let filter = {
    _id: id
  }
  return new Promise((resolve, reject) => {
    this.findById(filter, (err, docs) => {
      if (docs) {
        resolve(docs)
      } else {
        return reject({
          "error": "No consumer found. Please check the ID."
        })
      }
    });
  });
}

// POST New Consumer
consumerSchema.statics.postConsumer = async function (object) {
  let tmpEmail = object.email;
  let tmp = await this.findOne( { email: tmpEmail });
  
  if(tmp) {
    return new Promise((resolve, reject) => {
      return reject ({
        "error": "Email already registered, please sign in."
      });
    });
  }

  return new Promise((resolve, reject) => {
    object.save()
        .then(doc => {
          resolve(doc);
        }).catch(err => {
          err["error"] = "Unable to create new consumer, please contact an admin."
          reject(err);
        });
  });
}

// UPDATE Consumer
consumerSchema.statics.updateConsumer = async function (object) {
  let tmpId = object._id;
  let tmpEmail = object.email;

  if(!tmpId && !tmpEmail) {
    // No information to identify the consumer
    return new Promise((resolve, reject) => {
      return reject ({
        "error": "Please provide a correct email (string) or ID to identify one consumer."
      });
    });
  }

  if(!tmpId) {
    // Searching by email
    return new Promise((resolve, reject) => {
      this.findOneAndUpdate(
          { email: object.email },
          object,
          {
            new: true,                       // return updated doc
            runValidators: true              // validate before update
          }).then(doc => {
              if(!doc) {
                return reject({
                  "error" : "No consumer updated, please check if you provide the good email"
                })
              }
              resolve(doc);
          }).catch(err => {
            err["error"] = "Unable to update the consumer."
            return reject(err)
          })
    });
  }
  // Searching by id
  return new Promise((resolve, reject) => {
    this.findByIdAndUpdate(
        tmpId,
        object,
        {
          new: true,                       // return updated doc
          runValidators: true              // validate before update
        }).then(doc => {
          if(!doc) {
            return reject({
              "error" : "No consumer updated, please check if you provide the good ID"
            })
          }
          resolve(doc);
        }).catch(err => {
          err["error"] = "Unable to update the consumer."
          return reject(err)
        })
  });
}

// DELETE Consumer
consumerSchema.statics.removeConsumer = async function (id) {
  let tmpId = id;
  if(!tmpId) {
    // No information to identify the consumer
    return new Promise((resolve, reject) => {
      return reject ({
        "error": "Please provide an ID to remove."
      });
    });
  } else {
    // Searching by ID
    return new Promise((resolve, reject) => {
      this.findByIdAndRemove(
        tmpId,
        {
          new: true,                       // return updated doc
          runValidators: true              // validate before update
        }).then(doc => {
            if(!doc) {
              return reject({
                "error" : "No consumer removed, please check if you provide the good ID"
              })
            }
            resolve(doc);
        }).catch(err => {
          err["error"] = "Unable to remove the consumer.";
          return reject(err)
        });
    });
  }
}

/*** ADDRESSES FUNCTION ***/
consumerSchema.statics.getAddressByUserId = async function (idUser, idAddress) {
  let filter = {
    _id: idUser
  }
  return new Promise((resolve, reject) => {
    this.findById(filter)
    .populate({
      path: "addresses",
      match: { _id: idAddress },
      //select: "postalCode street city country defaultDelivery defaultBilling"
    })
    .then((doc, err) => {
      if(err) {
        err["error"] = "Unable to get consumer's address.";
        return reject(err)
      }
      resolve(doc)
    });
  });
}

consumerSchema.statics.getAddressesByUserId = async function (idUser) {
  let filter = {
    _id: idUser
  }
  return new Promise((resolve, reject) => {
    this.find(filter)
    .populate("addresses")
    .then((doc, err) => {
      if(err) {
        err["error"] = "Unable to get consumer's addresses.";
        return reject(err)
      }
      resolve(doc)
    });
  });
}


/*** WALLETS FUNCTION ***/
consumerSchema.statics.getWalletByUserId = async function (idUser, idWallet) {
  let filter = {
    _id: idUser
  }
  return new Promise((resolve, reject) => {
    this.findById(filter)
    .populate({
      path: "wallets",
      match: { _id: idWallet }
    })
    .then((doc, err) => {
      if(err) {
        err["error"] = "Unable to get consumer's wallet.";
        return reject(err)
      }
      resolve(doc)
    });
  });
}

consumerSchema.statics.getWalletsByUserId = async function (idUser) {
  let filter = {
    _id: idUser
  }
  return new Promise((resolve, reject) => {
    this.find(filter)
    .populate("wallets")
    .then((doc, err) => {
      if(err) {
        err["error"] = "Unable to get consumer's wallets.";
        return reject(err)
      }
      resolve(doc)
    });
  });
}


/*** ORDERS FUNCTION ***/
consumerSchema.statics.getOrderByUserId = async function (idUser, idOrder) {
  let filter = {
    _id: idUser
  }
  return new Promise((resolve, reject) => {
    this.findById(filter)
    .populate({
      path: "orders",
      match: { _id: idOrder }
    })
    .then((doc, err) => {
      if(err) {
        err["error"] = "Unable to get consumer's order.";
        return reject(err)
      }
      resolve(doc)
    });
  });
}

consumerSchema.statics.getOrdersByUserId = async function (idUser) {
  let filter = {
    _id: idUser
  }
  return new Promise((resolve, reject) => {
    this.find(filter)
    .populate("orders")
    .then((doc, err) => {
      if(err) {
        err["error"] = "Unable to get consumer's orders.";
        return reject(err)
      }
      resolve(doc)
    });
  });
}

/*** MIDDLEWARE ***/
consumerSchema.plugin(timestampPlugin);
consumerSchema.plugin(cascadePlugin);

const Consumer = mongoose.model("consumer", consumerSchema, "consumers");

module.exports = Consumer;