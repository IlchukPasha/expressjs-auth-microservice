const { Model } = require('objection');
const KnexInstance = require('knex');

const KnexListener = require('./services/KnexListener');
const { database } = require('./config');

const knex = KnexInstance(database);
Model.knex(knex);

if (process.env.DB_QUERIES_LOG === 'true') {
  knex.on('query', KnexListener.query);
  knex.on('query-response', KnexListener.queryResponse);
}

module.exports = { knex };