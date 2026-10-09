# agent-journal

## Dispatching subagents

Every Agent dispatch names its model: `haiku` for mechanical known-answer work, `sonnet`
for careful work without invention, `opus` only for judgement. Unset means the
orchestrator's own model, which is the wrong default. The journal carries this as a rule
(`journal rules`); this file carries it so it is read before the first dispatch.

Every dispatch prompt says the subagent never runs tests: it writes the test that proves its change and names it in its report, and the main agent runs it.

## Controllers by reference

A controller is reached by its class — `Todos(record, actor=SYSTEM)`, `Plans(...)` from `controllers.types` — never by a string key; `CONTROLLERS[event.type]` is for generic dispatch on an event's type only.

## Skills

A skill is read by the agent, so it exists only when it tells the agent what to do: a command to run or a decision to make at a moment it would otherwise get wrong. A feature that runs by itself gets no skill; its help lives on the Settings page, and anything the agent must act on travels in the nudge the feature sends. Before adding a skill, fold it into the skill of the subject it belongs to (memory, reports, to-dos, messages, tickets) rather than starting another.

## Tests

The default commands carry no hand-written tests. `tests/test_every_action.py` loops over every registered resource type and every action on its controller, and `tests/test_the_gate.py` loops over every provider; between them they cover create, read, update, complete and the rest for every type.

A feature is allowed one test file, `src/features/<name>/test.py`, beside its `feature.py`, with at most 10 tests (a cap on test methods, not lines) — the `check` rows scripts/checks/test_shape.py and scripts/checks/one_client.py hold both, with scripts/checks/funnels.py for bodies written twice (`journal check sweep`). It exists only when the feature does something the generated runs cannot see: a hold on writes, a nudge, a file on disk, a process. A feature that only adds commands has none.

<!-- BEGIN: code-commandments skills (auto-generated, run `composer update`) -->
@AGENTS.md

## Working here as Claude Code

The briefing above is the canon, shared with every agent. These are the parts of it
that have a specific name in this harness:

- **Load a skill with the Skill tool**, by the exact id in the briefing's bullets —
  e.g. `commandments-backend-absence`. The published skills are linked into
  `.claude/skills/`, so they also autocomplete as `/`-commands.

**The disciplines here are ENFORCED, not just written down.** Hooks are wired into
`.claude/settings.json`: the cardinal rule resurfaces as you work, `judge` is nudged
before risky commands and on stop. That is a property of this agent alone — under an
agent with no hook protocol the same disciplines are documents you are asked to follow,
and nothing checks that you did.
<!-- END: code-commandments skills -->
