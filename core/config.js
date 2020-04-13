const config = {
  database: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      timezone: 'utc'
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './database/migrations'
    },
    seeds: {
      directory: './database/seeds'
    }
  },
  app: {
    jwtExpireSeconds: 86400, // 24 hours in seconds
    refreshTokenExpireSeconds: 2592000, // 30 days in seconds
    millisecondsInSecond: 1000
  }
};

module.exports = config;
