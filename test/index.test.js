const test = require('ava');
const { SimpleRecur, toDate } = require('../src/index');
const moment = require('moment-timezone');

const tzDate = (date, tz) => moment.tz(date, tz).toDate();

test('.first - monthly', (t) => {
  const times = 5;
  const TZ = 'UTC';

  const recur = new SimpleRecur([2000, 5, 1], { months: 1 }, TZ);
  const result = toDate(recur.first(times));
  const expected = [
    tzDate([2000, 5, 1], TZ),
    tzDate([2000, 6, 1], TZ),
    tzDate([2000, 7, 1], TZ),
    tzDate([2000, 8, 1], TZ),
    tzDate([2000, 9, 1], TZ)
  ];

  t.is(result.length, times);
  t.deepEqual(result, expected);
});

test('.first - weekly', (t) => {
  const times = 5;
  const TZ = 'UTC';

  const recur = new SimpleRecur([2000, 5, 15], { weeks: 1 }, TZ);
  const result = toDate(recur.first(times));
  const expected = [
    tzDate([2000, 5, 15], TZ),
    tzDate([2000, 5, 22], TZ),
    tzDate([2000, 5, 29], TZ),
    tzDate([2000, 6, 6], TZ),
    tzDate([2000, 6, 13], TZ)
  ];

  t.is(result.length, times);
  t.deepEqual(result, expected);
});

