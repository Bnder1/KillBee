//TODO: transcript to restaurant.ts

let express = require("express");
let validator = require("validator");
let Restaurant = require('../models/restaurantModel');

let router = express.Router();

// GET: all restaurants or restaurant by ID or EMAIL
router.get("/", function (req, res, next) {

    let email = req.query.email;
    let id = req.query.id;

    if(id) {
        // Restaurant BY ID
        Restaurant.getRestaurantById(id)
            .then((value) => {
                res.json(value);
            })
            .catch(err => {
                res.json(err);
            });
        return;
    }

    if(!email) {
        // ALL Restaurants
        Restaurant.getRestaurants()
        .then((value) => {
            res.json(value);
        })
        .catch(err => {
            console.error(err)
            res.json(err);
        });
    } else {
        // Restaurant BY EMAIL
        Restaurant.getRestaurantByEmail(email)
        .then((value) => {
            res.json(value);
        })
        .catch(err => {
            res.json(err);
        });
    }

});

// GET: restaurant by id
router.get("/:id", function (req, res, next) {
    let id = req.params.id;

    Restaurant.getRestaurantById(id)
    .then((value) => {
        res.json(value);
    })
    .catch(err => {
        res.json(err);
    });
});

// POST: Create new Restaurant
router.post("/", async (req, res) => {
    let newRestaurant = new Restaurant(req.body);

    Restaurant.postRestaurant(newRestaurant)
        .then((value) => {
            res.json(value);
        })
        .catch(err => {
            res.json(err);
        });
});

// PUT: Update Restaurant
router.put("/", async (req, res) => {
    Restaurant.updateRestaurant(req.body)
        .then((value) => {
            res.json(value);
        })
        .catch(err => {
            res.json(err);
        });
});

// DELETE: Remove Restaurant by ID only
router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    Restaurant.removeRestaurant(id)
        .then((value) => {
            res.json(value);
        })
        .catch(err => {
            res.json(err);
        });
});


//////////////////// ADDRESSES //////////////////////////////

// Get addresses or one address by RESTAURANT Id
router.get("/:id/addresses", function (req, res, next) {
    let idUser = req.params.id; // !!! URL
    let idAddress = req.query.idAddress;  // !!! ?idAddress=....
    if(idUser) {
        if(idAddress) {
            // Specific Address BY User ID
            Restaurant.getAddressByUserId(idUser, idAddress)
                .then((value) => {
                    res.json(value);
                })
                .catch(err => {
                    res.json(err);
                });
            return;
        }

        // Addresses BY User ID
        Restaurant.getAddressesByUserId(idUser)
            .then((value) => {
                res.json(value);
            })
            .catch(err => {
                res.json(err);
            });
        return;
    }
});

// Get address by RESTAURANT Id
router.get("/:id/addresses/:idAddress", function (req, res, next) {
    let idUser = req.params.id; // !!! URL
    let idAddress = req.params.idAddress;  // !!! URL
    if(idUser) {
        if(idAddress) {
            // Specific Address BY User ID
            Restaurant.getAddressByUserId(idUser, idAddress)
                .then((value) => {
                    res.json(value);
                })
                .catch(err => {
                    res.json(err);
                });
            return;
        }

        // Addresses BY User ID
        Restaurant.getAddressesByUserId(idUser)
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

// Get wallets or one wallet by RESTAURANT Id
router.get("/:id/wallets", function (req, res, next) {
    let idUser = req.params.id; // !!! URL
    let idWallet = req.query.idWallet;  // !!! ?idWallet=....
    if(idUser) {
        if(idWallet) {
            // Specific Wallet BY User ID
            Restaurant.getWalletByUserId(idUser, idWallet)
                .then((value) => {
                    res.json(value);
                })
                .catch(err => {
                    res.json(err);
                });
            return;
        }

        // Wallets BY User ID
        Restaurant.getWalletsByUserId(idUser)
            .then((value) => {
                res.json(value);
            })
            .catch(err => {
                res.json(err);
            });
        return;
    }
});

// Get wallet by RESTAURANT Id
router.get("/:id/wallets/:idWallet", function (req, res, next) {
    let idUser = req.params.id; // !!! URL
    let idWallet = req.params.idWallet;  // !!! URL
    if(idUser) {
        if(idWallet) {
            // Specific Wallet BY User ID
            Restaurant.getWalletByUserId(idUser, idWallet)
                .then((value) => {
                    res.json(value);
                })
                .catch(err => {
                    res.json(err);
                });
            return;
        }

        // Wallets BY User ID
        Restaurant.getWalletsByUserId(idUser)
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

// Get orders or one order by RESTAURANT Id
router.get("/:id/orders", function (req, res, next) {
    let idUser = req.params.id; // !!! URL
    let idOrder = req.query.idOrder;  // !!! ?idOrder=....
    if(idUser) {
        if(idOrder) {
            // Specific Order BY User ID
            Restaurant.getOrderByUserId(idUser, idOrder)
                .then((value) => {
                    res.json(value);
                })
                .catch(err => {
                    res.json(err);
                });
            return;
        }

        // Orders BY User ID
        Restaurant.getOrdersByUserId(idUser)
            .then((value) => {
                res.json(value);
            })
            .catch(err => {
                res.json(err);
            });
        return;
    }
});

// Get order by RESTAURANT Id
router.get("/:id/orders/:idOrder", function (req, res, next) {
    let idUser = req.params.id; // !!! URL
    let idOrder = req.params.idOrder;  // !!! URL
    if(idUser) {
        if(idOrder) {
            // Specific Order BY User ID
            Restaurant.getOrderByUserId(idUser, idOrder)
                .then((value) => {
                    res.json(value);
                })
                .catch(err => {
                    res.json(err);
                });
            return;
        }

        // Orders BY User ID
        Restaurant.getOrdersByUserId(idUser)
            .then((value) => {
                res.json(value);
            })
            .catch(err => {
                res.json(err);
            });
        return;
    }
});

/////////////////////// CATEGORIES ///////////////////////////

// Get categories or one category by RESTAURANT Id
router.get("/:id/categories", function (req, res, next) {
    let idUser = req.params.id; // !!! URL
    let idCategory = req.query.idCategory;  // !!! ?idCategory=....
    if(idUser) {
        if(idCategory) {
            // Specific Category BY User ID
            Restaurant.getCategoryByUserId(idUser, idCategory)
                .then((value) => {
                    res.json(value);
                })
                .catch(err => {
                    res.json(err);
                });
            return;
        }

        // Categories BY User ID
        Restaurant.getCategoriesByUserId(idUser)
            .then((value) => {
                res.json(value);
            })
            .catch(err => {
                res.json(err);
            });
        return;
    }
});

// Get category by RESTAURANT Id
router.get("/:id/categories/:idCategory", function (req, res, next) {
    let idUser = req.params.id; // !!! URL
    let idCategory = req.params.idCategory;  // !!! URL
    if(idUser) {
        if(idCategory) {
            // Specific category BY User ID
            Restaurant.getCategoryByUserId(idUser, idCategory)
                .then((value) => {
                    res.json(value);
                })
                .catch(err => {
                    res.json(err);
                });
            return;
        }

        // Orders BY User ID
        Restaurant.getCategoriesByUserId(idUser)
            .then((value) => {
                res.json(value);
            })
            .catch(err => {
                res.json(err);
            });
        return;
    }
});

/////////////////////// ITEMS ///////////////////////////

// Get items or one item by RESTAURANT Id
router.get("/:id/items", function (req, res, next) {
    let idUser = req.params.id; // !!! URL
    let idItem = req.query.idItem;  // !!! ?idItem=....
    if(idUser) {
        if(idItem) {
            // Specific Item BY User ID
            Restaurant.getItemByUserId(idUser, idItem)
                .then((value) => {
                    res.json(value);
                })
                .catch(err => {
                    res.json(err);
                });
            return;
        }

        // Items BY User ID
        Restaurant.getItemsByUserId(idUser)
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
    let idUser = req.params.id; // !!! URL
    let idItem = req.params.idItem;  // !!! URL
    if(idUser) {
        if(idItem) {
            // Specific Item BY User ID
            Restaurant.getItemByUserId(idUser, idItem)
                .then((value) => {
                    res.json(value);
                })
                .catch(err => {
                    res.json(err);
                });
            return;
        }

        // Items BY User ID
        Restaurant.getItemsByUserId(idUser)
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
