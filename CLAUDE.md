# agent-journal

## Dispatching subagents

Every Agent dispatch names its model: `haiku` for mechanical known-answer work, `sonnet`
for careful work without invention, `opus` only for judgement. Unset means the
orchestrator's own model, which is the wrong default. The journal carries this as a rule
(`journal rules`); this file carries it so it is read before the first dispatch.

<!-- BEGIN: agent-journal style (auto-generated, run `journal style sync`) -->

## Coding style

This project's coding style, one skill per subject. Load a subject's skill before writing or reviewing code it covers; `journal style` lists them.

- **`style-imports`** — Where imports go: Imports go at the top of the file; inside a function only to break an import cycle or keep a hook process from loading what it never uses
- **`style-js-helpers`** — Helper functions in the viewer: A top-level helper in static/app.js is a function declaration, not a const arrow function
- **`style-js-strings`** — Building strings in the viewer: The viewer's JavaScript builds strings from pieces with template literals, not + concatenation
- **`style-module-docstrings`** — What a module says about itself at the top: A module has no module docstring; the file opens on its imports
- **`style-outcome-names`** — Naming an unpacked outcome: Unpack an (ok, message) outcome as ok; in a test file whose pass counter is the global ok, unpack it as took
- **`style-say-helper`** — A module's say() helper: Declare say(message: str, /, **values) with the message name positional-only

<!-- END: agent-journal style -->

## Controllers by reference

A controller is reached by its class — `Todos(record, actor=SYSTEM)`, `Plans(...)` from `controllers.types` — never by a string key; `CONTROLLERS[event.type]` is for generic dispatch on an event's type only.

<!-- BEGIN: agent-journal law (auto-generated, run `journal upgrade`) -->

## The journal's law

These rules ship with the journal and cannot be switched off.

**L1 — Every subagent dispatch names its model and chooses the least expensive model that reliably fits the work.**

Use a fast, economical model for mechanical work with a known answer, a capable general model for careful implementation, and the strongest model only when the task turns on difficult judgement. Inheriting the orchestrator's model is not a model choice. If the dispatch API cannot accept a model, that operation is exempt.

**L2 — Every subagent is bound to a concrete job; never dispatch a generic or default agent.**

Use the most specific available agent type whose declared purpose matches the assignment. On providers without agent types, give the dispatch a concrete task name and bounded prompt. If no suitable specialization exists, keep the work in the main agent instead of manufacturing an unscoped helper.

<!-- END: agent-journal law -->
