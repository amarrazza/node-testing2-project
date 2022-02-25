
exports.up = function(knex) {
    return knex.schema.createTable("users", tbl => {
        tbl.increments();
    
        tbl.string("name", 28).unique().notNullable();
      });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("users");
};
