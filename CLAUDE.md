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
- **`style-outcome-names`** — Naming an unpacked outcome: Unpack an (ok, message) outcome as ok, in tests as well as the package
- **`style-say-helper`** — A module's say() helper: Declare say(message: str, /, **values) with the message name positional-only

<!-- END: agent-journal style -->
