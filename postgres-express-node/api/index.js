const express = require("express");
const router = express.Router();//UNUTAR RUTERA SE POZIVAJU KONTROLERI(KOJI SE VEZU NA SERVISE) I VALIDATOR SHEME-> index.js sve komponenete spaja u 1
const hello = require("./routes/hello");
const user = require("./routes/user");
const login = require("./routes/login");
const medicalTest = require("./routes/medical-test");

module.exports = () => {
  hello(router);
  user(router);
  medicalTest(router);
  login(router);
  return router;
}


