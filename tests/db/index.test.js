const db = require("../../db");

test("should connect and query properly", () => {
  return db.query('select 1 "1"').then((data) => {
    expect(Array.isArray(data.rows)).toBe(true);
    expect(data.rows[0]).toEqual(
      expect.objectContaining({
        "1": 1,
      })
    );
  });
});

test("should fail properly with bad query", () => {
  return db.query("this is not a query", []).catch((e) => {
    expect(e).toEqual(Error('syntax error at or near "this"'));
  });
});

afterAll(() => {
  db.end();
});
