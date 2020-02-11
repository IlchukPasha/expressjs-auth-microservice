class HttpError extends Error {
  constructor(message, errorCode) {
    super(message);
    this.code = errorCode;
    this.name = 'HttpError';
  }
}

module.exports = HttpError;