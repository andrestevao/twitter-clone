const checkParams = (params) => {
  if (Object.prototype.toString.call(params) != "[object Object]") {
    return null;
  }

  let paramsMissing = [];
  let paramsArray = Object.entries(params);

  paramsArray.map((param) => {
    if (param[1].length == 0) {
      paramsMissing.push(param[0]);
    }
  });

  return paramsMissing;
};

const nullToString = (value) => {
  if (typeof value == "string") {
    return value.trim();
  }

  if (value !== null) {
    return value;
  }

  return "";
};

module.exports = {
  checkParams,
  nullToString,
};
