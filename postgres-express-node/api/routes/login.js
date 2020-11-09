const express = require("express");
const router = express.Router();

const LoginSchemas = require("./login.schemas");
const SchemaValidator = require("../middleware/validate");
const LoginController = require("../controllers/login.controller");

SchemaValidator.addSchemas(LoginSchemas);//POZVALI FUKCIJU IZ VALIDATE KOJA CE UCITATI ZADANU SHEMU U VALIDATOR

module.exports = (rootRouter) => {
  rootRouter.use("/", router);/*sve rute se odnose prema root ruteru /-> root router će se pozvti iz app.js za path /api a ovaj dio u loginu ce se pozvati za dio /api/login jer je root ruter kada dode u ovaj file vec na ruti /api a nas file se odnosi podjednako
 prema njemu, npr da mso ovde stavili umjseto '/' oznaku 'home' onda bi se login ruta pozvala za /api/home/login */
//ovaj root ruter dobijaju u index.js fileu i on zapravo predstavlja ruter koji ce se korsititi u ap.js
// root ruta /-> uvijek se pozove cim se otovri aplikacija->root path->onda gleda ima li neku od funkcija koji se nalaze na tom pathu
  router.post(
    "/login",// PRVO SE POZIVA SHEMA VALIDATOR KOJI CE POZIVOM next() POZVATI IDUCU MIDDLEWARE FUNKCIJU A TO JE FUNKCIJA OD KONTROLERA,INACE AKO BUDE GRESKA JAVIT CE GRESKU I NECE ZVAT KOJTROLERA
    SchemaValidator.validate("login"),//provjeri jeli unseni podatak u skladu sa shemom-> zna ime zato što je kod module.exporta navedeno login ime
    LoginController.login//korisit ovaj controller za tu rutu, ima scope nad ovim ruterom pa time ima i pristup varijablama req i res
  );
}

 
