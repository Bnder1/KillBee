const mongoose = require('mongoose');
const validator = require('validator');
const timestampPlugin = require('./timestamp');
const consumerModel = require('./consumerModel');
const restaurantModel = require('./restaurantModel');
const delivererModel = require('./delivererModel');
const addressModel = require('./addressModel');
const walletModel = require('./walletModel');
const itemModel = require('./itemModel');

let orderSchema = new mongoose.Schema({
  orderNotes: String,
  deliveryNotes: String,
  shipment: Number,
  timestamps: {
    accepted: { type: Number, default: null },
    orderPicked: { type: Number, default: null }
  },
  status: String,
  items: [{type: mongoose.Schema.Types.ObjectId, ref: 'item'}],
  consumer: {type: mongoose.Schema.Types.ObjectId, ref: 'consumer'},
  restaurant: {type: mongoose.Schema.Types.ObjectId, ref: 'restaurant'},
  deliveryAddress: {type: mongoose.Schema.Types.ObjectId, ref: 'address'},
  paymentMethod: {type: mongoose.Schema.Types.ObjectId, ref: 'wallet'},
  deliverer: {type: mongoose.Schema.Types.ObjectId, ref: 'deliverer'},
});

// GET Orders
orderSchema.statics.getOrders = async function (filter) {
  return new Promise((resolve, reject) => {
    this.find((err, docs) => {
      if(err) {
        err["error"] = "Unable to get orders.";
        return reject(err)
      }
      resolve(docs)
    })
  })
}

// GET OrderById
orderSchema.statics.getOrderById = async function (id) {
  let filter = {
    _id: id
  }
  return new Promise((resolve, reject) => {
    this.findById(filter, (err, docs) => {
      if (docs) {
        resolve(docs)
      } else {
        return reject({
          "error": "No orders found. Please check the ID."
        })
      }
    });
  });
}

// POST New Order
orderSchema.statics.postOrder = async function (object) {

  if(!object.items) {
    // S'il n'y a pas d'idConsumer et d'idRestaurant return error
    return new Promise((resolve, reject) => {
      return reject ({
        "error": "The order has no items ! What are you buying?"
      });
    });
  } else if(!object.consumer && !object.restaurant) {
      // S'il n'y a pas d'idConsumer et d'idRestaurant return error
      return new Promise((resolve, reject) => {
        return reject ({
          "error": "Please provide two IDs (consumer and restaurant) to identify order."
        });
      });
  } else {

    let consumerId = object.consumer;
    let restaurantId = object.restaurant;

    let isOneConsumer = await consumerModel.findById(consumerId);
    let isOneRestaurant = await restaurantModel.findById(restaurantId);

    if(!isOneConsumer && !isOneRestaurant) {
      //Si aucun user (consumer ou restaurant) n'est trouvé.
      return new Promise((resolve, reject) => {
        return reject ({
          "error": "Please provide the good consumerID and restaurantID for this order."
        });
      });
    }

    let newOrderId = null;

    // SAVING NEW ORDER AND GET the new _id
    await object.save()
        .then(doc => {
          newOrderId = doc._id;
        }).catch(err => {
          return new Promise((resolve, reject) => {
            return reject ({
              "error": "Unable to create new order, please contact an admin."
            });
          });
        });
    
    return new Promise((resolve, reject) => {
      consumerModel.findByIdAndUpdate(
        consumerId,
        {$push: {orders: newOrderId } },
        {
          new: true,                       // return updated doc
          runValidators: true              // validate before update
        }).then(doc => {
          if(!doc) {
            err["error"] = "No consumer updated, please check if you provide the good ID";
            return reject(err);
          }
          restaurantModel.findByIdAndUpdate(
            restaurantId,
            {$push: {orders: newOrderId } },
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
        }).catch(err => {
          err["error"] = "Unable to update the consumer."
          return reject(err);
        });
    });
  }
}

// UPDATE Order
orderSchema.statics.updateOrder = async function (object) {
  let tmpId = object._id;

  if(!tmpId) {
    // No information to identify the order
    return new Promise((resolve, reject) => {
      return reject ({
        "error": "Please provide an ID to identify one specific order."
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
                "error" : "No order updated, please check if you provide the good ID"
              })
            }
            resolve(doc);
          }).catch(err => {
            err["error"] = "Unable to update the order."
            return reject(err)
      })
    });
  }
}

// DELETE Order
orderSchema.statics.removeOrder = async function (id) {
  let tmpId = id;
  if(!tmpId) {
    // No information to identify the order
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
                "error" : "No order removed, please check if you provide the good ID"
              });
            }

            //REMOVING ORDER FROM USER
            let orderId = doc._id;
            let consumerId = doc.consumer;
            let restaurantId = doc.restaurant;
            let delivererId = doc.deliverer;

            
            consumerModel.findByIdAndUpdate(
              consumerId,
              { $pull: { orders: orderId } },
              {
                safe: true, 
                upsert: true,
                new: true,                       // return updated doc
                runValidators: true              // validate before update
              }).then(docUser => {
                if(!docUser) {
                  err["error"] = "No consumer updated, the order was orphan";
                  return reject(err);
                }


                restaurantModel.findByIdAndUpdate(
                  restaurantId,
                  { $pull: { orders: orderId } },
                  {
                    safe: true, 
                    upsert: true,
                    new: true,                       // return updated doc
                    runValidators: true              // validate before update
                  }).then(docUser => {
                    if(!docUser) {
                      err["error"] = "No restaurant updated, the order was orphan";
                      return reject(err);
                    }


                    delivererModel.findByIdAndUpdate(
                      delivererId,
                      { $pull: { orders: orderId } },
                      {
                        safe: true, 
                        upsert: true,
                        new: true,                       // return updated doc
                        runValidators: true              // validate before update
                      }).then(docUser => {
                        if(!docUser) {
                          err["error"] = "No deliverer updated, the order was orphan";
                          return reject(err);
                        }
                      }).catch(err => {
                        err["error"] = "Unable to update the user after removing order: " + orderId
                        return reject(err);
                      });


                  }).catch(err => {
                    err["error"] = "Unable to update the user after removing order: " + orderId
                    return reject(err);
                  });


              }).catch(err => {
                err["error"] = "Unable to update the user after removing order: " + orderId
                return reject(err);
              });

            resolve(doc);
        }).catch(err => {
          err["error"] = "Unable to remove the order.";
          return reject(err);
        })
    });
  }
}

/*** ITEMS FUNCTION ***/
orderSchema.statics.getItemByOrderId = async function (idOrder, idItem) {
  let filter = {
    _id: idOrder
  }
  return new Promise((resolve, reject) => {
    this.findById(filter)
    .populate({
      path: "items",
      match: { _id: idItem }
    })
    .then((doc, err) => {
      if(err) {
        err["error"] = "Unable to get order's item.";
        return reject(err)
      }
      resolve(doc)
    });
  });
}

orderSchema.statics.getItemsByOrderId = async function (idOrder) {
  let filter = {
    _id: idOrder
  }
  return new Promise((resolve, reject) => {
    this.find(filter)
    .populate("items")
    .then((doc, err) => {
      if(err) {
        err["error"] = "Unable to get order's items.";
        return reject(err)
      }
      resolve(doc)
    });
  });
}

/*** MIDDLEWARE ***/
orderSchema.plugin(timestampPlugin);

const Order = mongoose.model("order", orderSchema, "orders");
module.exports = Order;