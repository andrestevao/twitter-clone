const redisClient = require("../../db/redis");

test("should set key properly", () => {
    return redisClient.set("test_session", "this_is_a_test")
        .then(result => {
            expect(result).toBe("OK");
        });
});

test("should set expire on key (created before) properly", async () => {
    await redisClient.expire("test_session", 1000);
    return redisClient.ttl("test_session")
    .then(result => {
        expect(result).toBe(1000);
    });
});

test("should get key (created before) properly", () => {
    return redisClient.get("test_session")
    .then(result => {
        expect(result).toBe("this_is_a_test");
    });
});

test("should delete key (created before) properly", () => {
    return redisClient.del("test_session")
    .then(result => {
        expect(result).toBe(1);
    });
});

afterAll(() => {
    redisClient.quit();
});
