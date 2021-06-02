const moment = require("moment");

const isDate = (valueField) => {
  console.log(valueField);
  if (!valueField) {
    return false;
  }
  const fecha = moment(valueField);
  if (fecha.isValid) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  isDate,
};
