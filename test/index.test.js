const test = require('ava');
const sinon = require('sinon');
const moment = require('moment-timezone');
const momentjs = require('moment');
const { TimeWalk, parse } = require('../src/index');

/* eslint-disable new-cap */

// constructor

test('constructor - fails when start date is not a moment-timezone object', (t) => {
  const error = t.throws(
    () => new TimeWalk(new Date('2000-01-01'), { months: 1 }),
    Error
  );

  t.is(error.message, 'start must be a moment-timezone instance');
});

test('constructor - does not accept timezone agnostic moment', (t) => {
  const error = t.throws(
    () => new TimeWalk(new momentjs('2000-01-01'), { months: 1 }),
    Error
  );

  t.is(error.message, 'start must have a timezone defined');
});

test('constructor - fails with an invalid moment', (t) => {
  const error = t.throws(
    // 31st of Feb is invalid
    () => new TimeWalk(new moment.tz('2000-02-31', 'UTC'), { months: 1 }),
    Error
  );

  t.is(error.message, 'start date must be valid');
});

test('constructor - uses simplify', (t) => {
  const interval = { months: 1, days: 7 };
  const start = new moment.tz('2000-01-01', 'UTC');
  const rule = new TimeWalk(start, interval);

  const expected = { M: 1, d: 7 };
  t.deepEqual(expected, rule.interval);
});

// getter tests

test('.getStart - returns start date', (t) => {
  const TZ = 'Pacific/Auckland';
  const start = new moment.tz('2000-03-01', TZ);
  const rule = new TimeWalk(start, { months: 1 });

  t.deepEqual(rule.getStart(), start);
});

test('.getInterval - returns interval', (t) => {
  const TZ = 'Pacific/Auckland';
  const start = new moment.tz('2000-03-01', TZ);
  const interval = { d: 3, ms: 1 };
  const rule = new TimeWalk(start, interval);

  t.deepEqual(rule.getInterval(), interval);
});

test('.getTimezone - returns timezone from start date', (t) => {
  const TZ = 'Pacific/Auckland';
  const start = new moment.tz('2000-03-01', TZ);
  const interval = { d: 3, ms: 1 };
  const rule = new TimeWalk(start, interval);

  t.deepEqual(rule.getTimezone(), TZ);
});

// .occurance tests

test('.occurance - 1 gives the first occurance (matches rule start)', (t) => {
  const TZ = 'Pacific/Auckland';
  const start = new moment.tz('2000-03-01', TZ);
  const rule = new TimeWalk(start, { months: 1 });

  const result = rule.occurance(1);
  t.deepEqual(result, new moment.tz('2000-03-01', TZ).toDate());
});

test('.occurance - 5 gives the fifth occurance', (t) => {
  const TZ = 'Pacific/Auckland';
  const start = new moment.tz('2000-03-01', TZ);
  const rule = new TimeWalk(start, { months: 1 });

  const result = rule.occurance(5);
  t.deepEqual(result, new moment.tz('2000-07-01', TZ).toDate());
});

test('.occurance - allows specifying string output', (t) => {
  const TZ = 'Pacific/Auckland';
  const start = new moment.tz('2000-03-01', TZ);
  const rule = new TimeWalk(start, { months: 1 });

  const result = rule.occurance(1, 'string');
  t.deepEqual(result, new moment.tz('2000-03-01', TZ).toISOString());
});

test('.occurance - allows specifying moment output', (t) => {
  const TZ = 'Pacific/Auckland';
  const start = new moment.tz('2000-03-01', TZ);
  const rule = new TimeWalk(start, { months: 1 });

  const result = rule.occurance(1, 'moment');
  const expected = new moment.tz('2000-03-01', TZ);

  t.true(result instanceof moment);
  t.true(expected.isSame(result));
});

test('.occurance - throws error if i not a number', (t) => {
  const TZ = 'Pacific/Auckland';
  const start = new moment.tz('2000-03-01', TZ);
  const rule = new TimeWalk(start, { months: 1 });

  const error = t.throws(
    () => rule.occurance('1'),
    Error
  );

  t.is(
    error.message,
    'first argument must be a number'
  );
});


test('.occurance - 1 gives the first occurance (matches rule start)', (t) => {
  const TZ = 'Pacific/Auckland';
  const start = new moment.tz('2000-03-01', TZ);
  const rule = new TimeWalk(start, { months: 1 });

  const result = rule.occurance(1);
  t.deepEqual(result, new moment.tz('2000-03-01', TZ).toDate());
});

// .first tests

test('.first - gives correct number of occurences', (t) => {
  const TZ = 'UTC';
  const start = new moment.tz('2000-01-01', TZ);
  const rule = new TimeWalk(start, {});

  const times = 8;
  const result = rule.first(times);
  t.is(result.length, times);
});

test('.first - uses the TZ specified', (t) => {
  const TZ = 'Pacific/Auckland';
  const start = new moment.tz('2000-01-01', TZ);
  const rule = new TimeWalk(start, {});

  const times = 1;
  const result = rule.first(times);
  const expected = [new moment.tz('2000-01-01', TZ).toDate()];

  t.deepEqual(result, expected);
});

test('.first - monthly', (t) => {
  const TZ = 'UTC';
  const start = new moment.tz('2000-03-01', TZ);
  const rule = new TimeWalk(start, { months: 1 });

  const times = 5;
  const result = rule.first(times);
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
  const start = new moment.tz('2015-06-15', TZ);
  const rule = new TimeWalk(start, { weeks: 1 });

  const times = 5;
  const result = rule.first(times);
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
  const start = new moment.tz('2018-06-15', TZ);
  const rule = new TimeWalk(start, { days: 1 });

  const times = 5;
  const result = rule.first(times);
  const expected = [
    moment.tz('2018-06-15', TZ).toDate(),
    moment.tz('2018-06-16', TZ).toDate(),
    moment.tz('2018-06-17', TZ).toDate(),
    moment.tz('2018-06-18', TZ).toDate(),
    moment.tz('2018-06-19', TZ).toDate(),
  ];
  t.deepEqual(result, expected);
});

test('.occurance - allows specifying string output', (t) => {
  const TZ = 'UTC';
  const start = new moment.tz('2018-06-15', TZ);
  const rule = new TimeWalk(start, { days: 1 });

  const result = rule.first(1, 'string');
  const expected = [moment.tz('2018-06-15', TZ).toISOString()];
  t.deepEqual(result, expected);
});

test('.occurance - allows specifying moment output', (t) => {
  const TZ = 'UTC';
  const start = new moment.tz('2018-06-15', TZ);
  const rule = new TimeWalk(start, { days: 1 });

  const result = rule.first(1, 'moment');
  const expected = [moment.tz('2018-06-15', TZ)];

  t.is(result.length, 1);
  t.true(result[0] instanceof moment);
  t.true(expected[0].isSame(result[0]));
});

// .between tests

test('.between - daily', (t) => {
  const TZ = 'UTC';
  const start = new moment.tz('2012-08-22', TZ);
  const rule = new TimeWalk(start, { days: 1 });

  const from = new moment.tz('2013-05-03', TZ);
  const to = new moment.tz('2013-05-08', TZ);
  const result = rule.between(from, to);
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
  const start = new moment.tz('2012-08-22', TZ);
  const rule = new TimeWalk(start, { days: 1 });

  const from = new moment.tz('2013-05-02 20:00:00', TZ);
  const to = new moment.tz('2013-05-07 15:00:00', TZ);
  const result = rule.between(from, to);
  const expected = [
    new moment.tz('2013-05-03', TZ).toDate(),
    new moment.tz('2013-05-04', TZ).toDate(),
    new moment.tz('2013-05-05', TZ).toDate(),
    new moment.tz('2013-05-06', TZ).toDate(),
    new moment.tz('2013-05-07', TZ).toDate(),
  ];
  t.deepEqual(result, expected);
});

test('.between - allow specifying string output', (t) => {
  const TZ = 'UTC';
  const start = new moment.tz('2012-08-22', TZ);
  const rule = new TimeWalk(start, { days: 1 });

  const from = new moment.tz('2013-05-03', TZ);
  const to = new moment.tz('2013-05-04', TZ);
  const result = rule.between(from, to, 'string');
  const expected = [new moment.tz('2013-05-03', TZ).toISOString()];

  t.deepEqual(result, expected);
});

test('.between - allow specifying moment output', (t) => {
  const TZ = 'UTC';
  const start = new moment.tz('2012-08-22', TZ);
  const rule = new TimeWalk(start, { days: 1 });

  const from = new moment.tz('2013-05-03', TZ);
  const to = new moment.tz('2013-05-04', TZ);
  const result = rule.between(from, to, 'moment');
  const expected = [new moment.tz('2013-05-03', TZ)];

  t.is(result.length, 1);
  t.true(result[0] instanceof moment);
  t.true(expected[0].isSame(result[0]));
});

test('.between - daylight savings test', (t) => {
  const TZ = 'Australia/Sydney';
  const start = new moment.tz('2017-09-30 00:00:00', TZ);
  // Daylight savings changes on 1st of October 2017
  const rule = new TimeWalk(start, { days: 1 });

  // Pre-Daylight Savings
  // 12pm (Midnight) in Sydney === 2pm UTC
  const from = new moment.tz('2017-09-30', TZ);
  const to = new moment.tz('2017-10-04', TZ);
  const result = rule.between(from, to);
  const expected = [
    new Date('2017-09-29T14:00:00.000Z'),
    new Date('2017-09-30T14:00:00.000Z'),
    new Date('2017-10-01T13:00:00.000Z'),
    new Date('2017-10-02T13:00:00.000Z'),
  ];
  t.deepEqual(result, expected);
});

// this is to ensure results are accurate using getAverageInterval
// month, quarter and year values are all averages so may be affected
// by large differences between rule "start", and between "from"
test('.between - where from date is far in the future', (t) => {
  const TZ = 'UTC';
  const start = new moment.tz('2017-05-03', TZ);
  const rule = new TimeWalk(start, { days: 7 }); // Wednesday 3rd May 2017 UTC

  const from = new moment.tz('2117-05-05', TZ);
  const to = new moment.tz('2117-06-02', TZ);
  const result = rule.between(from, to);
  const expected = [
    moment.tz('2117-05-05', TZ).toDate(),
    moment.tz('2117-05-12', TZ).toDate(),
    moment.tz('2117-05-19', TZ).toDate(),
    moment.tz('2117-05-26', TZ).toDate(),
  ];
  t.deepEqual(result, expected);
});

test('.between - performance test', (t) => {
  const TZ = 'UTC';
  const start = new moment.tz('2017-05-03', TZ);
  const rule = new TimeWalk(start, { days: 7 }); // Wednesday 3rd May 2017 UTC

  const spy = sinon.spy(rule, '__occurance');
  const from = new moment.tz('2117-05-05', TZ);
  const to = new moment.tz('2117-06-02', TZ);
  rule.between(from, to);

  // '2117-05-05', '2117-05-12', '2117-05-19', '2117-05-26';
  const expectedLength = 4;

  // occurance should never be worse than the
  // expected number of dates + 2 additional iterations
  t.true(spy.callCount > 0, 'occurance has not been called');
  t.true(
    spy.callCount <= (expectedLength + 2),
    'occurance count must not exceed expected date count + 2'
  );
});

// .toString tests

test('.toString - must return stringified rule', (t) => {
  const TZ = 'Australia/Sydney';
  const start = new moment.tz('2000-01-01', TZ);
  const rule = new TimeWalk(start, { days: 1, years: 3 });
  const result = rule.toString();

  const expected = 'START=1999-12-31T13:00:00.000Z;INTERVAL=d1:y3;TZ=Australia/Sydney;';
  t.is(result, expected);
});

// .parse tests

test('.parse - must return expected TimeWalk object', (t) => {
  const ruleStr = 'START=1999-12-31T13:00:00.000Z;INTERVAL=d1:y3;TZ=Australia/Sydney;';
  const result = parse(ruleStr);

  const expectedStart = moment.tz('2000-01-01', 'Australia/Sydney');
  t.true(result.start instanceof moment);
  t.true(result.start.isSame(expectedStart));

  t.deepEqual(result.interval, { d: 1, y: 3 });
});

/* eslint-disable new-cap */
