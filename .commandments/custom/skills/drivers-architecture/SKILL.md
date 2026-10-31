---
name: DriversArchitecture
description: Load it before writing a suite, a driver, a driver rule or an overlay in version 5, so the journal's conduct toward an agent stays in rules that only answer, over rows read through injected queries.
summary: Rules and overlays only answer and read through the queries they are handed; the driver base knows no module; every suite, driver, rule and overlay names itself; no stack is stored.
tier: mandatory
languages: [python]
---

# The drivers architecture

Version 5 drives an agent by suites of drivers (doc 1096). On every hook the drivers module asks the rules of the
agent's driver and of the open overlays, and records every answer as a `hook_call` row. That only holds while
each piece keeps to its place.

## When it fires

- **`rule-runs-a-command`** - a driver rule or an overlay calls `run`, `dispatch`, `save`, `delete` or a database
  write itself. A rule only answers: it hands a command to `RuleAnswer` with `running(command)` or
  `ending_layer(command)`, and the hook record runs each command alone in its own savepoint.
- **`rule-builds-its-reader`** - a driver rule or an overlay constructs a `Database`, a `Container`, `Queries`
  or a query class. Name the query it needs in its constructor, `def __init__(self, tasks: TaskQuery)`, and
  the container hands it in.
- **`driver-base-imports-a-module`** - a file of `core/base/driver/` imports from `core/modules/` or
  `core/suites/`. The base is what every module builds on; what it needs from a module is an interface in the
  base that the module binds, as `HookHistory` and `HookRoute` are.
- **`driver-piece-without-a-name`** - a suite, driver, driver rule or overlay declares no `name`. Every piece is
  found, listed, switched and recorded by its name: give it `name = "<module>.<what it is>"`.
- **`agent-keeps-a-stack`** - the agent model declares a `stack`, `states` or `state` field. Overlays are worked
  out from open rows on every hook and nothing about where the agent stands is stored on the agent.
