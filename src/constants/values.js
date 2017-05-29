const DaysInYear = 365.25;

const Millisecond = 1;
const Second = 1000;
const Minute = 1000 * 60;
const Hour = 1000 * 60 * 60;
const Day = 1000 * 60 * 60 * 24;
const Week = 1000 * 60 * 60 * 24 * 7;
const Month = (DaysInYear * Day) / 12;
const Quarter = (DaysInYear * Day) / 4;
const Year = DaysInYear * Day;

const IntervalValues = {
  y: Year,
  Q: Quarter,
  M: Month,
  w: Week,
  d: Day,
  h: Hour,
  m: Minute,
  s: Second,
  ms: Millisecond,
};

const SimplifyLookup = {
  years: 'y',
  year: 'y',
  y: 'y',
  quarters: 'Q',
  quarter: 'Q',
  Q: 'Q',
  months: 'M',
  month: 'M',
  M: 'M',
  weeks: 'w',
  week: 'w',
  w: 'w',
  days: 'd',
  day: 'd',
  d: 'd',
  hours: 'h',
  hour: 'h',
  h: 'h',
  minutes: 'm',
  minute: 'm',
  m: 'm',
  seconds: 's',
  second: 's',
  s: 's',
  milliseconds: 'ms',
  millisecond: 'ms',
  ms: 'ms',
};

module.exports = {
  Millisecond,
  Second,
  Minute,
  Hour,
  Day,
  Week,
  Month,
  Quarter,
  Year,
  IntervalValues,
  SimplifyLookup,
};
