module.exports = function cascade(schema) {

  schema.pre('findOneAndRemove', function (next) {
    
    const addressModel = require('./addressModel');
    const orderModel = require('./orderModel');
    const walletModel = require('./walletModel');
    
    let userId = this._conditions._id;


    this.model.findOne({ _id : userId }).then((doc, err) => {
      
      let addresses = doc.addresses;
      if(addresses) {
        console.log("Addresses to remove:")
        console.log(addresses)
        addresses.forEach((obj) => {
            console.log("obj")
            console.log(obj)
            addressModel.findByIdAndRemove(
              obj, 
              {
                new: true,                       // return updated doc
                runValidators: true              // validate before update
              }
            );
          });
      }

      let wallets = doc.wallets;
      if(wallets) {
        console.log("Wallets to remove:")
        console.log(wallets)
        wallets.forEach((obj) => {
          walletModel.remove({
            _id: obj
          })
        });
      }

      let orders = doc.orders;
      if(orders) {
        console.log("Orders to remove:")
        console.log(orders)
        orders.forEach((obj) => {
          orderModel.remove({
            _id: obj
          })
        });
      }
      console.log("SUB DOCUMENTS REMOVED ! CALLING NEXT");
      // Call the next function in the pre-save chain
      next() 
    });       
  })

}