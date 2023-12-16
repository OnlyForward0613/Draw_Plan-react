module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define("category", {
      name: {
        type: Sequelize.STRING
      },
      unit: {
        type: Sequelize.STRING
      },
      subcategory: {
        type: Sequelize.JSON
      }
    });
  
    return Category;
  };
  