# agent-journal

## Dispatching subagents

Every Agent dispatch names its model: `haiku` for mechanical known-answer work, `sonnet`
for careful work without invention, `opus` only for judgement. Unset means the
orchestrator's own model, which is the wrong default. The journal carries this as a rule
(`journal rules`); this file carries it so it is read before the first dispatch.

## Controllers by reference

A controller is reached by its class — `Todos(record, actor=SYSTEM)`, `Plans(...)` from `controllers.types` — never by a string key; `CONTROLLERS[event.type]` is for generic dispatch on an event's type only.

## Tests

The default commands carry no hand-written tests. `tests/test_every_action.py` loops over every registered resource type and every action on its controller, and `tests/test_the_gate.py` loops over every provider; between them they cover create, read, update, complete and the rest for every type.

A feature is allowed one test file, `src/features/<name>/test.py`, beside its `feature.py`, with at most 10 tests (a cap on test methods, not lines) — the `check` rows scripts/checks/test_shape.py and scripts/checks/one_client.py hold both, with scripts/checks/funnels.py for bodies written twice (`journal check sweep`). It exists only when the feature does something the generated runs cannot see: a hold on writes, a nudge, a file on disk, a process. A feature that only adds commands has none.

<!-- BEGIN: agent-journal law (auto-generated, run `journal upgrade`) -->

## The journal's law

These rules ship with the journal and cannot be switched off.

**L1 — Every subagent dispatch names its model and chooses the least expensive model that reliably fits the work.**

Use a fast, economical model for mechanical work with a known answer, a capable general model for careful implementation, and the strongest model only when the task turns on difficult judgement. Inheriting the orchestrator's model is not a model choice. If the dispatch API cannot accept a model, that operation is exempt.

**L2 — Every subagent is bound to a concrete job; never dispatch a generic or default agent.**

Use the most specific available agent type whose declared purpose matches the assignment. On providers without agent types, give the dispatch a concrete task name and bounded prompt. If no suitable specialization exists, keep the work in the main agent instead of manufacturing an unscoped helper.

**L3 — Read narrowly: grep for the line, sed a range, head the file; never print a whole file or long output you do not need.**

Everything a tool returns stays in the context for good and is paid for on every turn after it. Search before you read, read the range you need, and cap output with grep, head or tail. Read a whole file only when you need all of it.

<!-- END: agent-journal law -->
