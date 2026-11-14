---
name: CoreNamesNoSuite
description: Read before adding a suite import, suite name or suite concept to core.
summary: Core declares building blocks; a suite declares its own roles, rules and behavior.
tier: keep-in-mind
languages: [python, typescript, vue]
---

# Core knows no specific suite

Core provides models, commands, events and contracts that any suite can use. A suite depends on core;
core never depends on a specific suite, even through a string, role name, command or setting.
The base Suite contract is part of core. Coding workers, checks and task assignment belong to the
coding suite. Their decisions reach core only through declarations on a generic contract.

## When it fires

- **`core-names-no-suite`**: core imports a suite or names a suite concept in source text.

## How to fix it

Trace the decision to its owner. Move a coding rule into the coding suite and have it use core's
events and commands. When core needs an answer from any suite, declare a contract in core and let
the suite provide the answer. Never replace a coding word with a generic word while retaining the
same coding decision in core.

Classify findings before moving code. A browser service worker and a pytest execution process are
ordinary technical terms, not coding-suite agents. The exact pytest protocol fields `workeroutput` and `workerinput` are
allowed. Suite-owned migrations preserve old suite columns; core's schema declares only generic data.

## Coding words in core

**`core-names-no-coding-word`** flags worktree, test run, pytest, code review, graphify and git as a name, a text or
a comment in a file under `src/core/modules` or `src/engine`. Say it in core's words: a checkout, a separate copy of
the project, a command type, version control. Commit is left out: in core it is the database commit of a write.
These files may name the words, each for its reason:

- Recorded migrations (`src/core/modules/*/migrations/`): a migration keeps the text it ran with.
- Graphify, until task 8851 moves it to the coding suite: `src/core/modules/tools/`,
  `drivers/queries/hook_call_query.py`, `src/engine/driver/tool.py`, `src/engine/driver/search_category.py`.
- The runner's command types and the stock readers of test tools: `src/core/modules/processes/`,
  `src/engine/enums/command_category.py`, `src/engine/driver/part.py`, `src/engine/driver/shell_line.py`,
  `src/engine/text/run_target.py`, `aliases/seeders/aliases_seeder.py`. Test run is a command type the shell
  classifier gives any line, and a stock reader names its tool.
- Git as the program and the version control the engine reads: `src/engine/git/`, `src/engine/provider/hook_manager.py`,
  `src/engine/provider/provider.py`, `codex/providers/codex_provider.py`, `src/engine/file/conflict_files.py`,
  `src/engine/instruction/instruction_imports.py`, `src/engine/checkout/checkout.py`, `src/engine/enums/checkout_type.py`,
  `src/engine/enums/window_icon.py`, `src/core/modules/plugins/` (a plugin is fetched and compared with git),
  `developer/support/private_data_pass.py`, `secrets/support/secret_programs.py` (git as a program that needs a
  login), `src/core/modules/voices/` (the git user name), `pins/support/project_repositories.py` (the remotes
  in the git config name the repository whose pull requests are pinned).
- Pytest of the journal's own stories: `src/engine/testing/`, `src/engine/journal/journal.py`,
  `src/engine/database/repeated_work.py`, `src/engine/module/code_fingerprint.py`.

## Example

Core must not test `agent.role == "worker"` to decide whether to queue a process. The coding suite
declares the process policy for that role; core applies the declared policy without naming the role.
