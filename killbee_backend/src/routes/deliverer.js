//TODO: transcript to users.ts

let express = require("express");
let validator = require("validator");
let Deliverer = require('../models/delivererModel');

let router = express.Router();

// GET: all Deliverers or Deliverer by ID or EMAIL
router.get("/", function (req, res, next) {

    let email = req.query.email;
    let id = req.query.id;

    if(id) {
        // Deliverer BY ID
        Deliverer.getDelivererById(id)
            .then((value) => {
                res.json(value);
            })
            .catch(err => {
                res.json(err);
            });
        return;
    }

    if(!email) {
        // ALL Deliverers
        Deliverer.getDeliverers()
        .then((value) => {
            res.json(value);
        })
        .catch(err => {
            console.error(err)
            res.json(err);
        });
    } else {
        // Deliverer BY EMAIL
        Deliverer.getDelivererByEmail(email)
        .then((value) => {
            res.json(value);
        })
        .catch(err => {
            res.json(err);
        });
    }

});

// GET: Deliverer by id
router.get("/:id", function (req, res, next) {
    let id = req.params.id;

    Deliverer.getDelivererById(id)
    .then((value) => {
        res.json(value);
    })
    .catch(err => {
        res.json(err);
    });
});

// POST: Create new Deliverer
router.post("/", async (req, res) => {
    let newDeliverer = new Deliverer(req.body);

    Deliverer.postDeliverer(newDeliverer)
        .then((value) => {
            res.json(value);
        })
        .catch(err => {
            res.json(err);
        });
});

// PUT: Update Deliverer
router.put("/", async (req, res) => {
    Deliverer.updateDeliverer(req.body)
        .then((value) => {
            res.json(value);
        })
        .catch(err => {
            res.json(err);
        });
});

// DELETE: Remove Deliverer by ID only
router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    Deliverer.removeDeliverer(id)
        .then((value) => {
            res.json(value);
        })
        .catch(err => {
            res.json(err);
        });
});

//////////////////// ADDRESSES //////////////////////////////

// Get addresses or one address by DELIVERER Id
router.get("/:id/addresses", function (req, res, next) {
    let idUser = req.params.id; // !!! URL
    let idAddress = req.query.idAddress;  // !!! ?idAddress=....
    if(idUser) {
        if(idAddress) {
            // Specific Address BY User ID
            Deliverer.getAddressByUserId(idUser, idAddress)
                .then((value) => {
                    res.json(value);
                })
                .catch(err => {
                    res.json(err);
                });
            return;
        }

        // Addresses BY User ID
        Deliverer.getAddressesByUserId(idUser)
            .then((value) => {
                res.json(value);
            })
            .catch(err => {
                res.json(err);
            });
        return;
    }
});

// Get address by DELIVERER Id
router.get("/:id/addresses/:idAddress", function (req, res, next) {
    let idUser = req.params.id; // !!! URL
    let idAddress = req.params.idAddress;  // !!! URL
    if(idUser) {
        if(idAddress) {
            // Specific Address BY User ID
            Deliverer.getAddressByUserId(idUser, idAddress)
                .then((value) => {
                    res.json(value);
                })
                .catch(err => {
                    res.json(err);
                });
            return;
        }

        // Addresses BY User ID
        Deliverer.getAddressesByUserId(idUser)
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

// Get wallets or one wallet by DELIVERER Id
router.get("/:id/wallets", function (req, res, next) {
    let idUser = req.params.id; // !!! URL
    let idWallet = req.query.idWallet;  // !!! ?idWallet=....
    if(idUser) {
        if(idWallet) {
            // Specific Wallet BY User ID
            Deliverer.getWalletByUserId(idUser, idWallet)
                .then((value) => {
                    res.json(value);
                })
                .catch(err => {
                    res.json(err);
                });
            return;
        }

        // Wallets BY User ID
        Deliverer.getWalletsByUserId(idUser)
            .then((value) => {
                res.json(value);
            })
            .catch(err => {
                res.json(err);
            });
        return;
    }
});

// Get wallet by DELIVERER Id
router.get("/:id/wallets/:idWallet", function (req, res, next) {
    let idUser = req.params.id; // !!! URL
    let idWallet = req.params.idWallet;  // !!! URL
    if(idUser) {
        if(idWallet) {
            // Specific Wallet BY User ID
            Deliverer.getWalletByUserId(idUser, idWallet)
                .then((value) => {
                    res.json(value);
                })
                .catch(err => {
                    res.json(err);
                });
            return;
        }

        // Wallets BY User ID
        Deliverer.getWalletsByUserId(idUser)
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

// Get orders or one order by DELIVERER Id
router.get("/:id/orders", function (req, res, next) {
    let idUser = req.params.id; // !!! URL
    let idOrder = req.query.idOrder;  // !!! ?idOrder=....
    if(idUser) {
        if(idOrder) {
            // Specific Order BY User ID
            Deliverer.getOrderByUserId(idUser, idOrder)
                .then((value) => {
                    res.json(value);
                })
                .catch(err => {
                    res.json(err);
                });
            return;
        }

        // Orders BY User ID
        Deliverer.getOrdersByUserId(idUser)
            .then((value) => {
                res.json(value);
            })
            .catch(err => {
                res.json(err);
            });
        return;
    }
});

// Get order by DELIVERER Id
router.get("/:id/orders/:idOrder", function (req, res, next) {
    let idUser = req.params.id; // !!! URL
    let idOrder = req.params.idOrder;  // !!! URL
    if(idUser) {
        if(idOrder) {
            // Specific Order BY User ID
            Deliverer.getOrderByUserId(idUser, idOrder)
                .then((value) => {
                    res.json(value);
                })
                .catch(err => {
                    res.json(err);
                });
            return;
        }

        // Orders BY User ID
        Deliverer.getOrdersByUserId(idUser)
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
