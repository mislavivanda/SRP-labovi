const express = require("express");
const router = express.Router();

const hello = require("./routes/hello");
const user = require("./routes/user");
<<<<<<< HEAD
const medicalTest = require("./routes/medical-test");

module.exports = () => {
  hello(router);
  user(router);
  medicalTest(router);

=======
const login = require("./routes/login");
module.exports = () => {
  hello(router);
  user(router);
  login(router);
>>>>>>> 06c8afd... 'Add_initial_login_logic'
  return router;
};
