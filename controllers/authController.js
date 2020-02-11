const HttpError = require('./../core/errors/httpError');

const signup = async (req, res, next) => {
  const { email, password } = req.body;
  next(new HttpError('not found--', 404));
  // res.json({ message: 'Hello' });
}

exports.signup = signup;