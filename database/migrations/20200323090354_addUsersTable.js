exports.up = async knex => {
  await knex.schema.createTable('users', t => {
    t.increments();
    t.string('email', 50).notNullable().unique();
    t.string('password').notNullable();
    t.string('refreshToken').nullable();
    t.integer('refreshTokenExpires').nullable();
    t.string('firstName', 100).notNullable();
    t.string('lastName', 100).notNullable();

    t.timestamp('createdAt').nullable().defaultTo(null);
    t.timestamp('updatedAt').nullable().defaultTo(null);
  });
};

exports.down = async knex => {
  await knex.schema.dropTableIfExists('users');
};
