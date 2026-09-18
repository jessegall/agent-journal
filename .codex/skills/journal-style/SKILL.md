---
name: journal-style
description: Every style rule is written as a skill the agent loads before writing code on its subject
---

# Coding style

Every style rule is written as a skill the agent loads before writing code on its subject.

.claude/skills/style-<subject>/SKILL.md is rewritten on every change to the rule and removed when it is struck.

It listens to: style. It speaks on the events it listens to. On by default; the viewer's Settings switches it per environment, and `triggers.style` in the environment's settings tunes it.
