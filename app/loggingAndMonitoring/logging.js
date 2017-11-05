const winston = require('winston')

let log_level = (process.env.LOG_LEVEL != undefined)? process.env.LOG_LEVEL:'info';
log_level = log_level.replace(/['"]+/g, '');    //strip away any quotes.

const logger = winston.createLogger({
    transports: [
      new (winston.transports.Console)({ level: log_level }),
      new (winston.transports.File)({ filename: 'errors.log',level:'error' })
    ]
  });

logger.silly("yee haw central logging");

module.exports=logger