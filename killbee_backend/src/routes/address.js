//TODO: transcript to address.ts

let express = require("express");
let validator = require("validator");
let Address = require('../models/addressModel');

let router = express.Router();

// GET: all Addresses or Address by ID
router.get("/", function (req, res, next) {
    let id = req.query.id;
    if(id) {
        // Address BY ID
        Address.getAddressById(id)
            .then((value) => {
                res.json(value);
            })
            .catch(err => {
                res.json(err);
            });
        return;
    }
    // ALL Addresses
    Address.getAddresses()
    .then((value) => {
        res.json(value);
    })
    .catch(err => {
        console.error(err)
        res.json(err);
    });
});

// GET: Address by id
router.get("/:id", function (req, res, next) {
    let id = req.params.id;
    Address.getAddressById(id)
    .then((value) => {
        res.json(value);
    })
    .catch(err => {
        res.json(err);
    });
});

// POST: Create new Address
router.post("/", async (req, res) => {
    let newAddress = new Address(req.body);
    Address.postAddress(newAddress)
        .then((value) => {
            res.json(value);
        })
        .catch(err => {
            res.json(err);
        });
});

// PUT: Update Address
router.put("/", async (req, res) => {
    Address.updateAddress(req.body)
        .then((value) => {
            res.json(value);
        })
        .catch(err => {
            res.json(err);
        });
});

// DELETE: Remove Address by ID only
router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    Address.removeAddress(id)
        .then((value) => {
            res.json(value);
        })
        .catch(err => {
            res.json(err);
        });
});

module.exports = router;
