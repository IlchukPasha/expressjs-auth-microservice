const HttpError = require('./errors/httpError');

module.exports = app => {
  app.use((req, res, next) => {
    throw new HttpError('Route not found', 404);
  });
}