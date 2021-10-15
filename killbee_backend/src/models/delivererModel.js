const mongoose = require('mongoose');
const validator = require('validator');
const timestampPlugin = require('./timestamp');
const cascadePlugin = require('./cascade');

let delivererSchema = new mongoose.Schema({
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
delivererSchema.virtual('fullName').get(function() {
  return this.firstName + ' ' + this.lastName
});
delivererSchema.virtual('initials').get(function() {
  return this.firstName[0] + this.lastName[0]
});

// GET Deliverers
delivererSchema.statics.getDeliverers = async function (filter) {
  return new Promise((resolve, reject) => {
    this.find((err, docs) => {
      if(err) {
        err["error"] = "Unable to get deliverers.";
        return reject(err)
      }
      resolve(docs)
    })
  })
}

// GET DelivererByEmail
delivererSchema.statics.getDelivererByEmail = async function (email) {

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
          "error": "No deliverer found. Please check your email address."
        })
      }
    });
  });
}

// GET DelivererById
delivererSchema.statics.getDelivererById = async function (id) {
  let filter = {
    _id: id
  }
  return new Promise((resolve, reject) => {
    this.findById(filter, (err, docs) => {
      if (docs) {
        resolve(docs)
      } else {
        return reject({
          "error": "No deliverer found. Please check the ID."
        })
      }
    });
  });
}

// POST New Deliverer
delivererSchema.statics.postDeliverer = async function (object) {
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
          err["error"] = "Unable to create new deliverer, please contact an admin."
          reject(err);
        });
  })
}

// UPDATE Deliverer
delivererSchema.statics.updateDeliverer = async function (object) {
  let tmpId = object._id;
  let tmpEmail = object.email;

  if(!tmpId && !tmpEmail) {
    // No information to identify the deliverer
    return new Promise((resolve, reject) => {
      return reject ({
        "error": "Please provide a correct email (string) or ID to identify one deliverer."
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
                  "error" : "No deliverer updated, please check if you provide the good email"
                })
              }
              resolve(doc);
          }).catch(err => {
            err["error"] = "Unable to update the deliverer."
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
              "error" : "No deliverer updated, please check if you provide the good ID"
            })
          }
          resolve(doc);
        }).catch(err => {
          err["error"] = "Unable to update the deliverer."
          return reject(err)
    })
  });
}

// DELETE Deliverer
delivererSchema.statics.removeDeliverer = async function (id) {
  let tmpId = id;
  if(!tmpId) {
    // No information to identify the deliverer
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
                "error" : "No deliverer removed, please check if you provide the good ID"
              })
            }
            resolve(doc);
        }).catch(err => {
          err["error"] = "Unable to remove the deliverer.";
          return reject(err)
        })
    });
  }
}


/*** ADDRESSES FUNCTION ***/
delivererSchema.statics.getAddressByUserId = async function (idUser, idAddress) {
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
        err["error"] = "Unable to get deliverer's address.";
        return reject(err)
      }
      resolve(doc)
    });
  });
}

delivererSchema.statics.getAddressesByUserId = async function (idUser) {
  let filter = {
    _id: idUser
  }
  return new Promise((resolve, reject) => {
    this.find(filter)
    .populate("addresses")
    .then((doc, err) => {
      if(err) {
        err["error"] = "Unable to get deliverer's addresses.";
        return reject(err)
      }
      resolve(doc)
    });
  });
}


/*** WALLETS FUNCTION ***/
delivererSchema.statics.getWalletByUserId = async function (idUser, idWallet) {
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
        err["error"] = "Unable to get deliverer's wallet.";
        return reject(err)
      }
      resolve(doc)
    });
  });
}

delivererSchema.statics.getWalletsByUserId = async function (idUser) {
  let filter = {
    _id: idUser
  }
  return new Promise((resolve, reject) => {
    this.find(filter)
    .populate("wallets")
    .then((doc, err) => {
      if(err) {
        err["error"] = "Unable to get deliverer's wallets.";
        return reject(err)
      }
      resolve(doc)
    });
  });
}


/*** ORDERS FUNCTION ***/
delivererSchema.statics.getOrderByUserId = async function (idUser, idOrder) {
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
        err["error"] = "Unable to get deliverer's order.";
        return reject(err)
      }
      resolve(doc)
    });
  });
}

delivererSchema.statics.getOrdersByUserId = async function (idUser) {
  let filter = {
    _id: idUser
  }
  return new Promise((resolve, reject) => {
    this.find(filter)
    .populate("orders")
    .then((doc, err) => {
      if(err) {
        err["error"] = "Unable to get deliverer's orders.";
        return reject(err)
      }
      resolve(doc)
    });
  });
}


/*** MIDDLEWARE ***/
delivererSchema.plugin(timestampPlugin);
delivererSchema.plugin(cascadePlugin);

const Deliverer = mongoose.model("deliverer", delivererSchema, "deliverers");
module.exports = Deliverer;