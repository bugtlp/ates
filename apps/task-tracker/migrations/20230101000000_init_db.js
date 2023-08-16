/**
 * Migration up
 * @param {import("knex")} knex
 * @returns {Promise}
 */
exports.up = async (knex) => {
  await knex.schema.createTable('employees', (t) => {
    t.uuid('id', { primaryKey: true }).notNullable();
    t.string('role').notNullable();
  });

  return knex.schema.createTable('tasks', (t) => {
    t.uuid('id', { primaryKey: true }).defaultTo(
      knex.raw('uuid_generate_v4()'),
    );
    t.string('description').notNullable();
    t.boolean('completed').notNullable().defaultTo('false');
    t.decimal('price_assignee').notNullable();
    t.decimal('price_completed').notNullable();
    t.uuid('assignee_id').notNullable();

    t.foreign('assignee_id').references('employees.id');
    t.unique(['id', 'assignee_id'], { useConstraint: true });
  });
};

/**
 * Migration down
 * @param {import("knex")} knex
 * @returns {Promise}
 */
exports.down = async (knex) => {
  await knex.schema.dropTable('tasks');
  await knex.schema.dropTable('employees');
};
