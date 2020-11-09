const dotenv = require("dotenv");
//pristup env varijalama preko globalnog process objekta-> process.env.IMEENV VARIJABLE U .env datoteci
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("Couldn't find .env file");
}

/**
 * Express app config
 */
module.exports = {
  port: process.env.PORT,

  // For winston and morgan loggers
  logs: {
    winston: {
      level: process.env.LOG_LEVEL || "debug",
    },
    morgan: {
      format: process.env.MORGAN_FORMAT || "combined",//definirano u env fileu
    },
  },

  api: {//config.api.prefix = /api
    prefix: "/api",
  },
};
