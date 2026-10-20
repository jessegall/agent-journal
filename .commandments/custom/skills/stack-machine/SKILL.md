---
name: StackMachine
description: Load it before writing a state, a listener, a conduct mixin or anything that moves the agent, so only the states move it and only through the engine
summary: A state hears through on_ listeners named for the moment with their event annotated; it answers unchanged, changed, push, pop or hold; the engine alone builds and changes a stack; a feature's listener records and never speaks
tier: mandatory
languages: [python]
---

# The stack machine

What an agent is doing is a stack of states on its row. A state hears an event through a listener named
`on_<moment>` whose `event` parameter is annotated with the event it hears; the dispatch finds listeners by that
annotation and by nothing else. A listener answers `unchanged`, `changed`, `push`, `pop` or `hold`, and only the
state machine applies it. A feature's listener outside the states only records, links or writes rows: the rows'
events reach the top of the stack, and the state alone speaks to the agent or holds it.

## When it fires

- **`state-listener-not-on`** - a method on a state takes an `event` but is not named `on_`, so the dispatch never
  finds it. Name every listener `on_<moment>`.
- **`on-listener-without-event-type`** - an `on_` listener's `event` parameter has no annotation, so nothing binds
  it to the event. Annotate it: `def on_tool_starting(self, event: ToolStarting, settings)`.
- **`transition-outside-base-state`** - a `Transition` is built outside the base state's answers. Answer with
  `unchanged`, `changed`, `push`, `pop` or `hold`.
- **`held-outside-on-push`** - a `Held` is built outside `on_push`, the one hook that may refuse a push. Elsewhere
  answer `hold(nudge)`.
- **`hook-that-moves`** - `on_push`, `on_suspend` or `on_pop` pushes, pops or changes the state. A hook answers the
  nudges to say and nothing else; only `on_resume` may answer a pop.
- **`stack-built-outside-engine`** and **`stack-changed-outside-engine`** - a `Stack` is built, pushed, popped or
  given a new top outside `journal/engine`. Only the state machine moves a stack; `journal panic` is the one hand
  on it from outside.
- **`state-reads-was`**, **`state-hears-updated`**, **`state-hears-model-event`** - a state reads a row as it was
  before, or hears `Updated` or a bare `ModelEvent`. A state hears an event named for the moment, `PlanStarted`,
  `TaskClosed`, carried by the model and dispatched by its repository.
- **`feature-listener-speaks`** - a feature's `AgentListener` refuses, tells or says a line. The line or the hold
  belongs to the state's or the conduct's `on_` listener; the listener records.
- **`dispatch-outside-funnels`** - an event is dispatched outside the repositories, the engine, the hooks and the
  events package. A command or a listener writes a row that carries its event with `with_event`; the repository
  dispatches it on save.
- **`state-machine-outside-engine`** - a file outside the engine imports the state machine. Only the engine and
  `journal panic` touch it.
