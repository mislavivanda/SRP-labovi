const expressLoader = require("./express");
const sequelizeLoader = require("./sequelize");
const { Logger, HttpLogger } = require("./logger");
//index.js spaja sva ova 3-> LOADA IH
module.exports = async ({ app }) => {//tu bi trebali dobiti objekt app od app.js aplikacije 
  await sequelizeLoader({ Logger });//za sequelize i node.js koristimo winston loger
  Logger.info("Sequelize loaded (DB connected)");
//1)-> provjeravamo jesmo li se spojili na bazu
  expressLoader({ app, HttpLogger });//za express zahtvee koristimo http logger morgan
  Logger.info("Express app loaded");
  //2) provjeravamo jesmo li spojeni na server i jeli slusamo na taj port
};
