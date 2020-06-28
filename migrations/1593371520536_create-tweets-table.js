/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('tweets', {
        id: 'id',
        author: { type: 'int', notNull: true },
        response_to: { type: 'int'},
        createdAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        content: {type: 'varchar(280)'},
        active: {
            type: 'boolean',
            notNull: true,
            default: true,
        }
    })
};

exports.down = pgm => {
    pgm.dropTable('tweets', {
        ifExists: true
    })
};
