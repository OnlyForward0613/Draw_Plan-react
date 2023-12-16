const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path")

const app = express();

app.use(cors());

// parse requests of content-type - application/json
// app.use(express.json());

// // parse requests of content-type - application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const db = require("./app/models");

app.use(express.static(path.resolve(__dirname, "./app/uploads")));

db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

require("./app/routes/turorial.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/category.routes")(app);
require("./app/routes/measure.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
