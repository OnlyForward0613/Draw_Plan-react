module.exports = (sequelize, Sequelize) => {
    const Measure = sequelize.define("measure", {
      area: {
        type: Sequelize.STRING
      },
      subarea: {
        type: Sequelize.STRING
      },
      category: {
        type: Sequelize.STRING
      },
      subcategory: {
        type: Sequelize.JSON
      },
      type: {
        type: Sequelize.STRING
      },
      unit: {
        type: Sequelize.STRING
      },
      measure: {
        type: Sequelize.DOUBLE
      },
      total: {
        type: Sequelize.DOUBLE
      },
      price: {
        type: Sequelize.JSON
      },
      location: {
        type: Sequelize.JSON
      },
      deductRect: {
        type: Sequelize.JSON
      },
      pageNumber: {
        type: Sequelize.INTEGER
      },
      fileName: {
        type: Sequelize.STRING
      },
      filePath: {
        type: Sequelize.STRING
      },
      user: {
        type: Sequelize.STRING
      },
      projectName: {
        type: Sequelize.STRING
      }
    });
  
    return Measure;
  };
  