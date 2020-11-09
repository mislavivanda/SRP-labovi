const { sequelize } = require("../models");

async function assertDatabaseConnectionOk({ Logger }) {
  Logger.info("Checking database connection...");//standardni ispis samo ne preko console.log nego preko loggera

  try {
    await sequelize.authenticate();
    Logger.info("Connection has been established successfully");
  } catch (error) {
    Logger.error("Unable to connect to the database:", error);
    process.exit(1);
  }
}

module.exports = ({ Logger }) => assertDatabaseConnectionOk({ Logger });//exporta funkciju koja ce u indexu primit logger
