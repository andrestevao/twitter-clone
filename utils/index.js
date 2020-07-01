const checkParams = (params) => {
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
  if (value == null || typeof value != "string") {
    return "";
  } else {
    return value.trim();
  }
};

module.exports = {
  checkParams,
  nullToString,
};
