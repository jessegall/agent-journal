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

1. Every frame the change removed calls `onExit`, from the top down, finished ones included.
2. Every frame that arrived calls `onEnter`, from the bottom up.
3. The new live top calls `onResume` only when a live frame covered it before and this change removed that frame. A
   new top, an unchanged top, ready, and a top that only finished or switched-off frames covered do not: that top
   already answered first.

## Finished frames are transparent

A frame whose work is done stays stored. `Frame::isLive()` is false for it (and for a frame of a switched-off type),
so a hook walk passes over it without calling `before()` or the hook, and `AgentStack::top()` is the highest live
frame. Ending a task or answering a message changes only that record; no stack changes and no `onExit` runs.

| Stored stack, top first | Hook | Walk |
|---|---|---|
| T×, P, R | onStop | skip T; P delegates; R answers |
| M, T×, P, R | read-only shell line | M delegates; skip T; P delegates; R answers |
| T, M×, P, R | onStop | T denies; M and P are not reached |

The stack after each of these is the stack before: no frame is removed, reordered or re-timed.

Ready never gets a lifecycle call. Closing a stack or timing a launch out calls none either. A restore and a read only
read: they call nothing.

Only explicit transitions change a stack. Each removes the frame it names plus the finished or switched-off frames that
removal exposes at the top, down to the first live one; a frame that is not live under a live one stays buried.

| Transition | Where | What leaves | What arrives |
|---|---|---|---|
| A frame's pop in a hook | `FrameEditor::popAnsweringState` | the frame and the exposed inactive frames | nothing |
| A push | `App\Hooks\Stack\StatePush`, used by `AgentStack` and `UserStack` | the exposed inactive frames | the pushed state, unless already on the stack |
| The explicit top-pop | `AgentStack::popExposed` | the exposed inactive frames | nothing |

Worked through, top first:

| Stack before | Transition | Stack after | Calls |
|---|---|---|---|
| M, T×, P, R | M pops | P, R | M exit, T exit, P resume |
| T×, P, R | P pushes N | N, P, R | T exit, N enter; no resume |
| T×, P, R | `popExposed` | P, R | T exit; no resume, P already answered first |
| M, T×, P, R | M pushes N | N, M, T×, P, R | N enter; T stays buried |
| M, T×, P, R | P pops itself | M, T×, R | P exit; M still covers, so no resume |

A transition that would leave more than `AgentStack::DEEPEST` frames is refused before any callback runs.

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

A command that ends a record an agent works on changes only the record. The agent's next hook passes over the finished
frame and answers from the live one below it:

```php
$task = Task::lockedById($command->taskId);
$task->finishRun($command->note);
$this->events->dispatch(new TaskFinished($command->taskId));
```

`FinishTaskHandler`, `BlockTaskHandler`, `CancelTaskHandler`, `AnswerMessageHandler` and `DismissMessageHandler`
follow it. A message asked again opens a new answer round, so its old frame stays finished.

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
  engine's commands change stacks through the same explicit transitions, one command per transaction.
- Doc 39's conditional states decline a switched-off state at `AgentStack::withStateOnTop`, the admission point every
  push passes through; a declined state never enters.
