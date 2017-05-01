# Dialga

![dialga](./docs/dialga.png)

## What is this?

Dialga is a simple recurrance library. I was inspired to write this after having previously used `rrule` for a work project and found rrule to have it's quirks.

See [rrule library here](https://github.com/jakubroztocil/rrule)

## What's different from rrule?

### Timezone Support

The largest issue I have with `rrule` is that it has no real timezone support. Dates are always generated based off the timezone of your machine/server. I want the same functionality but with the ability to specify what timezone the resulting dates should be in.

### Leverage Moment
I also wanted to see if it was possible to make a much more lightweight library. For the most part `moment-timezone` already handles the complex logic of adding months, weeks, days to a date, so why not leverage that for date logic?

### Enforce Rule Start Dates
I also don't particularly like how `rrule` does not enforce the use of `DTSTART` (the start date for a rule). For some rules this is not necessary, this is best explained with an example.

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

One thing I've chosen to omit which `rrule` provides is the option to have a single rule that can effecively output multiple patterns.
`rrule` can for example provide a rule that gives me every tuesday and friday each week, this will not be possible with `dialga`.
The reason for this, is in my mind this is two rules, not one. Why not just create two rules instead?

## How do I use it?

**WARNING: this is a work in progress, not yet on npm**

### Syntax

#### Creating a Rule

Arguments for a `new` rule are...
* a date (anything moment can parse, recommend not using a date object as this is not timezone agnostic)
* an interval, how far apart is each occurance (must be a value moment can understand, see [moment docs here](https://momentjs.com/docs/#/manipulating/add/)
* a timezone, must be valid as per moment-timezone, if you need a list use this...
```
const moment = require('moment-timezone');
console.log(moment.tz.names());
```

Example...

```
const { Dialga } = require('dialga');

// create a rule for monthly on the 1st Sydney time
const rule = new Dialga([2000, 0, 1], { months: 1 }, 'Australia/Sydney')

```

#### Getting Occurances

Arguments for `.first` is simply how many occurances from the rule _start_ (inclusive) you want to generate.

```
// get the first three occurances (an array) for the rule as a moment objects
const occurances = rule.first(3);

// this should give the dates 01-Jan-2000, 01-Feb-2000, 01-Mar-2000
```

#### Getting Occurances within a Range

Arguments for `.between` are...
* a start date (anything moment can parse, again recommend timezone agnostic format)
* an end date (anything moment can parse, again recommend timezone agnostic format)

```
// get occurances between two given dates (results an array in moment js format)
// note: dates don't need to match a valid occurances
const occurances = rule.betwen([2000, 0, 8], [2000, 2, 3]);

// this should give the dates 01-Feb-2000, 01-Mar-2000
```


## Why am I doing this?

At present I'm doing this purely as a personal challenge at this point, it's an interesting problem to solve but as I'm not doing this for work, and thus not spending work time on it, set expecations accordingly.

## Can I use this?

Sure! Should I use this? Probably not. This is very much a work in progress at this stage to see if it's feasible, hence the commented out code and thin test suite. Once production ready I'll make it known.

## What still needs doing

* stringify and parse function (so a rule can be saved and restored)
* more tests for between, does it work in all cases i.e. where from is WAY in the future from rule start
* cater for singular moment words i.e. { day: 1 } instead of { days: 1 }
* add get occurance function to return singular value, i.e. get me the 10th occurance of this rule
* use the above in the between function
* allow user to specify output type? moment.js object, js date, integer?
* remove use of decimals in calcs so more accurate
* compile to ES2015
