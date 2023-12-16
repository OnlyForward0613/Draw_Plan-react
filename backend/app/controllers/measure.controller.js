const db = require("../models");
const dbConfig = require("../config/db.config.js");
const fs = require("fs");
const Measure = db.measures;

const Sequelize = require("sequelize");
const { Blob } = require("buffer");
const { dirname } = require("path");
const path = require("path");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});
// Find a single user with an email
exports.save = async (req, res) => {
  let successFlag = true;
  const dataToSave = req.body;
  const project = await Measure.findAll({
    where: {
      user: dataToSave[0].user,
      projectName: dataToSave[0].projectName,
      fileName: dataToSave[0].fileName,
      pageNumber: dataToSave[0].currentPageNumber,
    },
  });
  console.log("Project: ", project);
  if (project.length) {
    console.log("Project Found!");
    Measure.destroy({
      where: {
        user: dataToSave[0].user,
        projectName: dataToSave[0].projectName,
        fileName: dataToSave[0].fileName,
        pageNumber: dataToSave[0].currentPageNumber,
      },
      //   truncate: true,
    }).then(async (data) => {
      dataToSave.forEach((element) => {
        const {
          area,
          subarea,
          category,
          subcategory,
          type,
          unit,
          measure,
          result,
          price,
          location,
          deductRect,
          currentPageNumber,
          fileName,
          user,
          projectName,
        } = element;
        Measure.create({
          area: area,
          subarea: subarea,
          category: category,
          subcategory: JSON.stringify(subcategory),
          type: type,
          unit: unit,
          measure: measure,
          HDP: 0,
          total: result,
          price: price,
          location: location,
          deductRect: deductRect,
          pageNumber: currentPageNumber,
          fileName: fileName,
          user: user,
          projectName: projectName,
        }).catch((err) => {
          successFlag = false;
        });
      });

      if (successFlag) {
        res.status(200).send({
          respond: "success",
        });
      } else {
        res.status(201).send({
          msg: "Error occured while saving measured data to databse.",
        });
      }
    });
  } else {
    console.log("Project Not Found!");
    dataToSave.forEach((element) => {
      const {
        area,
        subarea,
        category,
        subcategory,
        type,
        unit,
        measure,
        result,
        price,
        location,
        deductRect,
        currentPageNumber,
        fileName,
        user,
        projectName,
      } = element;
      Measure.create({
        area: area,
        subarea: subarea,
        category: category,
        subcategory: JSON.stringify(subcategory),
        type: type,
        unit: unit,
        measure: measure,
        HDP: 0,
        total: result,
        price: price,
        location: JSON.stringify({location}),
        deductRect: deductRect,
        pageNumber: currentPageNumber,
        fileName: element.user + element.projectName + ".pdf",
        filePath: `app/uploads/${element.user + element.projectName}.pdf`,
        user: user,
        projectName: projectName,
      }).then(data => {
        console.log('created!');
      }).catch((err) => {
        console.log('err========>: ', err, typeof location);
        successFlag = false;
      });
    });
  }
};
//PDF file upload
exports.createProject = async (req, res) => {
  console.log("req.body=========>: ", req.file.path);
  await sequelize.sync();
  let filePath = `${req.file.path}`;
  fs.renameSync(
    filePath,
    `app/uploads/${req.body.user + req.body.ProjectName}.pdf`
  );
  let fileName = `${req.body.user + req.body.ProjectName}.pdf`;
  // fs.renameSync(fileName, `${req.body.user + req.body.ProjectName}.pdf`);
  filePath = `app/uploads/${req.body.user + req.body.ProjectName}.pdf`;
  // Measure.update(
  //   { filePath: filePath, fileName: fileName },
  //   {
  //     where: {
  //       user: req.body.user,
  //       projectName: req.body.ProjectName,
  //     },
  //   }
  // );
};

exports.getFileBuffer = async (req, res) => {
  let data = fs.readFileSync(`app/uploads/${req.body.fileName}`);
  console.log('buffer: ', data);
  return res.status(200).send({buffer: data});
};

exports.getProject = async (req, res) => {
  Measure.findAll({
    where: {
      user: "123@gmail.com",
    },
    attributes: ["projectName"],
    group: ["projectName"],
    raw: true,
  })
    .then((data) => {
      console.log("ProjectFound=========>: ", data[0]);
      res.status(200).send({ data: data });
    })
    .catch((err) => {
      console.log("Project Not Found==========>: ", err);
      res.status(505).send({
        msg: "Project Not Found!",
      });
    });
};

exports.getProjectContent = async (req, res) => {
  Measure.findAll({
    where: {
      user: req.body.user,
      projectName: req.body.projectName,
    },
  })
    .then((data) => {
      console.log("ProjectContentFound=========>: ", data);
      res.status(200).send({ data: data });
    })
    .catch((err) => {
      console.log("ProjectContent Not Found==========>: ", err);
      res.status(505).send({
        msg: "Project Not Found!",
      });
    });
};
