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

## Example

Core must not test `agent.role == "worker"` to decide whether to queue a process. The coding suite
declares the process policy for that role; core applies the declared policy without naming the role.
