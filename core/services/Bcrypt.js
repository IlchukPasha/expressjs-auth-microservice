const bcrypt = require('bcryptjs');

class Bcrypt {
  static async hashData(plainData) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(plainData, salt);
  }

  static async compareData(plainData, hashedData) {
    return bcrypt.compare(plainData, hashedData);
  }
}

module.exports = Bcrypt;
