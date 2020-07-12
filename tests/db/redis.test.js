const redis = require("../../db/redis");

let client = redis.newClient();

test("should set key properly", () => {
  return client.set("test_session", "this_is_a_test").then((result) => {
    expect(result).toBe("OK");
  });
});

test("should set expire on key (created before) properly", async () => {
  await client.expire("test_session", 1000);
  return client.ttl("test_session").then((result) => {
    expect(result).toBe(1000);
  });
});

test("should get key (created before) properly", async () => {
  return client.get("test_session").then((result) => {
    expect(result).toBe("this_is_a_test");
  });
});

test("should delete key (created before) properly", async () => {
  return client.del("test_session").then((result) => {
    expect(result).toBe(1);
  });
});

afterAll(() => {
  client.quit();
});
