const db = require("../models");

const User = db.users;

// Find a single user with an email
exports.findOne = (req, res) => {
  const {email, password} = req.body;

  User.findOne({
    where:{email}
  })
  .then(data => {
    if (data) {
        if(data.password !== password){
            res.status(404).send({
                message:"Password Not Match"
            })
        }
        else{
            res.send(data);
        }
    } 
    else {
      res.status(404).send({
        message: `User not exist`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving Tutorial with id=" + id
    });
  });
};