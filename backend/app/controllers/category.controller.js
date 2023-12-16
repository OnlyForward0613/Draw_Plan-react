const db = require("../models");

const Category = db.categories;

// Find a single user with an email
exports.createCategory = (req, res) => {
    const { name, unit, subCategory } = req.body;
    Category.create({
      name: name,
      unit: unit,
      subcategory: subCategory
    })
      .then(data => {
        Category.findAll()
        .then(categories => res.send(categories))
        .catch(err => res.status(201).send({message: err}))
      })
      .catch(err => {
        res.status(500).send({
          message: err.message || "Some error occurred while creating the category."
        });
      });
};

exports.findAll = (req, res) => {
  Category.findAll({raw: true})
    .then(categories => {
      res.status(200).send(categories);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error occured while retrieving categories.",
        error: err.message
      })
    })
}

exports.deleteCategory = (req, res) => {
    console.log("OK")
    const {id} = req.params;
    Category.destroy({
        where: {id}
    })
    .then(numDeleted => {
        if (numDeleted === 1) {
            Category.findAll()
          .then(categories => res.send(categories))
          .catch(err => res.status(201).send({message: err}))
          } else {
            res.status(404).send({
              message: `Category with id ${categoryId} not found.`
            });
          }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error occurred while deleting the category.",
          error: err.message
        });
      });
}

exports.updateCategory = (req, res) => {
    const id = req.params.id;
    const maindata = req.body;
    
    Category.update(
    {
      subcategory: maindata,
    },
    {
      where: {id},
    })
    .then(data => {
      Category.findAll()
      .then(categories => res.send(categories))
      .catch(err => res.status(201).send({message: err}))
    })
    .catch(err => console.log(err))
  };