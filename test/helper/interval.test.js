const test = require('ava');
const { getAvgInterval, simplify } = require('../../src/helper/interval');
const values = require('../../src/constants/values');

// .getAvgInterval tests

test('.getAvgInterval - calculates correct values using plural words', (t) => {
  const interval = { months: 2, days: 3 };
  const result = getAvgInterval(interval);
  const expected = (values.Month * 2) + (values.Day * 3);

  t.is(result, expected);
});

test('.getAvgInterval - calculates correct values using singular words', (t) => {
  const interval = { day: 1, minute: 1 };
  const result = getAvgInterval(interval);
  const expected = values.Day + values.Minute;

  t.is(result, expected);
});

test('.getAvgInterval - calculates correct values using shorthand', (t) => {
  const interval = { Q: 2, m: 30 };
  const result = getAvgInterval(interval);
  const expected = (values.Quarter * 2) + (values.Minute * 30);

  t.is(result, expected);
});

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
