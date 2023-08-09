const TABLE_NAME = 'tasks';

/**
 * Migration up
 * @param {import("knex")} knex
 * @returns {Promise}
 */
exports.up = async (knex) => {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  return knex.schema.createTable(TABLE_NAME, (t) => {
    t.uuid('id', { primaryKey: true }).defaultTo(
      knex.raw('uuid_generate_v4()'),
    );
    t.string('description').notNullable();
    t.boolean('completed').notNullable().defaultTo('false');
    t.decimal('price_assignee').notNullable();
    t.decimal('price_completed').notNullable();
    t.uuid('assignee_id').notNullable();

    t.unique(['id', 'assignee_id'], { useConstraint: true });
  });
};

/**
 * Migration down
 * @param {import("knex")} knex
 * @returns {Promise}
 */
exports.down = async (knex) => {
  return knex.schema.dropTable(TABLE_NAME);
};
