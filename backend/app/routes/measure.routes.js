const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./app/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

module.exports = (app) => {
  const measure = require("../controllers/measure.controller.js");

  var router = require("express").Router();

  router.post("/create-project", multer({ storage}).single("File"), measure.createProject);
  router.post("/get-project", measure.getProject);
  router.post("/getproject-content", measure.getProjectContent);
  router.post("/getfile-buffer", measure.getFileBuffer);
  router.put("/", measure.save);

  app.use("/api/measure", router);
};