const winston = require("winston");
const UserService = require("./user.service");
const LoginService = require("./login.service");
const { User } = require("../models");//exportano unutar db objekta u index.js fileu u models folderu

const logger = winston.loggers.get("logger");
//exports.loginServiceInstance = new LoginService({ logger, userModel: User });
exports.userServiceInstance = new UserService({ logger, userModel: User });
exports.loginServiceInstance = new LoginService({ logger, userModel: User });/* za logger postavljA
winston logger a za model postavlja usera*/
