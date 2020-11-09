const express = require("express");
const router = express.Router();//UNUTAR RUTERA SE POZIVAJU KONTROLERI(KOJI SE VEZU NA SERVISE) I VALIDATOR SHEME-> index.js sve komponenete spaja u 1
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
  hello(router);//stavimo da nas root router koriste sve zadane funkcije od rutera deefinranih u login user i hello tako da moze korsitit te funkcije na njohvin pathovima
  user(router);
  login(router);
<<<<<<< HEAD
>>>>>>> 06c8afd... 'Add_initial_login_logic'
  return router;
=======
  return router;//VRATIMO RUTER U KOJEM SE NALAZE SVE FUNKCIJE OD OSTALA 3 RUTERA KOJE CE SE POZIVATI U KONTROLERIMA ZA ODREDENE PATHOVE
>>>>>>> e017cac... 'Code_comments'
};
