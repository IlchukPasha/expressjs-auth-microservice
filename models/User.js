const { Model } = require('objection');

const { hashPassword } = require('../core/services/Bcrypt');

class User extends Model {
  static get tableName() {
    return 'users';
  }

  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext);
    this.password = await hashPassword(this.password);
    this.createdAt = new Date();
  }

  async $beforeUpdate(opt, queryContext) {
    await super.$beforeUpdate(opt, queryContext);
    this.updatedAt = new Date();
  }
}

module.exports = User;
