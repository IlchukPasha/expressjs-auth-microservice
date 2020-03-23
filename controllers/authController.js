const HttpError = require('./../core/errors/httpError');

const { User } = require('./../models');

const signup = async (req, res, next) => {
  const { email, password } = req.body;

  await User.query().limit(3);

  next(new HttpError('not found--', 404));
  // res.json({ message: 'Hello' });
}

exports.signup = signup;