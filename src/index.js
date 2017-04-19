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

// converts a moment object from one timezone to another while maintaining the same time relative to the zone
function changeZone(mDate, toZone) {
  mDate.format(); //2016-08-30T22:00:00-06:00
  return moment.tz(mDate.format('YYYY-MM-DDTHH:mm:ss.SSS'), moment.ISO_8601, toZone);
}

//const testChange = changeZone(moment.tz([2000, 0, 1], 'UTC'), 'Pacific/Auckland');
//console.log('testChange.format()', testChange.format());
//console.log('testChange.toDate()', testChange.toDate());

class SimpleRecur {
  constructor(start, interval, timezone) {
    this.start = moment.tz(start, timezone); // why UTC invalid?
    this.interval = interval;
    this.timezone = timezone;
    // TODO validate start format and interval and timezone
  }

  // get first X occurances for the defined rule
  first(count) {
    return _.times(count, (i) => {
      const addition = multiplyValues(this.interval, i);
      return this.start.clone().add(addition);
    });
  }

  // get occurances between defined dates
  // WARNING: performance is subject to how far apart from/to are from the rule start date
  between(from, to) {
    const mFrom = moment.tz(from, this.timezone);
    const mTo = moment.tz(to, this.timezone);

    const start = this.start.clone();

    let exit = false;
    let i = 0;
    const result = [];
    while (!exit) {
      const addition = multiplyValues(this.interval, i);
      const date = start.clone().add(addition);

      // NOTE: should include any date matching the "from", but exclude any matching the "to"
      if (date.isBetween(mFrom, mTo, null, '[)')) result.push(date);
      if (date.isAfter(mTo)) exit = true;

      i += 1;
    }

    console.log('this took', i, 'iterations');
    return result;
  }
}

module.exports = { SimpleRecur, toDate };

//const start = [2017, 0, 31]; // 1st Jan
//const interval = { months: 1 };
//const TZ = 'Pacific/Auckland';

//const recurTest = new SimpleRecur(start, interval, TZ);

//const first = recurTest.first(12);
//console.log('format(first)', format(first));
//console.log('toDate(first)', toDate(first));

//const between = recurTest.between([2019, 2 ,15], [2020, 0, 3]);
//console.log('format(between)', format(between));
//console.log('toDate(between)', toDate(between));


