const {
  format: formatFns,
  parseISO
} = require('date-fns');
const {
  createLogger,
  format,
  transports,
  addColors
} = require('winston');

addColors({
  info: 'cyan'
});

const convertTs = ts => formatFns(parseISO(ts), 'dd-MM-y HH:mm:ss');
const generalFormat = format.printf(i => `${i.level} ${i.message}`);
const dbFormat = format.printf(i => `${i.level} ${convertTs(i.timestamp)} ${i.message}`);

const logger = () => {
  const consoleTransport = new transports.Console();
  consoleTransport.silent = !+process.env.GENERAL_LOG_ENABLED;

  return createLogger({
    format: format.combine(
      format.colorize(),
      generalFormat
    ),
    transports: [consoleTransport]
  });
};

const dbLogger = () => {
  const consoleTransport = new transports.Console();
  consoleTransport.silent = !+process.env.DB_QUERIES_LOG;

  return createLogger({
    format: format.combine(
      format.colorize(),
      format.timestamp(),
      dbFormat
    ),
    transports: [consoleTransport]
  });
};

module.exports = logger;
module.exports.dbLogger = dbLogger;
