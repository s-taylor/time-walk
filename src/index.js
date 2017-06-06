const _ = require('lodash');
const moment = require('moment-timezone');
const {
  getAvgInterval,
  multiplyValues,
  simplify,
} = require('./helper/interval');

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
  constructor(start, interval) {
    if (!(start instanceof moment)) throw new Error('start must be a moment-timezone instance');
    if (typeof start.tz !== 'function' || start.tz() == null) {
      throw new Error('start must have a timezone defined');
    }
    if (!start.isValid()) throw new Error('start date must be valid');

    this.start = start;
    this.interval = simplify(interval);
    this.avgInteval = getAvgInterval(this.interval);
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
  first(count, format) {
    const result = _.times(count, i => this.__occurance(i));
    return toFormat(result, format);
  }

  // get occurances between defined dates
  between(from, to, format) {
    // TODO - WRITE TESTS!
    if (!(from instanceof moment)) throw new Error('from must be a moment-timezone instance');
    if (!from.isValid()) throw new Error('from date must be valid');
    if (!(to instanceof moment)) throw new Error('to must be a moment-timezone instance');
    if (!to.isValid()) throw new Error('to date must be valid');

    // how far from rule start to between start ("from")
    const distance = from.toDate() - this.start.toDate();
    // calculate approximately how many intervals to use for the start position
    const initialMultiple = Math.floor(distance / this.avgInteval);

    let exit = false;
    let i = initialMultiple;
    const result = [];
    while (!exit) {
      const date = this.__occurance(i);

      // NOTE: should include any date matching the "from", but exclude any matching the "to"
      if (date.isBetween(from, to, null, '[)')) result.push(date);
      if (date.isAfter(to)) exit = true;

      i += 1;
    }

    return toFormat(result, format);
  }

  toString() {
    const start = this.start.toISOString();
    // sort to ensure order is always the same, makes for simpler testing
    const intervalKeys = Object.keys(this.interval).sort();
    const interval = intervalKeys.map(k => `${k}${this.interval[k]}`).join(':');
    return `START=${start};INTERVAL=${interval};TZ=${this.start.tz()};`;
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

  const mStart = new moment.tz(start, tz);
  return new Dialga(mStart, interval);
}

module.exports = { Dialga, toDate, parse };
