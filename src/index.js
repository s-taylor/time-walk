const _ = require('lodash');
const moment = require('moment-timezone');
const { IntervalValues } = require('./constants/values');

//const zones = moment.tz.names().slice(500);
//console.log('zones', zones);
const toDate = mDates => mDates.map(mDate => mDate.toDate());
//const format = mDates => mDates.map(mDate => mDate.format());

// multiple every key within an object by given multiplier
function multiplyValues(obj, multiplier) {
  return Object.keys(obj).reduce((result, key) => {
    return Object.assign({}, result, { [key]: obj[key] * multiplier });
  }, {});
}

// converts a moment object from one timezone to another while maintaining the same time relative
// to the zone
//function changeZone(mDate, toZone) {
  //mDate.format(); //2016-08-30T22:00:00-06:00
  //return moment.tz(mDate.format('YYYY-MM-DDTHH:mm:ss.SSS'), moment.ISO_8601, toZone);
//}

//const testChange = changeZone(moment.tz([2000, 0, 1], 'UTC'), 'Pacific/Auckland');
//console.log('testChange.format()', testChange.format());
//console.log('testChange.toDate()', testChange.toDate());

function getAvgInterval(interval) {
  return Object.keys(interval).reduce((result, key) => {
    const amount = interval[key];
    const value = IntervalValues[key];
    const total = amount * value;
    return result + total;
  }, 0);
}

class Dialga {
  constructor(start, interval, timezone) {
    this.start = moment.tz(start, timezone); // why UTC invalid?
    this.interval = interval;
    // TODO - use this to find the starting point for between
    // "to" minus "from" / "avgInterval" and then maybe minus 1 to cater for variance ?
    this.avgInteval = getAvgInterval(interval);
    this.timezone = timezone;
    // TODO validate start format and interval and timezone
  }

  // NOTE: this is 0 indexed, 0 will return the first occurance (matches rule start)
  occurance(i) {
    if (i === 0) return this.start.clone();
    const addition = multiplyValues(this.interval, i);
    return this.start.clone().add(addition);
  }

  // get first X occurances for the defined rule
  first(count) {
    return _.times(count, i => this.occurance(i));
  }

  // get occurances between defined dates
  between(from, to) {
    const mFrom = moment.tz(from, this.timezone);
    const mTo = moment.tz(to, this.timezone);

    // how far from rule start to between start ("from")
    const distance = mFrom.toDate() - this.start.toDate();
    // calculate approximately how many intervals to use for the start position
    const initialMultiple = Math.floor(distance / this.avgInteval);

    let exit = false;
    // FOR PERFORMANCE TRACKING ONLY
    let iterationCount = 0;
    let i = initialMultiple;
    const result = [];
    while (!exit) {
      const date = this.occurance(i);

      // NOTE: should include any date matching the "from", but exclude any matching the "to"
      if (date.isBetween(mFrom, mTo, null, '[)')) result.push(date);
      if (date.isAfter(mTo)) exit = true;

      iterationCount += 1;
      i += 1;
    }

    console.log('this took', iterationCount, 'iterations');
    return result;
  }
}

module.exports = { Dialga, toDate, getAvgInterval };
