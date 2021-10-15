//TODO: transcript to wallet.ts

let express = require("express");
let validator = require("validator");
let Wallet = require('../models/walletModel');

let router = express.Router();

// GET: all Wallets or Wallet by ID
router.get("/", function (req, res, next) {

    let id = req.query.id;

    if(id) {
        // Wallet BY ID
        Wallet.getWalletById(id)
            .then((value) => {
                res.json(value);
            })
            .catch(err => {
                res.json(err);
            });
        return;
    }

    // ALL Wallet
    Wallet.getWallets()
    .then((value) => {
        res.json(value);
    })
    .catch(err => {
        console.error(err)
        res.json(err);
    });

});

// GET: Wallet by id
router.get("/:id", function (req, res, next) {
    let id = req.params.id;

    Wallet.getWalletById(id)
    .then((value) => {
        res.json(value);
    })
    .catch(err => {
        res.json(err);
    });
});

// POST: Create new Wallet
router.post("/", async (req, res) => {
    let newWallet = new Wallet(req.body);

    Wallet.postWallet(newWallet)
        .then((value) => {
            res.json(value);
        })
        .catch(err => {
            res.json(err);
        });
});

// PUT: Update Wallet
router.put("/", async (req, res) => {
    Wallet.updateWallet(req.body)
        .then((value) => {
            res.json(value);
        })
        .catch(err => {
            res.json(err);
        });
});

// DELETE: Remove Wallet by ID only
router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    Wallet.removeWallet(id)
        .then((value) => {
            res.json(value);
        })
        .catch(err => {
            res.json(err);
        });
});

module.exports = router;
