module.exports = (app) => {
  const user = require("../controllers/user.controller.js");

  var router = require("express").Router();

  // Retrieve user by Email
  router.post("/", user.findOne);

  app.use("/api/users", router);
};
