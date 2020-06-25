/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addConstraint('users', 'unique_username', {
        unique: 'username'
    });

    pgm.createSequence('user_id', {
        start: 1
    });
};

exports.down = pgm => {
    pgm.dropConstraint('users', 'unique_username', {
        ifExists: true
    });

    pgm.dropSequence('next_user_id', {
        ifExists: true
    });
};
