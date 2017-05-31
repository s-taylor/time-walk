const test = require('ava');
const moment = require('moment-timezone');
const {
  Dialga,
  toDate,
  parse,
} = require('../src/index');

/* eslint-disable new-cap */

// constructor
test('constructor - fails when invalid moment date format', (t) => {
  t.throws(
    () => new Dialga('2000-02-31', { months: 1 }, 'UTC'), // 31st February is not valid date
    Error,
    'start date cannot be parsed by moment'
  );
});

test('constructor - fails when timezone invalid', (t) => {
  t.throws(
    () => new Dialga('2000-01-01', { months: 1 }, 'Adventure/Time'),
    Error,
    'timezone is invalid'
  );
});

test('constructor - fails when start timezone doesn\'t match input timezone', (t) => {
  const start = new moment.tz('2000-01-01', 'Pacific/Auckland');

  t.throws(
    () => new Dialga(start, { months: 1 }, 'Australia/Sydney'),
    Error,
    'start date\'s timezone, does not match timezone input'
  );
});

test('constructor - uses simplify', (t) => {
  const interval = { months: 1, days: 7 };
  const rule = new Dialga('2000-01-01', interval, 'UTC');

  const expected = { M: 1, d: 7 };
  t.deepEqual(expected, rule.interval);
});

// .occurance tests

test('.occurance - 0 gives the first occurance (matches rule start)', (t) => {
  const TZ = 'UTC';
  const rule = new Dialga('2000-03-01', { months: 1 }, TZ);

  const result = rule.occurance(0);
  t.deepEqual(result.toDate(), new moment.tz('2000-03-01', TZ).toDate());
});

test('.occurance - 4 gives the fifth occurance', (t) => {
  const TZ = 'UTC';
  const rule = new Dialga('2000-03-01', { months: 1 }, TZ);

  const result = rule.occurance(4);
  t.deepEqual(result.toDate(), new moment.tz('2000-07-01', TZ).toDate());
});

test('.occurance - throws error if i not a number', (t) => {
  const TZ = 'UTC';
  const rule = new Dialga('2000-03-01', { months: 1 }, TZ);

  t.throws(
    () => rule.occurance('1'),
    Error,
    'first argument must be a number'
  );
});

// .first tests

test('.first - gives correct number of occurences', (t) => {
  const TZ = 'UTC';
  const rule = new Dialga('2000-01-01', {}, TZ);

  const times = 8;
  const result = toDate(rule.first(times));
  t.is(result.length, times);
});

test('.first - uses the TZ specified', (t) => {
  const TZ = 'Pacific/Auckland';
  const rule = new Dialga('2000-01-01', {}, TZ);

  const times = 1;
  const result = toDate(rule.first(times));
  const expected = [new moment.tz('2000-01-01', TZ).toDate()];

  t.deepEqual(result, expected);
});

test('.first - monthly', (t) => {
  const TZ = 'UTC';
  const rule = new Dialga('2000-03-01', { months: 1 }, TZ);

  const times = 5;
  const result = toDate(rule.first(times));
  const expected = [
    moment.tz('2000-03-01', TZ).toDate(),
    moment.tz('2000-04-01', TZ).toDate(),
    moment.tz('2000-05-01', TZ).toDate(),
    moment.tz('2000-06-01', TZ).toDate(),
    moment.tz('2000-07-01', TZ).toDate(),
  ];
  t.deepEqual(result, expected);
});

test('.first - weekly', (t) => {
  const TZ = 'UTC';
  const rule = new Dialga('2015-06-15', { weeks: 1 }, TZ);

  const times = 5;
  const result = toDate(rule.first(times));
  const expected = [
    moment.tz('2015-06-15', TZ).toDate(),
    moment.tz('2015-06-22', TZ).toDate(),
    moment.tz('2015-06-29', TZ).toDate(),
    moment.tz('2015-07-06', TZ).toDate(),
    moment.tz('2015-07-13', TZ).toDate(),
  ];
  t.deepEqual(result, expected);
});

test('.first - daily', (t) => {
  const TZ = 'UTC';
  const rule = new Dialga('2018-06-15', { days: 1 }, TZ);

  const times = 5;
  const result = toDate(rule.first(times));
  const expected = [
    moment.tz('2018-06-15', TZ).toDate(),
    moment.tz('2018-06-16', TZ).toDate(),
    moment.tz('2018-06-17', TZ).toDate(),
    moment.tz('2018-06-18', TZ).toDate(),
    moment.tz('2018-06-19', TZ).toDate(),
  ];
  t.deepEqual(result, expected);
});

// .between tests

test('.between - daily', (t) => {
  const TZ = 'UTC';
  const rule = new Dialga('2012-08-22', { days: 1 }, TZ);

  const result = toDate(rule.between('2013-05-03', '2013-05-08'));
  const expected = [
    new moment.tz('2013-05-03', TZ).toDate(),
    new moment.tz('2013-05-04', TZ).toDate(),
    new moment.tz('2013-05-05', TZ).toDate(),
    new moment.tz('2013-05-06', TZ).toDate(),
    new moment.tz('2013-05-07', TZ).toDate(),
  ];

  t.deepEqual(result, expected);
});

test('.between - daily where from and to do not match rule', (t) => {
  const TZ = 'UTC';
  const rule = new Dialga('2012-08-22', { days: 1 }, TZ);

  const result = toDate(
    rule.between('2013-05-02 20:00:00', '2013-05-07 15:00:00')
  );
  const expected = [
    new moment.tz('2013-05-03', TZ).toDate(),
    new moment.tz('2013-05-04', TZ).toDate(),
    new moment.tz('2013-05-05', TZ).toDate(),
    new moment.tz('2013-05-06', TZ).toDate(),
    new moment.tz('2013-05-07', TZ).toDate(),
  ];
  t.deepEqual(result, expected);
});

// this is to ensure results are accurate using getAverageInterval
// month, quarter and year values are all averages so may be affected
// by large differences between rule "start", and between "from"
test('.between - where from date is far in the future', (t) => {
  const TZ = 'UTC';
  const rule = new Dialga('2017-05-03', { days: 7 }, TZ); // Wednesday 3rd May 2017 UTC

  const result = toDate(rule.between('2117-05-05', '2117-06-02'));
  const expected = [
    moment.tz('2117-05-05', TZ).toDate(),
    moment.tz('2117-05-12', TZ).toDate(),
    moment.tz('2117-05-19', TZ).toDate(),
    moment.tz('2117-05-26', TZ).toDate(),
  ];
  t.deepEqual(result, expected);
});

test('.between - daylight savings test', (t) => {
  const TZ = 'Australia/Sydney';
  // Daylight savings changes on 1st of October 2017
  const rule = new Dialga('2017-09-30 00:00:00', { days: 1 }, TZ);

  // Pre-Daylight Savings
  // 12pm (Midnight) in Sydney === 2pm UTC
  const result = toDate(rule.between('2017-09-30', '2017-10-04'));
  const expected = [
    new Date('2017-09-29T14:00:00.000Z'),
    new Date('2017-09-30T14:00:00.000Z'),
    new Date('2017-10-01T13:00:00.000Z'),
    new Date('2017-10-02T13:00:00.000Z'),
  ];
  t.deepEqual(result, expected);
});

// .toString tests

test('.toString - must return stringified rule', (t) => {
  const rule = new Dialga('2000-01-01', { days: 1, years: 3 }, 'Australia/Sydney');
  const result = rule.toString();

  const expected = 'START=1999-12-31T13:00:00.000Z;INTERVAL=d1:y3;TZ=Australia/Sydney;';
  t.is(result, expected);
});

// .parse tests

test('.parse - must return expected Dialga object', (t) => {
  const ruleStr = 'START=1999-12-31T13:00:00.000Z;INTERVAL=d1:y3;TZ=Australia/Sydney;';
  const result = parse(ruleStr);

  t.deepEqual(result.start.toDate(), moment.tz('2000-01-01', 'Australia/Sydney').toDate());
  t.deepEqual(result.interval, { d: 1, y: 3 });
  t.is(result.timezone, 'Australia/Sydney');
});

/* eslint-disable new-cap */
