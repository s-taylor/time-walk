# Dialga

![dialga](./docs/dialga.png)

## What is this?

Dialga is a simple recurrance library. I was inspired to write this after having previously used `rrule` for a work project and found rrule to have it's quirks. The largest issue I have with `rrule` is that it has no real timezone support. Dates are always generated based off the timezone of your machine/server. I want the same functionality but with the ability to specify what timezone the resulting dates should be in.

I also wanted to see if it was possible to make a much more lightweight library. For the most part `moment-timezone` already handles the complex logic of adding months, weeks, days to a date, so why not leverage that?

## Why?

At present I'm doing this purely as a personal challenge at this point, it's an interesting problem to solve but as I'm not doing this for work, and thus not spending work time on it, set expecations accordingly.
