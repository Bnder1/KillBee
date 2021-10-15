//TODO: transcript to category.ts

let express = require("express");
let validator = require("validator");
let Category = require('../models/categoryModel');

let router = express.Router();

// GET: all Categories or Category by ID
router.get("/", function (req, res, next) {
    let id = req.query.id;
    if(id) {
        // Category BY ID
        Category.getCategoryById(id)
            .then((value) => {
                res.json(value);
            })
            .catch(err => {
                res.json(err);
            });
        return;
    }
    // ALL Categories
    Category.getCategories()
    .then((value) => {
        res.json(value);
    })
    .catch(err => {
        console.error(err)
        res.json(err);
    });
});

// GET: Category by id
router.get("/:id", function (req, res, next) {
    let id = req.params.id;
    Category.getCategoryById(id)
    .then((value) => {
        res.json(value);
    })
    .catch(err => {
        res.json(err);
    });
});

// POST: Create new Category
router.post("/", async (req, res) => {
    let newCategory = new Category(req.body);
    Category.postCategory(newCategory)
        .then((value) => {
            res.json(value);
        })
        .catch(err => {
            res.json(err);
        });
});

// PUT: Update Category
router.put("/", async (req, res) => {
    Category.updateCategory(req.body)
        .then((value) => {
            res.json(value);
        })
        .catch(err => {
            res.json(err);
        });
});

// DELETE: Remove Category by ID only
router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    Category.removeCategory(id)
        .then((value) => {
            res.json(value);
        })
        .catch(err => {
            res.json(err);
        });
});

module.exports = router;
