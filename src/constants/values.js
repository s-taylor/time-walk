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
  y: Year,
  quarters: Quarter,
  Q: Quarter,
  months: Month,
  M: Month,
  weeks: Week,
  w: Week,
  days: Day,
  d: Day,
  hours: Hour,
  h: Hour,
  minutes: Minute,
  m: Minute,
  seconds: Second,
  s: Second,
  milliseconds: Millisecond,
  ms: Millisecond,
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
};
