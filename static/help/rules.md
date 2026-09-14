# Rules

A rule is a ruling that holds for the whole project, in every environment. For example, how code must be written, or something that must never be done.

## Rule or pin

A **pin** belongs to one environment. A **rule** binds all of them. A pin that turns out to hold everywhere can be promoted to a rule.

Rules are handed to the agent at the start of every session and again after a long conversation is summarised, so they are always in force.

## What you can do

- Read every rule, with the reasoning behind it.
- Strike a rule that no longer applies, with a reason. It is hidden, not erased.
- Comment on it.

## How the agent uses rules

- **Handed over, not looked up.** Every rule is in the block the agent receives at the start of each session and again after a long conversation is summarised. It does not have to remember to check them.
- **Reading them in full.** That block shortens each rule to a line. `journal rules` reads every rule in full, and `journal rules show <n>` adds the reasoning behind one.
- **Writing one.** When you rule something for the whole project, the agent files it with `journal rules add`. A pin that turns out to hold everywhere is lifted with `journal pins promote`.
- **Checking they still hold.** About once an hour a stop asks the agent to run `journal cleanup`. Its second pass, `journal cleanup read`, has it reread every rule and pin and strike the ones that stopped being true.
