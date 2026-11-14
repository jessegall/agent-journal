---
name: journal-rules
description: Declare project rules, the standing instructions every agent gets at its start; read it before the first rule command of a session
---

# Rules

A rule is a standing instruction for the whole project. It holds in every environment, for every agent, and never
fades. What should only stay in mind for a while is a memory, not a rule.

- `journal rule list --state active` shows the rules that hold; every agent is told about them at its start and
  after a compaction.
- `journal rule show <n>` reads one rule.
- `journal rule make "<rule>"` proposes a rule. A rule from an agent is proposed: it does nothing until a user
  presses Approve on the orange card in the chat. A rule from a user holds at once. The setting
  `journal.core.project-rules.agents-make-rules` lets agents make rules with no approval.
- `journal rule approve <n>` and `journal rule deny <n>` are for the user; `journal rule remove <n>` ends a rule that
  holds.

Propose a rule when the user states something that must keep applying. Do not turn a passing fact into a rule.
