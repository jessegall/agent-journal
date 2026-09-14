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

## How the agent uses reminders

- **Repeated, on purpose.** Every standing reminder is told to the agent at each stop, and again every 50 tool calls in between (the **reminder_every** setting).
- **Writing one.** The agent adds one with `journal reminders add` when you have had to say something twice.
- **Retiring one.** When its condition is true, the agent runs `journal reminders done <n> "<why>"`. The reason is required.
