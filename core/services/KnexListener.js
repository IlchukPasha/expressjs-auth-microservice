const now = require('performance-now');
const KnexLogger = require('./KnexLogger');

const queriesTimes = {};

class KnexListener {
  static query(query) {
    const uid = query.__knexQueryUid;
    queriesTimes[uid] = {
      query,
      startTime: now()
    };
  }

  static queryResponse(response, query) {
    const uid = query.__knexQueryUid;
    queriesTimes[uid].endTime = now();
    KnexLogger.printQueryWithTime(queriesTimes[uid]);
    delete queriesTimes[uid];
  }
}

module.exports = KnexListener;