const mongoose = require('mongoose');
const validator = require('validator');
const timestampPlugin = require('./timestamp');
const restaurantModel = require('./restaurantModel');

let itemSchema = new mongoose.Schema({
  name: String,
  description: String,
  img: String,
  price: Number,
  ingredients: [String],
  labels: [String],
  ratings: [Number],
  restaurant: {type: mongoose.Schema.Types.ObjectId, ref: 'restaurant'},
});

// GET Items
itemSchema.statics.getItems = async function (filter) {
  return new Promise((resolve, reject) => {
    this.find((err, docs) => {
      if(err) {
        err["error"] = "Unable to get items.";
        return reject(err)
      }
      resolve(docs)
    })
  })
}

// GET ItemById
itemSchema.statics.getItemById = async function (id) {
  let filter = {
    _id: id
  }
  return new Promise((resolve, reject) => {
    this.findById(filter, (err, docs) => {
      if (docs) {
        resolve(docs)
      } else {
        return reject({
          "error": "No item found. Please check the ID."
        })
      }
    });
  });
}

// POST New Item
itemSchema.statics.postItem = async function (object) {

  if(!object.restaurant) {
    // S'il n'y a pas d'owner return error
    return new Promise((resolve, reject) => {
      return reject ({
        "error": "Please provide an ID to identify the restaurant of this item."
      });
    });
  } else {
    let ownerId = object.restaurant;
    let isOneUser = await restaurantModel.findById(ownerId);

    if(!isOneUser) {
      //Si aucun user n'est trouvé.
      return new Promise((resolve, reject) => {
        return reject ({
          "error": "Please provide the good restaurantID for this item."
        });
      });
    }

    let newItemId = null;

    // SAVING NEW ITEM AND GET the new _id
    await object.save()
        .then(doc => {
          newItemId = doc._id;
        }).catch(err => {
          return new Promise((resolve, reject) => {
            return reject ({
              "error": "Unable to create new item, please contact an admin."
            });
          });
        });
    
    return new Promise((resolve, reject) => {
      restaurantModel.findByIdAndUpdate(
        ownerId,
        {$push: {items: newItemId } },
        {
          new: true,                       // return updated doc
          runValidators: true              // validate before update
        }).then(doc => {
          if(!doc) {
            err["error"] = "No restaurant updated, please check if you provide the good ID";
            return reject(err);
          }
        resolve(doc);
        }).catch(err => {
          err["error"] = "Unable to update the restaurant."
          return reject(err);
        });
    });
    
    
  }
}

// UPDATE Item
itemSchema.statics.updateItem = async function (object) {
  let tmpId = object._id;

  if(!tmpId) {
    // No information to identify the item
    return new Promise((resolve, reject) => {
      return reject ({
        "error": "Please provide an ID to identify one specific item."
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
                "error" : "No item updated, please check if you provide the good ID"
              })
            }
            resolve(doc);
          }).catch(err => {
            err["error"] = "Unable to update the item."
            return reject(err)
      })
    });
  }
}

// DELETE Item
itemSchema.statics.removeItem = async function (id) {
  let tmpId = id;
  if(!tmpId) {
    // No information to identify the item
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
                "error" : "No item removed, please check if you provide the good ID"
              });
            }

            //REMOVING ITEM FROM RESTAURANT
            let itemId = doc._id;
            let userId = doc.restaurant;
          
            restaurantModel.findByIdAndUpdate(
              userId,
              { $pull: { items: itemId } },
              {
                safe: true, 
                upsert: true,
                new: true,                       // return updated doc
                runValidators: true              // validate before update
              }).then(docUser => {
                if(!docUser) {
                  err["error"] = "No restaurant updated, the item was orphan";
                  return reject(err);
                }
              }).catch(err => {
                err["error"] = "Unable to update the user after removing item: " + itemId
                return reject(err);
              });
            
            resolve(doc);
        }).catch(err => {
          err["error"] = "Unable to remove the item.";
          return reject(err);
        })
    });
  }
}

/*** MIDDLEWARE ***/
itemSchema.plugin(timestampPlugin);

const Item = mongoose.model("item", itemSchema, "items");
module.exports = Item;