---
name: journal-templates
description: Find and use a template for a task, a plan or a review; read it before the first template command of a session
---

# Templates

A template is a reusable shape for a piece of work: a heading, a brief, its parts and the commands to run at a phase's end.

- `journal template list` shows every template with what it applies to and its purpose; `--target plan` and
  `--purpose critique` narrow the list, alone or together. A template with no targets applies to every target.
- `journal template show <n>` shows its heading, brief, parts and phase-end commands.
- `journal template --help` lists the verbs that make and change one.

When a request names a template, read it with `journal template show <n>` and follow it. Put what you find in a
report linked to the row the request is about.
