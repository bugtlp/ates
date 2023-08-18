/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
  await knex.schema.createTable('employees', (t) => {
    t.increments('id', { primaryKey: true }); // приватный ид
    t.uuid('public_id').notNullable(); // публичный ид
    t.string('role').notNullable();
  });

  return knex.schema.createTable('tasks', (t) => {
    t.increments('id', { primaryKey: true }); // приватный ид
    t.uuid('public_id').notNullable(); // публичный ид
    t.string('description').notNullable();
    t.decimal('price_assignee').notNullable();
    t.decimal('price_completed').notNullable();
    t.integer('assignee_id').notNullable();

    t.foreign('assignee_id').references('employees.id');
    t.unique(['id', 'assignee_id'], { useConstraint: true });
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {};
