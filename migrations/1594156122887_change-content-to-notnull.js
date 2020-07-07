/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.alterColumn("tweets", "content", {
    notNull: true,
  });
};

exports.down = (pgm) => {
  pgm.alterColumn("tweets", "content", {
    notNull: false,
  });
};
