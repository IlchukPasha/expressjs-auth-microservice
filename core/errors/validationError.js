class ValidationError extends Error {
  constructor(errors, errorCode = 400) {
    super();
    this.errors = errors;
    this.code = errorCode;
    this.name = 'ValidationError';
  }
}

module.exports = ValidationError;
