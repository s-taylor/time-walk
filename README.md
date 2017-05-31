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
* a **start date** for the rule (anything moment can parse, see [moment docs here](https://momentjs.com/docs/#/parsing/))
* an **interval**, how far apart is each occurance (must be a value moment can understand, see [moment docs here](https://momentjs.com/docs/#/manipulating/add/)
* a **timezone**, must be valid as per moment-timezone, if you need a [list](https://runkit.com/nizmox/592e51e95b3c9b00122cbf78).

**WARNING:** You need to be somewhat careful what **start date** argument you give to Dialga. You should either pass in a date that is timezone agnostic (i.e. date string) or if the date has a timezone, this should match the timezone specified.

For example, these are OK:-
```js
const start = new moment.tz('2000-01-01', 'Pacific/Auckland');
const rule = new Dialga(start, { months: 1 }, 'Pacific/Auckland');
```
OR
```js
const rule = new Dialga('2000-01-01', { months: 1 }, 'Pacific/Auckland');
```

This will error, because the zones don't match:-
```js
const start = new moment.tz('2000-01-01', 'Australia/Sydney');
const rule = new Dialga(start, { months: 1 }, 'Pacific/Auckland');
```

But using a `Date` may cause unexpected outcomes:-
```js
const TZ = 'Pacific/Auckland';
const start = new Date(2000, 0, 1);
const rule = new Dialga(start, { months: 1 }, TZ);
```
This is because when you use `new Date`, you're getting the date you specified in the timezone of your machine / server. And not the TZ value you've specified. It'll be fine if your machine / server's timezone === `'Pacific/Auckland'`, but wrong if it's not. I may in future disable js dates as an input to avoid confusion.


#### Getting nth Occurance

TODO

#### Getting Occurances

Arguments for `.first` is simply how many occurances from the rule _start_ (inclusive) you want to generate.

```js
// get the first three occurances (an array) for the rule as a moment objects
const occurances = rule.first(3);

// this should give the dates 01-Jan-2000, 01-Feb-2000, 01-Mar-2000
```

#### Getting Occurances within a Range

Arguments for `.between` are...
* a start date (anything moment can parse, again recommend timezone agnostic format)
* an end date (anything moment can parse, again recommend timezone agnostic format)

```js
// get occurances between two given dates (results an array in moment js format)
// note: dates don't need to match a valid occurances
const occurances = rule.betwen([2000, 0, 8], [2000, 2, 3]);

// this should give the dates 01-Feb-2000, 01-Mar-2000
```

## Why am I doing this?

At present I'm doing this purely as a personal challenge at this point, it's an interesting problem to solve but as I'm not doing this for work, and thus not spending work time on it, set expecations accordingly.

## Can I use this?

Sure! Should I use this? Probably not. This is very much a work in progress at this stage to see if it's feasible, hence the commented out code and thin test suite. Once production ready I'll make it known.

## How can I help?

Send me a pull request! Please don't send me a pull request without tests though.

## What still needs doing

* create alternate getOccurance method that's not 0 indexed for external users
* allow user to specify output type? moment.js object, js date, integer?
* remove use of decimals in calcs so more accurate
* add getter methods
* compile to ES2015
* publishing to npm
