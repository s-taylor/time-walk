const _ = require('lodash');
const moment = require('moment-timezone');
const {
  getAvgInterval,
  multiplyValues,
  simplify,
} = require('./helper/interval');

const timezones = moment.tz.names();
const toDate = mDates => mDates.map(mDate => mDate.toDate());
//const format = mDates => mDates.map(mDate => mDate.format());

function getFormatter(target) {
  if (target === 'moment') return _.identity;
  if (target === 'date') return mDate => mDate.toDate();
  if (target === 'string') return mDate => mDate.toISOString();
  throw new Error('invalid format');
}

function toFormat(data, format = 'date') {
  const formatter = getFormatter(format);
  if (_.isArray(data)) return data.map(formatter);
  return formatter(data);
}

class Dialga {
  constructor(start, interval, timezone) {
    // safeguard against user passing a moment object for the start date
    // where that object's timezone does not match the input timezone (3rd arg)
    if (start instanceof moment && start.tz() !== timezone) {
      throw new Error('start date\'s timezone, does not match timezone input');
    }

    this.start = moment.tz(start, timezone);
    this.interval = simplify(interval);
    this.avgInteval = getAvgInterval(this.interval);
    this.timezone = timezone;

    // TODO validate start format and interval and timezone
    if (!this.start.isValid()) throw new Error('start date cannot be parsed by moment');
    if (!timezones.includes(this.timezone)) throw new Error('timezone is invalid');
  }

  occurance(i, format) {
    if (typeof i !== 'number') throw new Error('first argument must be a number');
    if (i < 1) throw new Error('occurance value must be >= 1');
    const result = this.__occurance(i - 1);
    return toFormat(result, format);
  }

  // NOTE: this is not intended for external use as it uses a 0 index
  // which is confusing, use `occurance` instead
  __occurance(i) {
    if (i === 0) return this.start.clone();
    const addition = multiplyValues(this.interval, i);
    return this.start.clone().add(addition);
  }

  // get first X occurances for the defined rule
  first(count) {
    return _.times(count, i => this.__occurance(i));
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
    let i = initialMultiple;
    const result = [];
    while (!exit) {
      const date = this.__occurance(i);

      // NOTE: should include any date matching the "from", but exclude any matching the "to"
      if (date.isBetween(mFrom, mTo, null, '[)')) result.push(date);
      if (date.isAfter(mTo)) exit = true;

      i += 1;
    }

    return result;
  }

  toString() {
    const start = this.start.toISOString();
    const intervalKeys = Object.keys(this.interval).sort();
    const interval = intervalKeys.map(k => `${k}${this.interval[k]}`).join(':');
    return `START=${start};INTERVAL=${interval};TZ=${this.timezone};`;
  }
}

function parse(str) {
  const [, startStr] = /START=([^;]*);/.exec(str);
  const [, intervalStr] = /INTERVAL=([^;]*);/.exec(str);
  const [, tz] = /TZ=([^;]*);/.exec(str);

  const start = startStr.replace('T', ' ');
  const interval = intervalStr.split(':').reduce((result, value) => {
    if (value.length === 3) {
      return Object.assign({}, result, { [value.substring(0, 2)]: Number(value[2]) });
    }
    return Object.assign({}, result, { [value[0]]: Number(value[1]) });
  }, {});

  return new Dialga(start, interval, tz);
}

module.exports = { Dialga, toDate, parse };
