# agent-journal

## Dispatching subagents

Every Agent dispatch names its model: `haiku` for mechanical known-answer work, `sonnet`
for careful work without invention, `opus` only for judgement. Unset means the
orchestrator's own model, which is the wrong default. The journal carries this as a rule
(`journal rules`); this file carries it so it is read before the first dispatch.

<!-- BEGIN: agent-journal style (auto-generated, run `journal style sync`) -->

## Coding style

This project's coding style, one skill per subject. Load a subject's skill before writing or reviewing code it covers; `journal style` lists them.

- **`style-module-docstrings`** — What a module says about itself at the top: A module has no module docstring; the file opens on its imports

<!-- END: agent-journal style -->
