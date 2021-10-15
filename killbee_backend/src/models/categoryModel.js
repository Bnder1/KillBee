let mongoose = require('mongoose');
let validator = require('validator');
let timestampPlugin = require('./timestamp');

let categorySchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true
  },
  img: String
});

// GET Categories
categorySchema.statics.getCategories = async function (filter) {
  return new Promise((resolve, reject) => {
    this.find((err, docs) => {
      if(err) {
        err["error"] = "Unable to get categories.";
        return reject(err)
      }
      resolve(docs)
    })
  })
}

// GET CategoryByName
categorySchema.statics.getCategoryByName = async function (name) {

  if(!name) {
    return new Promise((resolve, reject) => {
        return reject ({
          "error": "Please provide a correct category name (string)"
        });
    });
  }

  let filter = {
    name: name
  }

  return new Promise((resolve, reject) => {
    this.findOne(filter, (err, docs) => {
      if (docs) {
        resolve(docs)
      } else {
        return reject({
          "error": "No category found."
        })
      }
    });
  });
}

// GET CategoryBySlug
categorySchema.statics.getCategoryByName = async function (slug) {

  if(!slug) {
    return new Promise((resolve, reject) => {
        return reject ({
          "error": "Please provide a correct category slug (string)"
        });
    });
  }

  let filter = {
    slug: slug
  }

  return new Promise((resolve, reject) => {
    this.findOne(filter, (err, docs) => {
      if (docs) {
        resolve(docs)
      } else {
        return reject({
          "error": "No category found."
        })
      }
    });
  });
}

// GET CategoryById
categorySchema.statics.getCategoryById = async function (id) {
  let filter = {
    _id: id
  }
  return new Promise((resolve, reject) => {
    this.findById(filter, (err, docs) => {
      if (docs) {
        resolve(docs)
      } else {
        return reject({
          "error": "No category found. Please check the ID."
        })
      }
    });
  });
}

// POST New Category
categorySchema.statics.postCategory = async function (object) {
  let tmpSlug = object.slug;
  let tmp = await this.findOne( { slug: tmpSlug });
  if(tmp) {
    return new Promise((resolve, reject) => {
      return reject ({
        "error": "Slug already registered, please provide a different and unique slug."
      });
    });
  }
  return new Promise((resolve, reject) => {
    object.save()
        .then(doc => {
          resolve(doc);
        }).catch(err => {
          err["error"] = "Unable to create new category, please contact an admin."
          reject(err);
        });
  })
}

// UPDATE Category
categorySchema.statics.updateCategory = async function (object) {
  let tmpId = object._id;

  if(!tmpId) {
    // No information to identify the category
    return new Promise((resolve, reject) => {
      return reject ({
        "error": "Please provide a correct slug (string) or ID to identify one category."
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
                "error" : "No category updated, please check if you provide the good ID"
              })
            }
            resolve(doc);
          }).catch(err => {
            err["error"] = "Unable to update the category."
            return reject(err)
      })
    });
  }
}

// DELETE Category
categorySchema.statics.removeCategory = async function (id) {
  let tmpId = id;
  if(!tmpId) {
    // No information to identify the category
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
                "error" : "No category removed, please check if you provide the good ID"
              })
            }
            resolve(doc);
        }).catch(err => {
          err["error"] = "Unable to remove the category.";
          return reject(err)
        })
    });
  }
}

/*** MIDDLEWARE ***/
categorySchema.plugin(timestampPlugin);

const Category = mongoose.model("category", categorySchema, "categories");
module.exports = Category;