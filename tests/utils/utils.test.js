const utils = require("../../utils");

test("should transform null value to empty string", () => {
  expect(utils.nullToString(null)).toBe("");
});

test("should trim string", () => {
  expect(utils.nullToString("   space test   ")).toBe("space test");
  expect(utils.nullToString("     tab test      ")).toBe("tab test");
});

test("should return value if not a string", () => {
  expect(utils.nullToString(9)).toStrictEqual(9);
  expect(utils.nullToString(["cat", "dog"])).toStrictEqual(["cat", "dog"]);
  expect(utils.nullToString(true)).toStrictEqual(true);
});

test("should return empty attributes of object in an array", () => {
  let params = {
    test: "test",
    test2: "test2",
    test3: "",
    test4: "test4",
    test5: "",
  };

  expect(utils.checkParams(params)).toStrictEqual(["test3", "test5"]);
});

test("should return null if input is not an object", () => {
  expect(utils.checkParams("test")).toBeNull();
  expect(utils.checkParams(["test", "test2"])).toBeNull();
  expect(utils.checkParams(true)).toBeNull();
  expect(utils.checkParams(null)).toBeNull();
});
