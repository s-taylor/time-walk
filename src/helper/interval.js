const { IntervalValues } = require('../constants/values');

// multiple every key within an object by given multiplier
function multiplyValues(obj, multiplier) {
  return Object.keys(obj).reduce((result, key) => {
    return Object.assign({}, result, { [key]: obj[key] * multiplier });
  }, {});
}

function getAvgInterval(interval) {
  return Object.keys(interval).reduce((result, key) => {
    const amount = interval[key];
    const value = IntervalValues[key];
    const total = amount * value;
    return result + total;
  }, 0);
}

module.exports = {
  multiplyValues,
  getAvgInterval,
};
