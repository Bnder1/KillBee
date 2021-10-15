const mongoose = require('mongoose');
const validator = require('validator');
const timestampPlugin = require('./timestamp');
const cascadePlugin = require('./cascade');

let restaurantSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: (value) => {
      return validator.isEmail(value)
    }
  },
  name: String,
  img: String,
  banner: String,
  ratings: [Number],
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
  orders: [{type: mongoose.Schema.Types.ObjectId, ref: 'order'}],
  categories: [{type: mongoose.Schema.Types.ObjectId, ref: 'category'}],
  items: [{type: mongoose.Schema.Types.ObjectId, ref: 'item'}]
});


// GET Restaurants
restaurantSchema.statics.getRestaurants = async function (filter) {
  return new Promise((resolve, reject) => {
    this.find((err, docs) => {
      if(err) {
        err["error"] = "Unable to get restaurants.";
        return reject(err)
      }
      resolve(docs)
    })
  })
}

// GET RestaurantByEmail
restaurantSchema.statics.getRestaurantByEmail = async function (email) {

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
          "error": "No restaurant found. Please check your email address."
        })
      }
    });
  });
}

// GET RestaurantById
restaurantSchema.statics.getRestaurantById = async function (id) {
  let filter = {
    _id: id
  }
  return new Promise((resolve, reject) => {
    this.findById(filter, (err, docs) => {
      if (docs) {
        resolve(docs)
      } else {
        return reject({
          "error": "No restaurant found. Please check the ID."
        })
      }
    });
  });
}

// POST New Restaurant
restaurantSchema.statics.postRestaurant = async function (object) {
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
          err["error"] = "Unable to create new restaurant, please contact an admin."
          reject(err);
        });
  })
}

// UPDATE Restaurant
restaurantSchema.statics.updateRestaurant = async function (object) {
  let tmpId = object._id;
  let tmpEmail = object.email;

  if(!tmpId && !tmpEmail) {
    // No information to identify the restaurant
    return new Promise((resolve, reject) => {
      return reject ({
        "error": "Please provide a correct email (string) or ID to identify one restaurant."
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
                  "error" : "No restaurant updated, please check if you provide the good email"
                })
              }
              resolve(doc);
          }).catch(err => {
            err["error"] = "Unable to update the restaurant."
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
              "error" : "No restaurant updated, please check if you provide the good ID"
            })
          }
          resolve(doc);
        }).catch(err => {
          err["error"] = "Unable to update the restaurant."
          return reject(err)
    })
  });
}

// DELETE Restaurant
restaurantSchema.statics.removeRestaurant = async function (id) {
  let tmpId = id;
  if(!tmpId) {
    // No information to identify the restaurant
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
                "error" : "No restaurant removed, please check if you provide the good ID"
              })
            }
            resolve(doc);
        }).catch(err => {
          err["error"] = "Unable to remove the restaurant.";
          return reject(err)
        })
    });
  }
}

/*** ADDRESSES FUNCTION ***/
restaurantSchema.statics.getAddressByUserId = async function (idUser, idAddress) {
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
        err["error"] = "Unable to get restaurant's address.";
        return reject(err)
      }
      resolve(doc)
    });
  });
}

restaurantSchema.statics.getAddressesByUserId = async function (idUser) {
  let filter = {
    _id: idUser
  }
  return new Promise((resolve, reject) => {
    this.find(filter)
    .populate("addresses")
    .then((doc, err) => {
      if(err) {
        err["error"] = "Unable to get restaurant's addresses.";
        return reject(err)
      }
      resolve(doc)
    });
  });
}


/*** WALLETS FUNCTION ***/
restaurantSchema.statics.getWalletByUserId = async function (idUser, idWallet) {
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
        err["error"] = "Unable to get restaurant's wallet.";
        return reject(err)
      }
      resolve(doc)
    });
  });
}

restaurantSchema.statics.getWalletsByUserId = async function (idUser) {
  let filter = {
    _id: idUser
  }
  return new Promise((resolve, reject) => {
    this.find(filter)
    .populate("wallets")
    .then((doc, err) => {
      if(err) {
        err["error"] = "Unable to get restaurant's wallets.";
        return reject(err)
      }
      resolve(doc)
    });
  });
}


/*** ORDERS FUNCTION ***/
restaurantSchema.statics.getOrderByUserId = async function (idUser, idOrder) {
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
        err["error"] = "Unable to get restaurant's order.";
        return reject(err)
      }
      resolve(doc)
    });
  });
}

restaurantSchema.statics.getOrdersByUserId = async function (idUser) {
  let filter = {
    _id: idUser
  }
  return new Promise((resolve, reject) => {
    this.find(filter)
    .populate("orders")
    .then((doc, err) => {
      if(err) {
        err["error"] = "Unable to get restaurant's orders.";
        return reject(err)
      }
      resolve(doc)
    });
  });
}


/*** CATEGORIES FUNCTION ***/
restaurantSchema.statics.getCategoryByUserId = async function (idUser, idCategory) {
  let filter = {
    _id: idUser
  }
  return new Promise((resolve, reject) => {
    this.findById(filter)
    .populate({
      path: "categories",
      match: { _id: idCategory }
    })
    .then((doc, err) => {
      if(err) {
        err["error"] = "Unable to get restaurant's category.";
        return reject(err)
      }
      resolve(doc)
    });
  });
}

restaurantSchema.statics.getCategoriesByUserId = async function (idUser) {
  let filter = {
    _id: idUser
  }
  return new Promise((resolve, reject) => {
    this.find(filter)
    .populate("categories")
    .then((doc, err) => {
      if(err) {
        err["error"] = "Unable to get restaurant's categories.";
        return reject(err)
      }
      resolve(doc)
    });
  });
}


/*** ITEMS FUNCTION ***/
restaurantSchema.statics.getItemByUserId = async function (idUser, idItem) {
  let filter = {
    _id: idUser
  }
  return new Promise((resolve, reject) => {
    this.findById(filter)
    .populate({
      path: "items",
      match: { _id: idItem }
    })
    .then((doc, err) => {
      if(err) {
        err["error"] = "Unable to get restaurant's item.";
        return reject(err)
      }
      resolve(doc)
    });
  });
}

restaurantSchema.statics.getItemsByUserId = async function (idUser) {
  let filter = {
    _id: idUser
  }
  return new Promise((resolve, reject) => {
    this.find(filter)
    .populate("items")
    .then((doc, err) => {
      if(err) {
        err["error"] = "Unable to get restaurant's items.";
        return reject(err)
      }
      resolve(doc)
    });
  });
}

/*** MIDDLEWARE ***/
restaurantSchema.plugin(timestampPlugin);
restaurantSchema.plugin(cascadePlugin);

const Restaurant = mongoose.model("restaurant", restaurantSchema, "restaurants");
module.exports = Restaurant;