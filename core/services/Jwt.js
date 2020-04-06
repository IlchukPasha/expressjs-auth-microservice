const jsonwebtoken = require('jsonwebtoken');

const HttpError = require('./../errors/httpError');

class Jwt {
  static generateToken(user) {
    const payload = { data: { id: user.id } };

    return new Promise((resolve, reject) => {
      jsonwebtoken.sign(payload, process.env.JWT_SECRET, { expiresIn: '40 days' }, (err, token) => {
        if (err) {
          reject(new HttpError('You cannot be logged at the moment.', 401));
        } else {
          resolve(token);
        }
      });
    });
  }

  static verifyToken(token) {
    return new Promise((resolve, reject) => {
      jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          reject(new HttpError('Your authorization cannot be verified at the moment.', 401));
        } else {
          resolve(decoded);
        }
      });
    });
  }
}

module.exports = Jwt;