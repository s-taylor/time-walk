const _ = require('lodash');
const moment = require('moment-timezone');

//const zones = moment.tz.names().slice(500);
//console.log('zones', zones);
const toDate = mDates => mDates.map(mDate => mDate.toDate());
const format = mDates => mDates.map(mDate => mDate.format());

// multiple every key within an object by given multiplier
function multiplyValues(obj, multiplier) {
  return Object.keys(obj).reduce((result, key) => {
    return Object.assign({}, result, { [key]: obj[key] * multiplier });
  }, {});
}

class SimpleRecur {
  constructor(start, interval, timezone) {
    this.start = moment.tz(start, timezone); // why UTC invalid?
    this.interval = interval;
    this.timezone = timezone;
    // TODO validate start format and interval and timezone
  }

  firstOccurances(count) {
    return _.times(count, (i) => {
      const addition = multiplyValues(this.interval, i);
      return this.start.clone().add(addition);
    });
  }
}

const start = [2017, 0, 31]; // 1st Jan
const interval = { months: 1 };
const TZ = 'Pacific/Auckland';
const count = 12;

const recurTest = new SimpleRecur(start, interval, TZ);
const first = recurTest.firstOccurances(count);
console.log('format(first)', format(first));
console.log('toDate(first)', toDate(first));
