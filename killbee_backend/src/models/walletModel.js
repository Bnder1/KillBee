const mongoose = require('mongoose');
const validator = require('validator');
const timestampPlugin = require('./timestamp');
const consumerModel = require('./consumerModel');
const restaurantModel = require('./restaurantModel');
const delivererModel = require('./delivererModel');

let walletSchema = new mongoose.Schema({
  method: String,
  card: {
    name: String,
    number: String,
    crypto: String,
    expiration: {
      month: String,
      year: String
    }
  },
  owner: {type: mongoose.Schema.Types.ObjectId, refPath: 'ownerType'},
  ownerType: {
    type: String,
    required: true,
    enum: ["restaurant", "consumer", "deliverer"]
  }
});

// GET Wallets
walletSchema.statics.getWallets = async function (filter) {
  return new Promise((resolve, reject) => {
    this.find((err, docs) => {
      if(err) {
        err["error"] = "Unable to get wallets.";
        return reject(err)
      }
      resolve(docs)
    })
  })
}

// GET AddressById
walletSchema.statics.getWalletById = async function (id) {
  let filter = {
    _id: id
  }
  return new Promise((resolve, reject) => {
    this.findById(filter, (err, docs) => {
      if (docs) {
        resolve(docs)
      } else {
        return reject({
          "error": "No wallet found. Please check the ID."
        })
      }
    });
  });
}

// POST New Wallet
walletSchema.statics.postWallet = async function (object) {

  if(!object.owner && !object.ownerType) {
    // S'il n'y a pas d'owner return error
    return new Promise((resolve, reject) => {
      return reject ({
        "error": "Please provide an ID to identify the owner of this wallet."
      });
    });
  } else {
    let ownerId = object.owner;
    let ownerType = object.ownerType;
    let isOneUser = null;

    if(ownerType == "consumer") {
      isOneUser = await consumerModel.findById(ownerId);
    } else if(ownerType == "restaurant") {
      isOneUser = await restaurantModel.findById(ownerId);
    } else if(ownerType == "deliverer") {
      isOneUser = await delivererModel.findById(ownerId);
    }

    if(ownerType != "consumer" && ownerType != "restaurant" && ownerType != "deliverer" || !isOneUser) {
      //Si l'owner type ne correspond à rien ou qu'aucun user n'est trouvé.
      return new Promise((resolve, reject) => {
        return reject ({
          "error": "Please provide the good owner type or userID for this wallet."
        });
      });
    }

    let newWalletId = null;

    // SAVING NEW WALLET AND GET the new _id
    await object.save()
        .then(doc => {
          newWalletId = doc._id;
        }).catch(err => {
          return new Promise((resolve, reject) => {
            return reject ({
              "error": "Unable to create new wallet, please contact an admin."
            });
          });
        });

    if(ownerType == "consumer") {
      return new Promise((resolve, reject) => {
        consumerModel.findByIdAndUpdate(
          ownerId,
          {$push: {wallets: newWalletId } },
          {
            new: true,                       // return updated doc
            runValidators: true              // validate before update
          }).then(doc => {
            if(!doc) {
              err["error"] = "No consumer updated, please check if you provide the good ID";
              return reject(err);
            }
          resolve(doc);
          }).catch(err => {
            err["error"] = "Unable to update the consumer."
            return reject(err);
          });
      });
    }
    else if(ownerType == "restaurant") {
      return new Promise((resolve, reject) => {
        restaurantModel.findByIdAndUpdate(
          ownerId,
          {$push: {wallets: newWalletId } },
          {
            new: true,                       // return updated doc
            runValidators: true              // validate before update
          }).then(doc => {
            if(!doc) {
              err["error"] = "No consumer updated, please check if you provide the good ID";
              return reject(err);
            }
          resolve(doc);
          }).catch(err => {
            err["error"] = "Unable to update the restaurant."
            return reject(err);
          });
      });
    }
    else if(ownerType == "deliverer") {
      return new Promise((resolve, reject) => {
        delivererModel.findByIdAndUpdate(
          ownerId,
          {$push: {wallets: newWalletId } },
          {
            new: true,                       // return updated doc
            runValidators: true              // validate before update
          }).then(doc => {
            if(!doc) {
              err["error"] = "No consumer updated, please check if you provide the good ID";
              return reject(err);
            }
          resolve(doc);
          }).catch(err => {
            err["error"] = "Unable to update the deliverer."
            return reject(err);
          });
      });
    }   
  }
}

// UPDATE Wallet
walletSchema.statics.updateWallet = async function (object) {
  let tmpId = object._id;

  if(!tmpId) {
    // No information to identify the wallet
    return new Promise((resolve, reject) => {
      return reject ({
        "error": "Please provide an ID to identify one specific wallet."
      });
    });
  } else {
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
                "error" : "No wallet updated, please check if you provide the good ID"
              })
            }
            resolve(doc);
          }).catch(err => {
            err["error"] = "Unable to update the wallet."
            return reject(err)
      })
    });
  }
}

// DELETE Wallet
walletSchema.statics.removeWallet = async function (id) {
  let tmpId = id;
  if(!tmpId) {
    // No information to identify the wallet
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
                "error" : "No wallet removed, please check if you provide the good ID"
              });
            }

            //REMOVING WALLET FROM USER
            let walletId = doc._id;
            let userId = doc.owner;
            let type = doc.ownerType;

            if(type == "consumer") {
              consumerModel.findByIdAndUpdate(
                userId,
                { $pull: { wallets: walletId } },
                {
                  safe: true, 
                  upsert: true,
                  new: true,                       // return updated doc
                  runValidators: true              // validate before update
                }).then(docUser => {
                  if(!docUser) {
                    err["error"] = "No consumer updated, the wallet was orphan";
                    return reject(err);
                  }
                }).catch(err => {
                  err["error"] = "Unable to update the user after removing wallet: " + walletId
                  return reject(err);
                });
            } else if(type == "deliverer") {
              delivererModel.findByIdAndUpdate(
                userId,
                { $pull: { wallets: walletId } },
                {
                  safe: true, 
                  upsert: true,
                  new: true,                       // return updated doc
                  runValidators: true              // validate before update
                }).then(docUser => {
                  if(!docUser) {
                    err["error"] = "No consumer updated, the wallet was orphan";
                    return reject(err);
                  }
                }).catch(err => {
                  err["error"] = "Unable to update the user after removing wallet: " + walletId
                  return reject(err);
                });
            } else if(type == "restaurant") {
              restaurantModel.findByIdAndUpdate(
                userId,
                { $pull: { wallets: walletId } },
                {
                  safe: true, 
                  upsert: true,
                  new: true,                       // return updated doc
                  runValidators: true              // validate before update
                }).then(docUser => {
                  if(!docUser) {
                    err["error"] = "No consumer updated, the wallet was orphan";
                    return reject(err);
                  }
                }).catch(err => {
                  err["error"] = "Unable to update the user after removing wallet: " + addressId
                  return reject(err);
                });
            }
            resolve(doc);
        }).catch(err => {
          err["error"] = "Unable to remove the wallet.";
          return reject(err);
        })
    });
  }
}

/*** MIDDLEWARE ***/
walletSchema.plugin(timestampPlugin);

const Wallet = mongoose.model("wallet", walletSchema, "wallets");
module.exports = Wallet;