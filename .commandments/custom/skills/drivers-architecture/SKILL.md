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
- **`driver-base-imports-a-module`** - a file of `engine/driver/` imports from `core/modules/` or
  `suites/`. The base is what every module builds on; what it needs from a module is an interface in the
  base that the module binds, as `HookHistory` and `HookRoute` are.
- **`driver-piece-without-a-name`** - a suite, driver, driver rule or overlay declares no `name`. Every piece is
  found, listed, switched and recorded by its name: give it `name = "<module>.<what it is>"`.
- **`agent-keeps-a-stack`** - the agent model declares a `stack`, `states` or `state` field. Overlays are worked
  out from open rows on every hook and nothing about where the agent stands is stored on the agent.
- **`launcher-stop-outside-agent-program`** - code asks `LauncherLink` to stop a program. End the agent's row instead:
  `EndedAgentProgramListener` stops the program through `AgentProgram` when another ended it, and an agent that ended
  itself gets no stop.
- **`launcher-reached-outside-the-dispatcher`** - a file outside `src/core/modules/agents/support/` imports
  `LauncherLink`, `LauncherService` or `AgentProgram`, or a command that records a launch, a launch failure or a
  program exit. Ask `AgentDispatcher` to start, stop or end an agent, and `AgentStanding` whether its program or a
  launcher runs. The rule names the files it still allows; that list only shrinks.
- **`agent-row-ended-outside-the-dispatcher`** - code outside `AgentDispatcher` writes the `ended_at` or `pid` of an
  agent's row. Use `end_row`, `end_session`, `open_row`, `record_process` or `move_program` of the dispatcher, so
  the row and the program are changed in one place.
