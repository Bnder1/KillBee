//TODO: transcript to order.ts

let express = require("express");
let validator = require("validator");
let Order = require('../models/orderModel');

let router = express.Router();

// GET: all Orders or Order by ID
router.get("/", function (req, res, next) {

    let id = req.query.id;

    if(id) {
        // Order BY ID
        Order.getOrderById(id)
            .then((value) => {
                res.json(value);
            })
            .catch(err => {
                res.json(err);
            });
        return;
    }


    // ALL Orders
    Order.getOrders()
    .then((value) => {
        res.json(value);
    })
    .catch(err => {
        console.error(err)
        res.json(err);
    });
    

});

// GET: Order by id
router.get("/:id", function (req, res, next) {
    let id = req.params.id;

    Order.getOrderById(id)
    .then((value) => {
        res.json(value);
    })
    .catch(err => {
        res.json(err);
    });
});

// POST: Create new Order
router.post("/", async (req, res) => {
    let newOrder = new Order(req.body);

    Order.postOrder(newOrder)
        .then((value) => {
            res.json(value);
        })
        .catch(err => {
            res.json(err);
        });
});

// PUT: Update Order
router.put("/", async (req, res) => {
    Order.updateOrder(req.body)
        .then((value) => {
            res.json(value);
        })
        .catch(err => {
            res.json(err);
        });
});

// DELETE: Remove Order by ID only
router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    Order.removeOrder(id)
        .then((value) => {
            res.json(value);
        })
        .catch(err => {
            res.json(err);
        });
});



/////////////////////// ITEMS ///////////////////////////

// Get items or one item by Order Id
router.get("/:id/items", function (req, res, next) {
    let idOrder = req.params.id; // !!! URL
    let idItem = req.query.idItem;  // !!! ?idItem=....
    if(idOrder) {
        if(idItem) {
            // Specific Item BY Order ID
            Order.getItemByOrderId(idOrder, idItem)
                .then((value) => {
                    res.json(value);
                })
                .catch(err => {
                    res.json(err);
                });
            return;
        }

        // Items BY Order ID
        Order.getItemsByOrderId(idOrder)
            .then((value) => {
                res.json(value);
            })
            .catch(err => {
                res.json(err);
            });
        return;
    }
});

// Get item by RESTAURANT Id
router.get("/:id/items/:idItem", function (req, res, next) {
    let idOrder = req.params.id; // !!! URL
    let idItem = req.params.idItem;  // !!! URL
    if(idOrder) {
        if(idItem) {
            // Specific Item BY Order ID
            Order.getItemByOrderId(idOrder, idItem)
                .then((value) => {
                    res.json(value);
                })
                .catch(err => {
                    res.json(err);
                });
            return;
        }

        // Items BY Order ID
        Order.getItemsByOrderId(idOrder)
            .then((value) => {
                res.json(value);
            })
            .catch(err => {
                res.json(err);
            });
        return;
    }
});



module.exports = router;
