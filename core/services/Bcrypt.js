const bcrypt = require('bcryptjs');

class Bcrypt {
  static async hashPassword(plainPassword) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(plainPassword, salt);
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = Bcrypt;