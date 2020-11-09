const config = require("./config");
const express = require("express");
const { Logger } = require("./loaders/logger");//logger za node.js-> loadamo ga posebno da ga imamo za ispis
const loaders = require("./loaders");//u njima sadrzani sv-> KADA RADIMO require(ime foldera) ONDA ĆE node.js TRAŽITI file index.js u TOM FOLDERU I V4RATIT ONO ŠTA ON EXPORTA A AKO GA NEMA JAVIT CE GRESKU 

async function startServer() {
  const app = express();

  Logger.info("Starting the loader...");
  await loaders({ app });//loadani i sequelize-> povezani s bazom i express loadersi
//ako smo prosli loadanje-> sve je dobro mozemo ic dalje samo trebamo stavit port na kojem slusamo, rute su vec postavljene u express loaderu
  Logger.info("Starting the server...");
  app
    .listen(config.port, () => {
      Logger.info(
        `>>> Server is ready and listening on port: ${config.port} <<<`
      );
    })
    .on("error", (err) => {//uvijek za error handleanje
      Logger.error(err);
      process.exit(1);
    });
}

startServer();
