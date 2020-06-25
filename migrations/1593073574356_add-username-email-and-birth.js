/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns('users', {
        
        username: { type: 'varchar(15)', notNull: true },
        email: { type: 'varchar(50)', notNull: true },
        birth: { type: 'date', notNull: true },
        
    })
};

exports.down = pgm => {};
