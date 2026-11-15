---
name: DriversArchitecture
description: Load it before writing a suite, a driver or a contribution of the agent machine (a policy, need source, line source, effect, transform or wake cause) in version 5, so the journal's conduct toward an agent stays in contributions that only answer, over rows read through injected queries.
summary: Contributions only answer and read through the queries they are handed; an effect names its commands and the step's save runs them; the driver base knows no module; every suite and driver names itself; the stack is stored only by the agent machine.
tier: mandatory
languages: [python]
---

# The drivers architecture

Version 5 drives an agent by the agent machine (doc 1310). On every hook and at every minute step the machine reads
one view of the agent, asks every contribution its module lists, and saves the step and its decision record in one
write; the hook is answered from that record. That only holds while each contribution keeps to its place.

## When it fires

- **`rule-runs-a-command`** - a policy, need source, line source, transform or wake cause calls `run`, `dispatch`,
  `save`, `delete` or a database write itself. A contribution only answers: an effect names the commands it wants in
  `commands()`, and the step's save runs them.
- **`rule-builds-its-reader`** - a contribution constructs a `Database`, a `Container`, `Queries` or a query class.
  Name the query it needs in its constructor, `def __init__(self, tasks: TaskQuery)`, and the container hands it in.
- **`hook-named-by-a-string`** - a contribution names an event it hears by a string. Name it by its member:
  `events = [HookEventName.STOP]`.
- **`driver-base-imports-a-module`** - a file of `engine/driver/` imports from `core/modules/` or
  `suites/`. The base is what every module builds on; what it needs from a module is an interface in the
  base that the module binds, as `HookRoute` is.
- **`driver-piece-without-a-name`** - a suite or driver declares no `name`. Every piece is found, listed, switched and
  recorded by its name: give it `name = "<module>.<what it is>"`.
- **`agent-keeps-a-stack`** - the agent model declares a `stack`, `states` or `state` field. Where an agent stands is
  the agent machine's stack, saved in the drivers module's `agent_stack` row by the step, never on the agent.
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
