# Time Walk

![time-walk](https://raw.githubusercontent.com/s-taylor/time-walk/master/docs/time-walk.jpg)

## What is this?

**Time Walk** is a simple library for generating date recurrance rules. I was inspired to write this after having previously used **Rrule** for a work project and found **Rrule** to have it's quirks.  This module heavily leverages the [moment-timezone](https://momentjs.com/timezone/) library and aims to keep this library as lightweight as possible.

See [Rrule library here](https://github.com/jakubroztocil/rrule)

See [differences to Rrule here](https://gist.github.com/s-taylor/f59e0cefc9c2e52d77271cebf021de01)

## What would I use this for?

There are a number of potential use cases for this module, two better examples I can think of are...

* Generating calendar appointments based on a defined pattern (rule).
* Implementing a scheduled jobs service in your app, where timezone support is important. Cron doesn't support fortnightly intervals or multi-timezone.

## Try it out

[See runkit demo here](https://runkit.com/nizmox/time-walk-demo)

## How do I use it?

### Syntax

#### Install

`yarn add time-walk`
OR
`npm install --save time-walk`

#### Creating a Rule

Arguments for a `new` rule are...
* **start** a `moment-timezone` object where the date and timezone align to the first occurance you want the rule to generate. The timezone specified in the `moment-timezone` object will be used to generate all occurrences (dates) by **Time Walk**. See [moment-timezone](https://momentjs.com/timezone/) for more details.
* an **interval**, starting from the start date, how far apart do we want occurrence (date) to be (must be in a format `moment.js` understands, see [moment docs here](https://momentjs.com/docs/#/manipulating/add/).

For example, if I want a rule that recurs on the 1st of every month according to the time in Sydney, Australia, and I wan't my rule to start from next month (July 2017), I would input...
```js
const moment = require('moment-timezone');
const { TimeWalk } = require('time-walk');

const start = new moment.tz('2017-07-01', 'Australia/Sydney');
const rule = new TimeWalk(start, { months: 1 });
```

OR if I want a rule that recurs every second Monday (fortnightly), starting in July 2017 in UTC.
```js
const moment = require('moment-timezone');
const { TimeWalk } = require('TimeWalk');

const start = new moment.tz('2017-07-03', 'UTC');
const rule = new TimeWalk(start, { weeks: 2 });
```
Note: the 3rd of July is the first Monday in July, so this needs to be the start date.

#### Getting (n)th Occurance

If I want to get the 2nd occurance of my rule...
```js
const start = new moment.tz('2017-07-01', 'Australia/Sydney');
const rule = new TimeWalk(start, { months: 1 });

const result = rule.occurance(2) // result === 2017-08-01 in Australia/Sydney Time
```
Note: The start date **counts** as the first occurence.

#### Getting the first (x) Occurances

If I want to get the first three ooccurances of my rule...
```js
const start = new moment.tz('2017-07-01', 'Australia/Sydney');
const rule = new TimeWalk(start, { months: 1 });

const result = rule.first(3)
// result === [2017-07-01, 2017-08-01, 2017-09-01] in Australia/Sydney Time
```
Note: The start date **counts** as the first occurence.

#### Getting Occurances within a Range

If I want to get ALL occurences for my rule that exist between two dates.
For example, to get all occurences in July I would do...

```js
const start = new moment.tz('2017-07-01', 'Australia/Sydney');
const rule = new TimeWalk(start, { weeks: 1 });

const from = new moment.tz('2017-07-01', 'Australia/Sydney');
const to = new moment.tz('2017-08-01', 'Australia/Sydney');
const result = rule.between(from, to);

// result === [2017-07-01, 2017-07-08, 2017-07-15, 2017-07-22, 2017-07-29]
// in Australia/Sydney Time
```

## Why am I doing this?

At present I'm doing this purely as a personal challenge at this point, it's an interesting problem to solve but as I'm not doing this for work, and thus not spending work time on it, set expectations accordingly.

## How can I help?

Send me a pull request! Please don't send me a pull request without tests though.

## What's changed?

[View Changelog](https://github.com/s-taylor/time-walk/blob/master/CHANGELOG.md)

## What still needs doing...

* Allow setting a default output type
* Add setter method (including setting default output type)
* Test between from and to validations
* Test interval is required (in constructor)
* Limit how many occurances get returned to 100?
* Add example code on runkit
* Update readme with some use cases for the module
* Document specifying output format
* Document toString and parsing functions
* Changelog
* finalise readme
* publishing to npm

* Add `.fromString` to create a rule with a date in string format + timezone.
* remove use of decimals in calcs so more accurate
* compile to ES2015
* Use CircleCI
