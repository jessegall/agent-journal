# Reminders

A reminder is an instruction the agent is told again and again, so it does not drift away from it over a long session.

## Pin or reminder

- A **pin** is a fact. It is told once, at the start and after a summary.
- A **reminder** is something to keep doing, like "run the tests before saying a change works". It comes back at every stop and every so many steps in between.

Reminders are usually written when you have had to say the same thing twice.

## When a reminder ends

A reminder can carry a condition, like "until the migration is finished". The agent retires it when that is true, and says why. Without a condition, it stays until someone retires it.

## What you can do

- See what the agent is being reminded of here.
- Edit, move or retire a reminder.
