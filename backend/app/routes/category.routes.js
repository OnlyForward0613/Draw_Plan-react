module.exports = app => {
  const categories = require("../controllers/category.controller.js");

  var router = require("express").Router();


  // Retrieve all Tutorials
  router.get("/", categories.findAll);

  // Create New Category
  router.put("/", categories.createCategory);

  // Update one item in Category
  router.post("/:id", categories.updateCategory);

  // Delete a Tutorial with id
  router.delete("/:id", categories.deleteCategory);


  app.use('/api/category', router);
};
