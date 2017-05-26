const {
  IntervalValues,
  SimplifyLookup,
} = require('../constants/values');

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

function simplify(interval) {
  return Object.keys(interval).reduce((result, key) => {
    const converted = SimplifyLookup[key];
    // filter out keys that don't match
    if (!converted) throw new Error(`Invalid time interval: ${key}`);
    if (result[converted] != null) throw new Error(`Duplicate time interval: ${key}`);
    return Object.assign({}, result, { [converted]: interval[key] });
  }, {});
}

module.exports = {
  getAvgInterval,
  multiplyValues,
  simplify,
};
