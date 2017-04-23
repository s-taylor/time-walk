const test = require('ava');
const moment = require('moment-timezone');
const {
  Dialga,
  toDate,
  getAvgInterval,
} = require('../src/index');
const values = require('../src/constants/values');

const tzDate = (date, tz) => moment.tz(date, tz).toDate();

test('.first - gives correct number of occurences', (t) => {
  const times = 8;
  const TZ = 'UTC';

  const rule = new Dialga([2000, 0, 1], {}, TZ);
  const result = toDate(rule.first(times));

  t.is(result.length, times);
});

test('.first - uses the TZ specified', (t) => {
  const times = 1;
  const TZ = 'Pacific/Auckland';

  const rule = new Dialga([2000, 0, 1], {}, TZ);
  const result = toDate(rule.first(times));
  const expected = [
    tzDate([2000, 0, 1], TZ),
  ];

  t.deepEqual(result, expected);
});

test('.first - monthly', (t) => {
  const times = 5;
  const TZ = 'UTC';

  const rule = new Dialga([2000, 2, 1], { months: 1 }, TZ);
  const result = toDate(rule.first(times));
  const expected = [
    tzDate([2000, 2, 1], TZ),
    tzDate([2000, 3, 1], TZ),
    tzDate([2000, 4, 1], TZ),
    tzDate([2000, 5, 1], TZ),
    tzDate([2000, 6, 1], TZ),
  ];

  t.deepEqual(result, expected);
});

test('.first - weekly', (t) => {
  const times = 5;
  const TZ = 'UTC';

  const rule = new Dialga([2015, 5, 15], { weeks: 1 }, TZ);
  const result = toDate(rule.first(times));
  const expected = [
    tzDate([2015, 5, 15], TZ),
    tzDate([2015, 5, 22], TZ),
    tzDate([2015, 5, 29], TZ),
    tzDate([2015, 6, 6], TZ),
    tzDate([2015, 6, 13], TZ),
  ];

  t.deepEqual(result, expected);
});

test('.first - daily', (t) => {
  const times = 5;
  const TZ = 'UTC';

  const rule = new Dialga([2018, 5, 15], { days: 1 }, TZ);
  const result = toDate(rule.first(times));
  const expected = [
    tzDate([2018, 5, 15], TZ),
    tzDate([2018, 5, 16], TZ),
    tzDate([2018, 5, 17], TZ),
    tzDate([2018, 5, 18], TZ),
    tzDate([2018, 5, 19], TZ),
  ];

  t.deepEqual(result, expected);
});

test('.between - daily', (t) => {
  const TZ = 'UTC';

  const rule = new Dialga([2012, 7, 22], { days: 1 }, TZ);
  const start = [2013, 4, 3];
  const end = [2013, 4, 8];
  const result = toDate(rule.between(start, end));
  const expected = [
    tzDate([2013, 4, 3], TZ),
    tzDate([2013, 4, 4], TZ),
    tzDate([2013, 4, 5], TZ),
    tzDate([2013, 4, 6], TZ),
    tzDate([2013, 4, 7], TZ),
  ];

  t.deepEqual(result, expected);
});

test('.between - daily where from and to do not match rule', (t) => {
  const TZ = 'UTC';

  const rule = new Dialga([2012, 7, 22], { days: 1 }, TZ);
  const start = [2013, 4, 2, 8]; // 8pm
  const end = [2013, 4, 7, 3]; // 3pm
  const result = toDate(rule.between(start, end));
  const expected = [
    tzDate([2013, 4, 3], TZ),
    tzDate([2013, 4, 4], TZ),
    tzDate([2013, 4, 5], TZ),
    tzDate([2013, 4, 6], TZ),
    tzDate([2013, 4, 7], TZ),
  ];

  t.deepEqual(result, expected);
});

test('.getAvgInterval - calculates correct values using words', (t) => {
  const interval = { months: 2, days: 1 };
  const result = getAvgInterval(interval);
  const expected = (values.Month * 2) + values.Day;

  t.is(result, expected);
});


test('.getAvgInterval - calculates correct values using shorthand', (t) => {
  const interval = { Q: 2, m: 30 };
  const result = getAvgInterval(interval);
  const expected = (values.Quarter * 2) + (values.Minute * 30);

  t.is(result, expected);
});
