const express = require("express");
const cors = require("cors");//CROSS ORIGIN RESOURCE SHARING
/*CORS-> OZNAČAVA MOŽEMO LI DOHVATITI I KORSITIT NAŠE API-e sa neke druge domene/origina npr u www.google.com napravimo fetch GET request na našu stranicu la loclahostu-> BROWSER ce javiti gresku ako nismo implementirali 
dopuštenje da www.google.com može pristupiti našim API-ima, zaglavlje ACESS ALOW CONTROL ORIGIN u response http odogovoru definira ovo,ako stavimo * to znači da dopuštamp pristup sa svih origina*/
const config = require("../config");
const routes = require("../api");//U OVOME SU SADRZANI SVI RUTERI I NJIHOVI KONTORLERI->OSNOVA APLIKACIJE
module.exports = ({ app, HttpLogger: logger }) => {//tu ce za logger doci morgan logger
  //---------------------------
  // REGISTER MIDDLEWARE
  // (Remember that the order in
  //  which you use the middleware
  //  matters.)-> ZBOG POZIVA SLJEDECEG->OVISI TKO JE SLJEDECI MIDLEWAREA U MIDLEWARE STACKU-> poziv funkcijom next()
  //---------------------------
  app.use(logger);//koristi taj logger za ispis hhtrp zahtjeva-> morgan
  app.use(cors());//ovakav zapis dopušta svim origina da pristupoe našem api-u-> browser nece javljati gresku
  app.use(express.json()/*ovaj poziv unutar zagrada vraća midleware funkciju koju će korsitit naš app*/);// objekt koji šaljemo u POST,PUT meotdama parsira u JSON objekt
  app.use(express.urlencoded({ extended: false }/* parsiramo body sa query string libraryem*/ ));
  //-> npr kada šaljemo podatke s forme oni se enkodiraju u URL u obliku query stringa i ovo nam omogućuje da ih možemo izvući iz tog URL
  //uzima samo url_encoded bodye kod requesta-> url enkodirano znači da slova koja ne pripadaju URL definiranom kodu se enkodiraju u format %HEXHEX
  /* gornje 2 metode potrebne kod POST i GET zathjeva s kojima šaljemo odrešđene podatke serveru
  */
  // PARSIRANJE SMO MOGLI ODRADITI I SA IMPORTANJEM bodyparser -> const body-parser=require("body-parser") pa bi umjesto express.json() pisali bodyparser.json()
  //---------------------------
  // LOAD/MOUNT API ROUTES
  // (path prefix e.g. /api)
  //---------------------------
  app.use(config.api.prefix/* zapravo predstavlja rutu /api*/, routes()); //postavlja zadane rutere na rutu /api
//RUTA /api ĆE POSTATI ROOT RUTA ZA SVE RUTERE->njihovi pozivi kontrolera će se pozivati u odnsou na tu rutu
  //---------------------------
  // ERROR HANDLERS
  //---------------------------
  // catch 404 and forward to error handler-> sa next funkcijom
  app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);//poziva sljedeci middleware ako dode do greske-> poziva error handling midleware
  });

  // ultimate error handler
  app.use((err, req, res, next) => {//midleware error handler-> ima 4 argumenta
    res.status(err.status || 500);
    res.json({
      error: {
        message: err.message || "Internal Server Error",
      },
    });
  });
};
