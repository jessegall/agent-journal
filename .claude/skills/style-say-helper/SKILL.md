---
name: style-say-helper
description: "Use when adding user-facing text through a module's MESSAGES table. This project's rule: Declare say(message: str, /, **values) with the message name positional-only"
---

# A module's say() helper

**The rule here:** Declare say(message: str, /, **values) with the message name positional-only

Decided in the coding style review (question 30). About 44 modules declare it this way. Positional-only matters: a template placeholder named key or n can then be passed as a value. reminders.py and work.py still take a plain key parameter, which breaks for a placeholder named key.

Worked examples are in [reference/examples.md](reference/examples.md).
