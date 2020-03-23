const now = require('performance-now');
const KnexLogger = require('./KnexLogger');

const times = {};

class KnexListener {
  static query(query) {
    const uid = query.__knexQueryUid;
    times[uid] = {
      query,
      startTime: now()
    };
  }

  static queryResponse(response, queryZ) {
    const uid = queryZ.__knexQueryUid;
    times[uid].endTime = now();
    KnexLogger.printQueryWithTime(uid, times);
  }
}

module.exports = KnexListener;