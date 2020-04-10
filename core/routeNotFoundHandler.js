const HttpError = require('./errors/httpError');

module.exports = app => {
  app.use(() => {
    throw new HttpError('Route not found', 404);
  });
};
