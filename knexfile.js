require('dotenv').config();
const { database } = require('./core/config');

module.exports = {
  development: database,
  production: database,
  testing: database
};
