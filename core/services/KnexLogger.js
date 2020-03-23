// TODO rework on other logger and time packages
const moment = require('moment');
const { createLogger, format, transports } = require('winston');

const {
  combine, timestamp, label, printf, colorize
} = format;


class KnexLogger {
  static getLogger() {
    const convertTs = ts => moment(ts).format('YYYY-MM-DD HH:mm');
    const dblFormat = printf(i => `${convertTs(i.timestamp)} ${i.level} ${i.message}`);

    const consoleTransport = new transports.Console();
    return createLogger({
      level: 'verbose',
      format: combine(colorize(), label(), timestamp(), dblFormat),
      transports: [consoleTransport]
    });
  }

  static printQueryWithTime(uid, times) {
    const { startTime, endTime, query } = times[uid];
    const elapsedTime = endTime - startTime;
    let qString = query.sql;
    if (query.bindings.length) {
      query.bindings.forEach(element => {
        qString = qString.replace('?', element);
      });
    }
    const executionTime = +elapsedTime.toFixed(0);

    const logger = this.getLogger();
    logger.log({
      level: executionTime >= 100 ? 'warn' : 'info',
      message: `[${elapsedTime.toFixed(3)} ms] ${qString}`
    });

    delete times[uid];
  };
}

module.exports = KnexLogger;