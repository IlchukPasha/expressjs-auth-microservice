module.exports = app => {
  app.use((err, req, res, next) => {
    if (res.headerSent) {
      return next(err);
    }

    switch (err.name) {
      case 'HttpError':
        res.json({ message: err.message });
        break;
      case 'ValidationError':
        res.json({ errors: err.errors });
        break;
      default:
        res.json({ message: err.message || 'An unknown error occured!' });
        break;
    }

    res.status(err.code || 500);
  });
}