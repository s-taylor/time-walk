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
  years: Year,
  year: Year,
  y: Year,
  quarters: Quarter,
  quarter: Quarter,
  Q: Quarter,
  months: Month,
  month: Month,
  M: Month,
  weeks: Week,
  week: Week,
  w: Week,
  days: Day,
  day: Day,
  d: Day,
  hours: Hour,
  hour: Hour,
  h: Hour,
  minutes: Minute,
  minute: Minute,
  m: Minute,
  seconds: Second,
  second: Second,
  s: Second,
  milliseconds: Millisecond,
  millisecond: Millisecond,
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
}

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
