# Dialga

![dialga](./docs/dialga.png)

## What is this?

Dialga is a simple recurrance library. I was inspired to write this after having previously used `rrule` for a work project and found rrule to have it's quirks. The largest issue I have with `rrule` is that it has no real timezone support. Dates are always generated based off the timezone of your machine/server. I want the same functionality but with the ability to specify what timezone the resulting dates should be in.

I also wanted to see if it was possible to make a much more lightweight library. For the most part `moment-timezone` already handles the complex logic of adding months, weeks, days to a date, so why not leverage that?

## Why?

At present I'm doing this purely as a personal challenge at this point, it's an interesting problem to solve but as I'm not doing this for work, and thus not spending work time on it, set expecations accordingly.

## Can I use this?

Sure! Should I use this? Probably not. This is very much a work in progress at this stage to see if it's feasible, hence the commented out code and thin test suite. Once production ready I'll make it known.

## What still needs doing

* stringify and parse function (so a rule can be saved and restored)
* more tests for between, does it work in all cases i.e. where from is WAY in the future from rule start
* cater for singular moment words i.e. { day: 1 } instead of { days: 1 }
* add get occurance function to return singular value, i.e. get me the 10th occurance of this rule
* use the above in the between function
