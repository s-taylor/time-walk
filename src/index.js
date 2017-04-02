const _ = require('lodash');
const moment = require('moment-timezone');

class SimpleRecur {
  constructor(start, interval, timezone = 'UTC') {
t    this.start = moment(start); // why UTC invalid?
    this.interval = interval;
    this.timezone = timezone;
    // TODO validate start format and interval and timezone
  }

  firstOccurances(count) {
    let result = [this.start.clone()];

    _.times(count - 1, (i) => {
      const last = result[i];
      const next = last.clone().add(this.interval);
      result = [...result, next]
    })

    return result;
  }
}

const start = [2000, 0, 1];
const interval = { months: 1 }
const count = 12;

const recurTest = new SimpleRecur(start, interval);
const first = recurTest.firstOccurances(12);
console.log('first', first);
