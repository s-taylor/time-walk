# Time Walk

![time-walk](https://raw.githubusercontent.com/s-taylor/time-walk/master/docs/time-walk.jpg)

## What is this?

**Time Walk** is a simple recurrance library. I was inspired to write this after having previously used **Rrule** for a work project and found **Rrule** to have it's quirks.

See [Rrule library here](https://github.com/jakubroztocil/rrule)

## What's different from rrule?

### Timezone Support

The largest issue I have with **Rrule** is that it has no real timezone support. Dates are always generated based off the timezone of your machine/server. I want the same functionality but with the ability to specify what timezone the resulting dates should be in.

### Leverage Moment
I also wanted to see if it was possible to make a much more lightweight library. For the most part `moment-timezone` already handles the complex logic of adding months, weeks, days to a date, so why not leverage that for date logic?

### Enforce Rule Start Dates
I also don't particularly like how **Rrule** does not enforce the use of `DTSTART` (the start date for a rule). For some rules this is not necessary, this is best explained with an example.

Imagine I want a rule that gives me the 1st of every month, there's two completely different ways I could define this.
* Without DTSTART - `FREQ=MONTHLY;BYMONTHDAY=1`. This specifically states give me the 1st of every month, without providing a start date.
* With DTSTART - `FREQ=MONTHLY;DTSTART=20170501T000000Z`. This works since the 1st of May is a Monday (I've used UTC midnight here) and I want a recurrance every month.

This is sort of fine, both of these get the job done, I'd prefer no ambiguity but it's not that bad. But what if we want a fortnightly or bi-monthly rule?
Then we **MUST** set a `DTSTART` otherwise our rule simply doesn't know which week/month to include and which week/month to skip (since it's every second month/week).
If we don't, we're going to get weird results when we call the `.between` rule multiple times.

So my thoughts were, why not just always have a `DTSTART` value?
If I want a rule that gives me the 1st of every month, it's not hard to just pick from a calendar "the 1st" and then set the interval to 1 month.
Likewise if I want every second Wednesday, I pick a Wednesday on my calendar that I want to include, then set the interval to 2 weeks.

In my opinion it just makes sense to always have a start date.

### Multiple Patterns in 1 Rule

One thing I've chosen to omit which **Rrule** provides is the option to have a single rule that can effecively output multiple patterns.
**Rrule** can for example provide a rule that gives me every tuesday and friday each week, this will not be possible with **Time Walk**.
The reason for this, is in my mind this is two rules, not one. Why not just create two rules instead?

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
const { TimeWalk } = require('time-walk');

const start = new moment.tz('2017-07-01', 'Australia/Sydney');
const rule = new TimeWalk(start, { months: 1 });
```

OR if I want a rule that recurs every second Monday (fortnightly), starting in July 2017 in UTC.
```js
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

## What still needs doing...

* Allow setting a default output type
* Add setter method (including setting default output type)
* Test between from and to validations
* Test interval is required (in constructor)
* Limit how many occurances get returned to 100?
* Changelog
* finalise readme
* publishing to npm

* Add `.fromString` to create a rule with a date in string format + timezone.
* remove use of decimals in calcs so more accurate
* compile to ES2015
* Use CircleCI
