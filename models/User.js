const { Model } = require('objection');
const VisibilityPlugin = require('objection-visibility').default;

const { hashPassword } = require('../core/services/Bcrypt');

class User extends VisibilityPlugin(Model) {
  static get tableName() {
    return 'users';
  }

  static get visible() {
    return ['id', 'email', 'firstName', 'lastName', 'createdAt'];
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

/**
 *  @swagger
 *  definitions:
 *    SignIn:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          default: mail@mail.com
 *        password:
 *          type: string
 *          default: "123456"
 *    SignUp:
 *      type: object
 *      required:
 *        - email
 *        - password
 *        - confirmPassword
 *        - firstName
 *        - lastName
 *      properties:
 *        email:
 *          type: string
 *          default: mail@mail.com
 *        password:
 *          type: string
 *          default: "123456"
 *        confirmPassword:
 *          type: string
 *          default: "123456"
 *        firstName:
 *          type: string
 *          default: "First Name"
 *        lastName:
 *          type: string
 *          default: "Last Name"
 */
