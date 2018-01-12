const winston = require('winston');
const getenv = require('getenv');

const isProd = getenv('NODE_ENV') === 'production';
const logLevel = getenv('LOG_LEVEL', 'info');

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: logLevel,
      colorize: true,
      json: isProd,
      stringify: isProd,
      timestamp: true
    })
  ]
});

// disable log on unit test
// istanbul ignore next
if (logLevel === 'test') {
  logger.remove(winston.transports.Console);
}

module.exports = logger;
