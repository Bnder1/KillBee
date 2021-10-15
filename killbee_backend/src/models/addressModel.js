const mongoose = require('mongoose');
const validator = require('validator');
const timestampPlugin = require('./timestamp');
const consumerModel = require('./consumerModel');
const restaurantModel = require('./restaurantModel');
const delivererModel = require('./delivererModel');

let addressSchema = new mongoose.Schema({
  postalCode: String,
  street: String,
  city: String,
  country: String,
  defaultDelivery: Boolean,
  defaultBilling: Boolean,
  owner: {type: mongoose.Schema.Types.ObjectId, refPath: 'ownerType'},
  ownerType: {
    type: String,
    required: true,
    enum: ["restaurant", "consumer", "deliverer"]
  }
});

// GET Addresses
addressSchema.statics.getAddresses = async function (filter) {
  return new Promise((resolve, reject) => {
    this.find((err, docs) => {
      if(err) {
        err["error"] = "Unable to get addresses.";
        return reject(err)
      }
      resolve(docs)
    })
  })
}

// GET AddressById
addressSchema.statics.getAddressById = async function (id) {
  let filter = {
    _id: id
  }
  return new Promise((resolve, reject) => {
    this.findById(filter, (err, docs) => {
      if (docs) {
        resolve(docs)
      } else {
        return reject({
          "error": "No address found. Please check the ID."
        })
      }
    });
  });
}

// POST New Address
addressSchema.statics.postAddress = async function (object) {

  if(!object.owner && !object.ownerType) {
    // S'il n'y a pas d'owner return error
    return new Promise((resolve, reject) => {
      return reject ({
        "error": "Please provide an ID to identify the owner of this address."
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
          "error": "Please provide the good owner type or userID for this address."
        });
      });
    }

    let newAddressId = null;

    // SAVING NEW ADDRESS AND GET the new _id
    await object.save()
        .then(doc => {
          newAddressId = doc._id;
        }).catch(err => {
          return new Promise((resolve, reject) => {
            return reject ({
              "error": "Unable to create new address, please contact an admin."
            });
          });
        });

    if(ownerType == "consumer") {
      return new Promise((resolve, reject) => {
        consumerModel.findByIdAndUpdate(
          ownerId,
          {$push: {addresses: newAddressId } },
          {
            new: true,                       // return updated doc
            runValidators: true              // validate before update
          }).then(doc => {
            if(!doc) {
              //this.removeAddress(newAddressId); // if unable to update user, remove the new created address and reject promesse
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
          {$push: {addresses: newAddressId } },
          {
            new: true,                       // return updated doc
            runValidators: true              // validate before update
          }).then(doc => {
            if(!doc) {
              //this.removeAddress(newAddressId); // if unable to update user, remove the new created address and reject promesse
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
          {$push: {addresses: newAddressId } },
          {
            new: true,                       // return updated doc
            runValidators: true              // validate before update
          }).then(doc => {
            if(!doc) {
              //this.removeAddress(newAddressId); // if unable to update user, remove the new created address and reject promesse
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

// UPDATE Address
addressSchema.statics.updateAddress = async function (object) {
  let tmpId = object._id;

  if(!tmpId) {
    // No information to identify the address
    return new Promise((resolve, reject) => {
      return reject ({
        "error": "Please provide an ID to identify one specific address."
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
                "error" : "No address updated, please check if you provide the good ID"
              })
            }
            resolve(doc);
          }).catch(err => {
            err["error"] = "Unable to update the address."
            return reject(err)
      })
    });
  }
}

// DELETE Address
addressSchema.statics.removeAddress = async function (id) {
  let tmpId = id;
  if(!tmpId) {
    // No information to identify the address
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
                "error" : "No address removed, please check if you provide the good ID"
              });
            }

            //REMOVING ADDRESS FROM USER
            let addressId = doc._id;
            let userId = doc.owner;
            let type = doc.ownerType;

            if(type == "consumer") {
              consumerModel.findByIdAndUpdate(
                userId,
                { $pull: { addresses: addressId } },
                {
                  safe: true, 
                  upsert: true,
                  new: true,                       // return updated doc
                  runValidators: true              // validate before update
                }).then(docUser => {
                  if(!docUser) {
                    err["error"] = "No consumer updated, the address was orphan";
                    return reject(err);
                  }
                }).catch(err => {
                  err["error"] = "Unable to update the user after removing address: " + addressId
                  return reject(err);
                });
            } else if(type == "deliverer") {
              delivererModel.findByIdAndUpdate(
                userId,
                { $pull: { addresses: addressId } },
                {
                  safe: true, 
                  upsert: true,
                  new: true,                       // return updated doc
                  runValidators: true              // validate before update
                }).then(docUser => {
                  if(!docUser) {
                    err["error"] = "No consumer updated, the address was orphan";
                    return reject(err);
                  }
                }).catch(err => {
                  err["error"] = "Unable to update the user after removing address: " + addressId
                  return reject(err);
                });
            } else if(type == "restaurant") {
              restaurantModel.findByIdAndUpdate(
                userId,
                { $pull: { addresses: addressId } },
                {
                  safe: true, 
                  upsert: true,
                  new: true,                       // return updated doc
                  runValidators: true              // validate before update
                }).then(docUser => {
                  if(!docUser) {
                    err["error"] = "No consumer updated, the address was orphan";
                    return reject(err);
                  }
                }).catch(err => {
                  err["error"] = "Unable to update the user after removing address: " + addressId
                  return reject(err);
                });
            }
            resolve(doc);
        }).catch(err => {
          err["error"] = "Unable to remove the address.";
          return reject(err);
        })
    });
  }
}

/*** MIDDLEWARE ***/
addressSchema.plugin(timestampPlugin);

const Address = mongoose.model("address", addressSchema, "addresses");
module.exports = Address;