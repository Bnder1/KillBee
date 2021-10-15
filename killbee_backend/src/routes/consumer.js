//TODO: transcript to consumer.ts

let express = require("express");
let validator = require("validator");

let Consumer = require('../models/consumerModel');

let Wallet = require('../models/walletModel');
let Address = require('../models/addressModel');
let Order = require('../models/orderModel');


let router = express.Router();

// GET: all consumers or user by ID or EMAIL
router.get("/", function (req, res, next) {

    let email = req.query.email;
    let id = req.query.id;

    if(id) {
        // CONSUMER BY ID
        Consumer.getConsumerById(id)
            .then((value) => {
                res.json(value);
            })
            .catch(err => {
                res.json(err);
            });
        return;
    }

    if(!email) {
        // ALL CONSUMERS
        Consumer.getConsumers()
        .then((value) => {
            res.json(value);
        })
        .catch(err => {
            console.error(err)
            res.json(err);
        });
    } else {
        // CONSUMER BY EMAIL
        Consumer.getConsumerByEmail(email)
        .then((value) => {
            res.json(value);
        })
        .catch(err => {
            res.json(err);
        });
    }
});

// GET: CONSUMER by id
router.get("/:id", function (req, res, next) {
    let id = req.params.id;

    Consumer.getConsumerById(id)
    .then((value) => {
        res.json(value);
    })
    .catch(err => {
        res.json(err);
    });
});

// POST: Create new CONSUMER
router.post("/", async (req, res) => {
    let newConsumer = new Consumer(req.body);

    Consumer.postConsumer(newConsumer)
        .then((value) => {
            res.json(value);
        })
        .catch(err => {
            res.json(err);
        });
});

// PUT: Update CONSUMER
router.put("/", async (req, res) => {
    Consumer.updateConsumer(req.body)
        .then((value) => {
            res.json(value);
        })
        .catch(err => {
            res.json(err);
        });
});

// DELETE: Remove CONSUMER by ID only
router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    Consumer.removeConsumer(id)
        .then((value) => {
            res.json(value);
        })
        .catch(err => {
            res.json(err);
        });
});

//////////////////// ADDRESSES //////////////////////////////

// Get addresses or one address by CONSUMER Id
router.get("/:id/addresses", function (req, res, next) {
    let idUser = req.params.id; // !!! URL
    let idAddress = req.query.idAddress;  // !!! ?idAddress=....
    if(idUser) {
        if(idAddress) {
            // Specific Address BY User ID
            Consumer.getAddressByUserId(idUser, idAddress)
                .then((value) => {
                    res.json(value);
                })
                .catch(err => {
                    res.json(err);
                });
            return;
        }

        // Addresses BY User ID
        Consumer.getAddressesByUserId(idUser)
            .then((value) => {
                res.json(value);
            })
            .catch(err => {
                res.json(err);
            });
        return;
    }
});

// Get address by CONSUMER Id
router.get("/:id/addresses/:idAddress", function (req, res, next) {
    let idUser = req.params.id; // !!! URL
    let idAddress = req.params.idAddress;  // !!! URL
    if(idUser) {
        if(idAddress) {
            // Specific Address BY User ID
            Consumer.getAddressByUserId(idUser, idAddress)
                .then((value) => {
                    res.json(value);
                })
                .catch(err => {
                    res.json(err);
                });
            return;
        }

        // Addresses BY User ID
        Consumer.getAddressesByUserId(idUser)
            .then((value) => {
                res.json(value);
            })
            .catch(err => {
                res.json(err);
            });
        return;
    }
});

////////////////////// WALLETS ////////////////////////////

// Get wallets or one wallet by CONSUMER Id
router.get("/:id/wallets", function (req, res, next) {
    let idUser = req.params.id; // !!! URL
    let idWallet = req.query.idWallet;  // !!! ?idWallet=....
    if(idUser) {
        if(idWallet) {
            // Specific Wallet BY User ID
            Consumer.getWalletByUserId(idUser, idWallet)
                .then((value) => {
                    res.json(value);
                })
                .catch(err => {
                    res.json(err);
                });
            return;
        }

        // Wallets BY User ID
        Consumer.getWalletsByUserId(idUser)
            .then((value) => {
                res.json(value);
            })
            .catch(err => {
                res.json(err);
            });
        return;
    }
});

// Get wallet by CONSUMER Id
router.get("/:id/wallets/:idWallet", function (req, res, next) {
    let idUser = req.params.id; // !!! URL
    let idWallet = req.params.idWallet;  // !!! URL
    if(idUser) {
        if(idWallet) {
            // Specific Wallet BY User ID
            Consumer.getWalletByUserId(idUser, idWallet)
                .then((value) => {
                    res.json(value);
                })
                .catch(err => {
                    res.json(err);
                });
            return;
        }

        // Wallets BY User ID
        Consumer.getWalletsByUserId(idUser)
            .then((value) => {
                res.json(value);
            })
            .catch(err => {
                res.json(err);
            });
        return;
    }
});


/////////////////////// ORDERS ///////////////////////////

// Get orders or one order by CONSUMER Id
router.get("/:id/orders", function (req, res, next) {
    let idUser = req.params.id; // !!! URL
    let idOrder = req.query.idOrder;  // !!! ?idOrder=....
    if(idUser) {
        if(idOrder) {
            // Specific Order BY User ID
            Consumer.getOrderByUserId(idUser, idOrder)
                .then((value) => {
                    res.json(value);
                })
                .catch(err => {
                    res.json(err);
                });
            return;
        }

        // Orders BY User ID
        Consumer.getOrdersByUserId(idUser)
            .then((value) => {
                res.json(value);
            })
            .catch(err => {
                res.json(err);
            });
        return;
    }
});

// Get order by CONSUMER Id
router.get("/:id/orders/:idOrder", function (req, res, next) {
    let idUser = req.params.id; // !!! URL
    let idOrder = req.params.idOrder;  // !!! URL
    if(idUser) {
        if(idOrder) {
            // Specific Order BY User ID
            Consumer.getOrderByUserId(idUser, idOrder)
                .then((value) => {
                    res.json(value);
                })
                .catch(err => {
                    res.json(err);
                });
            return;
        }

        // Orders BY User ID
        Consumer.getOrdersByUserId(idUser)
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
