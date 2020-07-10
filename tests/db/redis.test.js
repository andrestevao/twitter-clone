const redis = require("../../db/redis");

test("should set key properly", () => {
  client = redis.newClient();
  client.set("test_session", "this_is_a_test").then((result) => {
    expect(result).toBe("OK");
  });
  client.quit();
});

test("should set expire on key (created before) properly", async () => {
  let client = redis.newClient();
  await client.expire("test_session", 1000);
  await client.ttl("test_session").then((result) => {
    expect(result).toBe(1000);
  });
  client.quit();
});

test("should get key (created before) properly", async () => {
  let client = redis.newClient();
  await client.get("test_session").then((result) => {
    expect(result).toBe("this_is_a_test");
  });
  client.quit();
});

test("should delete key (created before) properly", async () => {
  let client = redis.newClient();
  await client.del("test_session").then((result) => {
    expect(result).toBe(1);
  });
  client.quit();
});

afterAll(() => {
    let client = redis.newClient();
    client.del("test_session");
});
