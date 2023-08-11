/**
 * Migration up
 * @param {import("knex")} knex
 * @returns {Promise}
 */
exports.up = async (knex) => {
  return knex.schema.createTable('employees', (t) => {
    t.uuid('id', { primaryKey: true }).defaultTo(
      knex.raw('uuid_generate_v4()'),
    );
    t.string('login').notNullable();
    t.string('password').notNullable();
    t.string('role').notNullable();
  });
};

/**
 * Migration down
 * @param {import("knex")} knex
 * @returns {Promise}
 */
exports.down = async (knex) => {
  await knex.schema.dropTable('employees');
};
