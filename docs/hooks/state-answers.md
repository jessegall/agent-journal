# Hooks: how states answer and what is current

A state on an agent's stack only answers. It never changes anything itself; its one caller runs what it answered.

## Answering a hook

Every live state that declares the hook's method is asked, from the top of the stack down. A method returns nothing to
pass, one part, or yields several:

| Part | What the caller does with it |
|---|---|
| nothing (`null`) | passes: the state below is asked |
| `ContextLine` | adds its text to the agent's context |
| `MessageLine` | adds its text to the context and wakes the agent when the hook leaves it idle |
| a `Command` | runs it once the hook commits, under the hook's actor and authority (`StateCommandAnswered`) |
| an `Event` | dispatches it once the hook commits |
| `Decision::deny` or `Decision::rewrite` | the state's decision; at most one, and it is the last part |

```php
public function onStop(StopRequested $input): iterable
{
    yield new MessageLine("Task {$this->task->number} waits for your review.");
    yield Decision::deny("Task {$this->task->number} still needs work.");
}
```

`AgentStack::answer` is the one caller. The first deny answers the hook and no state below it is asked. Without a deny,
the highest rewrite answers, and when every state passed the hook is allowed. A state never answers allow itself, a
part after the decision is refused, and anything that is not one of the parts above is refused
(`HookAnswerRefused`). The input still refuses a decision it cannot take (`InvalidHookAnswer`). Each asked state is one
`WalkStep`, with how many lines it added.

A rewrite gets one more walk for the replacement line, which a lower deny can still refuse; both walks keep their
lines. A second rewrite fails.

## Answering a fact

A state listens to a domain fact with `on<EventName>(<Event> $event)`. Every live state that declares the listener is
asked, top first. It returns nothing, a command, an event, or several of them, at most
`StateEventDelivery::EFFECT_LIMIT`; anything else is refused (`StateAnswerRefused`). The commands run and the events
are dispatched in order, each only while its frame occurrence is still selected (`StateEventOriginGuard`).

## The instruction shown

`AgentState::instruction()` answers the state's instruction, none by default. A fresh session, prompt or compaction
shows the instruction of the top live state that has one (`AgentStack::instruction`). The text is read when it is
shown, so it is never stale.

## Finished frames are transparent

A frame whose work is done stays stored. `Frame::isLive()` is false for it (and for a frame of a switched-off type),
so a hook walk passes over it and `AgentStack::top()` is the highest live frame. Ending a task or answering a message
changes only that record; the next hook answers from the live frame below it.

| Stored stack, top first | Hook | Walk |
|---|---|---|
| T×, P, R | onStop | skip T; P and R are asked |
| M, T×, P, R | read-only shell line | M passes; skip T; P and R are asked |
| T, M×, P, R | onStop | T denies; M is skipped and P is not reached |

A push (`StatePush`, through `AgentStack::withStateOnTop`) and the explicit top-pop (`EngineStacks::popExposed`)
remove the finished or switched-off frames exposed at the top, down to the first live one; a frame that is not live
under a live one stays buried. A push past `AgentStack::DEPTH_LIMIT` frames is refused (`StackTooDeep`).

## Current work is read from the stack

No state stores which task or plan is current. `App\Contracts\Work\CurrentState` answers it: the highest frame of a
type whose work is not done, covered or not. `CurrentState::record` reads the agent's work record from the top live
`WorkState`: its `stateSubject()`, the record the state is about.

| Stack | Current task | Current plan |
|---|---|---|
| ready / A / P / C | C | P |
| ready / A / P / C, C finished | A | P |
| ready / A / M (a question on top) | A | none |
| a closed stack | none | none |
