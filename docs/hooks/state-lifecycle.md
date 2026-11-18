# Hooks: state lifecycle and current work

A state on an agent's stack can act when it arrives, when it comes back on top and when it leaves. These are three
plain methods on `App\Hooks\States\AgentState`, each a no-op until a state overrides it:

```php
public function onEnter(LifecycleContext $context): void {}
public function onResume(LifecycleContext $context): void {}
public function onExit(LifecycleContext $context): void {}
```

`App\Hooks\Lifecycle\LifecycleContext` tells the method which stack (`target`), which frame (`frameId`) and which
reference (`reference`) it runs for.

## When they run

The methods run after a stack change has settled, inside that change's transaction, and before it is saved.
`App\Hooks\Lifecycle\FrameLifecycle` compares the frames before and after the change by frame id:

1. Every frame that left calls `onExit`, from the top down.
2. Every frame that arrived calls `onEnter`, from the bottom up.
3. The new top calls `onResume` when it was on the stack before but covered; a new top, an unchanged top and ready do
   not.

Ready never gets a lifecycle call. Closing a stack or timing a launch out calls none either. A restore and a read only
read: they call nothing.

Three operations change a stack, and all three settle the same way:

| Operation | Where | What leaves | What arrives |
|---|---|---|---|
| A hook | `App\Hooks\Stack\AgentStateMachine` | finished frames, and what the answer pops | what the answer pushes |
| A push | `App\Hooks\Stack\StatePush`, used by `AgentStack` and `UserStack` | finished frames | the pushed state, unless already on the stack |
| A cleanup | `App\Hooks\Contracts\StackCleanup` | finished frames | nothing |

Worked through on one stack:

| Stack before | Change | Calls |
|---|---|---|
| ready / A / B | B finishes, cleanup | B exit, A resume |
| ready / A | push B | B enter |
| ready / A / B | push A again | none |
| ready / P / A / B | A and B finish, cleanup | B exit, A exit, P resume |
| ready / A / B | B finishes, push C | B exit, C enter (A is not on top, so no resume) |

## What a lifecycle method may do

A method sets things up and cleans them up for its own state: bounded writes in the transaction it runs in, through
its own domain's contracts. When it throws, the whole change rolls back, the stack included. A retried change may call
it again, so it must give the same result when run twice.

It must not:

- push or remove frames: the stack refuses a change to itself while its methods run (`StackChangedInLifecycle`);
- finish its subject, or take a subject or session lock;
- do network or process work;
- expect a lower state's hook method to see what it did during the same hook.

A stack holds at most `AgentStack::DEEPEST` frames, ready included (`StackTooDeep`).

## Ending work in its own command

A command that ends a record an agent works on settles that agent's stack before it returns, so the agent is back on
its earlier work at once, not at its next hook. The record names its stack through
`App\Hooks\Contracts\WorkedOnStack::workTarget()`, and the handler goes through `StackCleanup::endWork`:

```php
$this->cleanup->endWork(Task::lockedById($command->taskId), fn (Task $task) => $task->finish());
$this->events->dispatch(new TaskFinished($command->taskId));
```

The subject is locked first, then changed, then its stack is settled, then the events go out after commit.
`FinishTaskHandler`, `BlockTaskHandler`, `CancelTaskHandler`, `AnswerMessageHandler` and `DismissMessageHandler`
follow it.

## Current work is read from the stack

No state stores which task or plan is current. `App\Hooks\Contracts\CurrentState` answers it: the highest frame of a
type whose work is not done, covered or not.

| Stack | Current task | Current plan |
|---|---|---|
| ready / A / P / C | C | P |
| ready / A / P / C, C finished | A | P |
| ready / A / M (a question on top) | A | none |
| a closed stack | none | none |

Tasks reads it with `AssignedTaskReader::currentForCaller()`; Plans marks its plan cards focused, and lists the focused
plan first, from the same read. A user has no stack, so a user's screen has no current task or plan.

## Delegating with context

A state that only adds to the answer delegates with `Decision::addContext`; it needs no special answer type. Each walk
step records how many context entries its decision added, in `WalkStep::contextCount`, so an inspected call shows a
delegate that added context.

## Boundaries with other designs

- Ticking is not lifecycle. Doc 35 lets a state type opt in to ticks; a tick never enters or resumes a frame, and the
  engine's commands settle stacks through the same push and cleanup operations, one command per transaction.
- Doc 39's conditional states decline a switched-off state at `AgentStack::withStateOnTop`, the admission point every
  push passes through; a declined state never enters.
