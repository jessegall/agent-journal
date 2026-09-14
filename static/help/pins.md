# Pins

A pin is a fact about this environment that must not be forgotten. For example, how a part of the code really behaves, or a decision that was made.

## Why pins exist

When an agent's conversation gets long, older parts are summarised and details are lost. Pins are handed back to the agent after that, and to every new session, so what was decided survives.

## What makes a good pin

It was decided, the next reader would get something wrong without it, and it will still be true tomorrow. A status or a count is not a pin: it is out of date by the next day.

## What you can do

- Read every pin, and the conversation it was written in.
- Strike a pin that has stopped being true. It is hidden, not erased.
- Comment on it.

A pin that should hold for every environment becomes a **rule**.

## How the agent uses pins

- **Handed back after a loss.** The pins of the environment the agent works on are in the block it receives at the start of each session and after a long conversation is summarised.
- **Reading and writing.** `journal pins` reads them in full. It adds one with `journal pins add` when something decided must survive.
- **When the conversation fills up.** At 50, 70, 90 and 95 percent of its context, the agent is stopped until it pins what matters, writes a rule, or says in one line why nothing needs keeping.
- **Keeping them true.** The regular cleanup pass has the agent reread every pin and strike the ones that are out of date.
