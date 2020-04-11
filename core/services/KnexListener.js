const now = require('performance-now');
const logger = require('./Logger').dbLogger();

const queriesTimes = {};

class KnexListener {
  static query(query) {
    const uid = query.__knexQueryUid;
    queriesTimes[uid] = {
      query,
      startTime: now()
    };
  }

  static queryResponse(_, queryResponse) {
    const endTime = now();
    const uid = queryResponse.__knexQueryUid;
    const { startTime, query } = queriesTimes[uid];

    const elapsedTime = endTime - startTime;
    const executionTime = +elapsedTime.toFixed(0);

    let qString = query.sql;

    if (query.bindings.length) {
      query.bindings.forEach(element => {
        const bindingValue = typeof element === 'number' ? element : `'${element}'`;
        qString = qString.replace('?', bindingValue);
      });
    }

    logger.log({
      level: executionTime >= 100 ? 'warn' : 'info',
      message: `[${elapsedTime.toFixed(3)} ms] ${qString}`
    });

    delete queriesTimes[uid];
  }
}

module.exports = KnexListener;
