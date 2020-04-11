const logger = require('./services/Logger')();

module.exports = app => {
  app.use((err, req, res, next) => {
    if (res.headerSent) {
      return next(err);
    }

    res.status(err.code || 500);

    switch (err.name) {
      case 'HttpError':
        res.json({ type: err.name, message: err.message });
        break;
      case 'ValidationError':
        res.json({ type: err.name, errors: err.errors });
        break;
      default:
        res.json({ type: 'Unknown', message: err.message || 'An unknown error occured!' });
        break;
    }

    logger.error(err);
  });
};
