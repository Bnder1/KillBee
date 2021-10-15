//TODO: transcript to item.ts

let express = require("express");
let validator = require("validator");
let Item = require('../models/itemModel');

let router = express.Router();

// GET: all Items or Item by ID
router.get("/", function (req, res, next) {
    let id = req.query.id;
    if(id) {
        // Item BY ID
        Item.getItemById(id)
            .then((value) => {
                res.json(value);
            })
            .catch(err => {
                res.json(err);
            });
        return;
    }
    // ALL Items
    Item.getItems()
    .then((value) => {
        res.json(value);
    })
    .catch(err => {
        console.error(err)
        res.json(err);
    });
});

// GET: Item by id
router.get("/:id", function (req, res, next) {
    let id = req.params.id;
    Item.getItemById(id)
    .then((value) => {
        res.json(value);
    })
    .catch(err => {
        res.json(err);
    });
});

// POST: Create new Item
router.post("/", async (req, res) => {
    let newItem = new Item(req.body);
    Item.postItem(newItem)
        .then((value) => {
            res.json(value);
        })
        .catch(err => {
            res.json(err);
        });
});

// PUT: Update Item
router.put("/", async (req, res) => {
    Item.updateItem(req.body)
        .then((value) => {
            res.json(value);
        })
        .catch(err => {
            res.json(err);
        });
});

// DELETE: Remove Item by ID only
router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    Item.removeItem(id)
        .then((value) => {
            res.json(value);
        })
        .catch(err => {
            res.json(err);
        });
});

module.exports = router;
