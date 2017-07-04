const test = require('ava');
const { getAvgInterval, simplify } = require('../../lib/helper/interval');
const values = require('../../lib/constants/values');

// .getAvgInterval tests

test('.getAvgInterval - calculates the expected value', (t) => {
  const interval = { Q: 2, m: 30 };
  const result = getAvgInterval(interval);
  const expected = (values.Quarter * 2) + (values.Minute * 30);

  t.is(result, expected);
});

// .simplify tests

test('.simplify - changes all values to their shorthand', (t) => {
  const interval = { years: 2, month: 1, milliseconds: 20 };
  const result = simplify(interval);
  const expected = { y: 2, M: 1, ms: 20 };

  t.deepEqual(result, expected);
});

test('.simplify - errors on invalid keys', (t) => {
  const interval = { years: 2, unicorns: 2 };

  const error = t.throws(
    () => simplify(interval),
    Error
  );

  t.is(error.message, 'Invalid time interval: unicorns');
});

test('.simplify - drops invalid values', (t) => {
  const interval = { years: 2, year: 4 };

  const error = t.throws(
    () => simplify(interval),
    Error
  );

  t.is(error.message, 'Duplicate time interval: year');
});
