/*Smisao loggera je da ispisujemo podatke(bilo na stdin ili u neki file) na laksi i strukturirani nacin sa vise opcija  umjesto
 ispisa sa standardnim console.log() di smo ograniceni s tim da mozemo samo ispisvat stringove*/
 //npr ovde imamo razlicite opcije ispisa npr logger.info,logger.error,....
const winston = require("winston");//logger za node.js, ima brojne funkcionalnosti
const morgan = require("morgan");//logger za ispis http zahtjeva

const config = require("../config");//sadrzi djelove koji se odnose na loggere

/**
 * console.{log, error, warn}
 */
const DefaultLogger = console;

/**
 * Winston logger configuration and instance
 */
const transports = [];// MOŽEMO DEFINIRATI VIŠE TRANSPORTA UNUTAR NIZA -> tada WINSTON upisuje istovrmeeno u sve te transporte pri čemu ovisi jeli riječ o dozovljenom levelu za taj transport
/*odreduju gdje cemo ispisivati nas sadrzaj-> mozemo ga postaviti na konzolu,file,http,...
PARAMETRI:
OSIGURAVAMO DA NPR NE ŽELIMO U DATOTEKU ISPISIVATI NIŠTA OSIM ERRORA npr->level: This attribute sets the specific level for this transport to take into consideration.
 Any message that has a different level will be ignored. So although it’s optional, if you use it,
  ensure you don’t accidentally leave log levels without a transport assigned.
NAČIN PRIKAZA U KOZNOLI ILI ZAPISA U DATOTECI AKO NAM JE TO U TRANSPORTUFormat: Just like the general format from above, you can also customize the format of specific transporters,
 giving you further control over the way you output data.*/
if (process.env.NODE_ENV !== "development") {
  transports.push(new winston.transports.Console());
} else {
  transports.push(
    new winston.transports.Console({//ispis na konzolu
      format: winston.format.combine(
        winston.format.cli(),
        winston.format.splat()
      ),
    })
  );
}

// const LoggerInstance = winston.createLogger({
//   level: config.logs.winston.level,   //maximum level of log messages to log
//   levels: winston.config.npm.levels, //the set of level message types chosen
//   format: winston.format.combine(  //the format of log messages
//     winston.format.timestamp({
//       format: "YYYY-MM-DD HH:mm:ss",
//     }),
//     winston.format.errors({ stack: true }),
//     winston.format.splat(),
//     winston.format.json()
//   ),
//   transports,  //set of logging destinations for log messages
// });
/* The following are the default npm logging levels:

    0: error
    1: warn
    2: info
    3: http
    4: verbose
    5: debug
    6: silly

Anything at a particular level or HIGHER will be logged.->mi smo ga u configu stavili na debug ako nije deklariran unutar process.env varijable-> ispisaivat će 6 levela
 For instance, by specifying the info level, anything at level error, warn, or info will be logged. Log levels are specified when calling the logger. */ 

winston.loggers.add("logger", {
  level: config.logs.winston.level,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),//ispisi stack trace
    winston.format.splat(),
    winston.format.json()
  ),
  transports,
});
/*VAŽNOOOO-> node.js CACHEA sve ono šta requira-> kada prvi put requiramo winston/morgan i na njemu naprvimo promjene one će biti CACHEANE i
 onda kada ga opet requiramo u nekom drugom fileu on neće napraviti cijeli novi winston nego će učitati ovaj CACHEANI sa svim promjenama
 -> ako se želi requirat skroz novi model onda zovemo require-new('...')*/
/*Logging messages are formatted with Winston formats. Winston contains several built-in formats, including:
align
timestamp
errors
simple
json
cli
padlevels
colorize
splat
align

The default format is json. Formats can be combined with combine and custom formats can be created with printf. */

const LoggerInstance = winston.loggers.get("logger");//dohvacamo instancu morgan loger koju smo gore kreirali

/**
 * Morgan logger instance
 */
const HttpLoggerInstance = morgan(config.logs.morgan.format, {//kod radenja instance loggera definiramo format8 u ovom slucaju se to nalazi u config fileu
  stream: {//stream na kojem ce se ispisivati,moze biti i rferenca na neki file stream koji smo prethodno definirali
    write(message) {//samo sredimo poruku od morgana sa winston loggerom
      LoggerInstance.info(message.substring(0, message.lastIndexOf("\n")));// new line character(s) appended to each log by morgan module plus Winston append an additional new line character
    },//trazimo zadnji /n koji je dodan da izbjegnemo prazni red kod stvarnog ispisa-> substr uzme prvi član sve do indeksa zadnje pojave \n -> njega ne uzme i ne dobijemo prazni red
    /* inace bi dobili ovakav ispis
    info: GET / 302 17.303 ms - 68

    info: GET /login 304 4.429 ms - -

    info: GET /ok 304 2.691 ms - -*/
  },
});

module.exports = {
  Logger: LoggerInstance || DefaultLogger,
  HttpLogger: HttpLoggerInstance,
};
