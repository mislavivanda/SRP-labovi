const express = require("express");
const router = express.Router();

const HelloController = require("../controllers/hello.controller");

module.exports = (rootRouter) => {
  rootRouter.use("/", router);
//POZIVA SE ODMA JER JE NA ROOT PATHU
  router.get("/", HelloController.sayHello);
};
