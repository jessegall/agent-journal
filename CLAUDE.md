# agent-journal

## Version 4 rules

- **One class per file.** Every class, enum and dataclass has a file of its own, named after it in snake_case. A module never holds two classes.
- NOTES.md at the root holds what is decided and what is still to settle; update it when either changes.

## Tests

`pytest` runs `tests/` in about a second: one file per phase of the rewrite, a temp database,
real HTTP on a free port, no mocks and no subprocesses. Tests cover the core only: data,
CLI, server, hooks, engine. No tests on single models or features until the core stands.
Run the whole suite after every change; it is cheap.

## Layout

`src/journal/` is the package: `models/` (data only), `repositories/` (the SQL), `db/`,
`events/` (`models/` and `agent/`), `engine/` (the state machine), `features/` (states,
nudges, listeners, commands per subject), `hooks/`, `http/`, `console/`, `providers/`.
`src/supervisor/` is a separate stdlib-only package. `v3.bak/` is the old tree, read as a
guide and never imported. NOTES.md holds the decisions and what is still open.

@AGENTS.md

## Working here as Claude Code

The briefing above is the canon, shared with every agent. These are the parts of it
that have a specific name in this harness:

- **Load a skill with the Skill tool**, by the exact id in the briefing's bullets —
  e.g. `commandments-backend-absence`. The published skills are linked into
  `.claude/skills/`, so they also autocomplete as `/`-commands.

**The disciplines here are ENFORCED, not just written down.** The agent journal's
code-commandments plugin judges what you change and raises each sin in the chat; the
package's own hooks step aside. That is a property of this agent alone — under an
agent with no hook protocol the same disciplines are documents you are asked to follow,
and nothing checks that you did.
<!-- END: code-commandments skills -->
