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

Ready never gets a lifecycle call. Closing a stack or timing a start out calls none either. A restore and a read only
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

`FinishTaskHandler`, `BlockTaskHandler`, `CancelTaskHandler`, `ReplyToMessageHandler` and `DismissMessageHandler`
follow it. An answering frame is named by the exact claim, so a new claim on the same message is a new frame.

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

`Decision::message` adds the same text and also reaches an idle agent. When the hook leaves the agent idle (an allowed
stop, or the session's end), `AgentMessageDelivery` keeps the text as a `PendingAgentMessage` for the agent and asks
`ActorAttention` to wake its runtime; `PendingAgentMessages` tells the wake there is work, so the driver types its
pending-work prompt and a turn starts. The agent's next hook that does not leave it idle hands the kept texts over,
first in its context, and removes them. A busy agent gets the text in the reply as context, like `addContext`.

## Which hook methods run

For each hook the stack selects from a single starting snapshot, highest frame first. It skips finished and disabled
frames and methods that do not handle that input. The highest matching method runs, followed by every lower matching
method marked with `#[App\Hooks\Attributes\StackWide]`. A marked first match runs once. Each marker belongs to one
method. A method inherited unchanged keeps its marker, including methods provided by a trait. An override has the
marker only when it declares it. The base `AgentState` stubs supply no declarations. The concrete Ready state and
intermediate state classes can declare real methods.

A selected frame calls its `before()` before its matching hook method. If `before()` returns a Decision, that is the
frame's whole contribution. It runs only after a matching method is selected and only for hooks. For a state that used
`before()` alone, declare each hook it should handle. For an ordinary handler that relied on Delegate to reach a
lower handler, mark the lower method if its contribution must apply when covered. Reserve the marker for behavior
that should participate regardless of the higher matching method.

Each called Decision appends its context and messages in order. Duplicate text stays. The latest answer replaces the
previous answer up to the first Deny. From then on only a later Deny can change the result, and its reason becomes the
final reason. Each refusal remains attributable in the trace. A handler at any height may Allow. A final Delegate
resolves to Allow for the original input after selection, subject to the input's answer rules. A selected bottom
handler still must supply an answer and cannot Delegate.

Each valid transition is staged for its calling frame and applied in call order after all selected Decisions are
validated. A lower frame can pop itself but only the original live top can Push. Pushed frames become candidates for
later walks. A final Rewrite receives one validation walk of the replacement command with the same selection and
answer rules. If the replacement is refused, the original command does not run and the first walk's transitions are
discarded. Accepted and refused rewrites keep both walks' context and messages in order. A second final Rewrite fails.

| Starting stack, top first | Selected decisions | Result |
|---|---|---|
| Methodless plan, working task, Ready | Task's marked Stop denies | The task's reason blocks Stop. |
| Ordinary Stop returns Allow, marked task Stop denies, Ready | Allow, then Deny | Both contexts stay. The task denies Stop. |
| Highest method denies, lower marked method allows | Deny, then Allow | The first refusal stands and both contexts stay. |
| Shell method rewrites, marked shell method delegates with context | Rewrite, then Delegate | Default Allow for the original command with both contexts. The replacement is never parsed. |

The marked methods keep the existing skill requirements, pending communication and sequence work, task Stop guard,
and Ready file and tool policies effective beneath other matching handlers. Ready's ordinary shell default stays
shadowed where a higher method handles the command.

## Boundaries with other designs

- Ticking is not lifecycle. Doc 35 lets a state type opt in to ticks; a tick never enters or resumes a frame, and the
  engine's commands change stacks through the same explicit transitions, one command per transaction.
- Doc 39's conditional states decline a switched-off state at `AgentStack::withStateOnTop`, the admission point every
  push passes through; a declined state never enters.

## Review evidence for the state handler design

The story identifiers below refer to design doc 56, revision 2. “Source review” identifies behavior without a
dedicated end-to-end test. The Tasks fixture dispatches the real exported fact classes through Laravel while admitted
to a live stack. It tests the receiving stack, without claiming to exercise the native driver or the Tasks commands
that change task status.

| Book | Outcomes and evidence |
|---|---|
| A | **A1** Task stop under a methodless plan, **A2** ordinary shadowing, and **A4** selection by input are covered by `AgentStackTest` and `StateMethodSelectorTest`. **A3** `StateEventDeliveryTest` proves an empty first result still covers an ordinary method, and ordinary listeners remain independent. **A5** Source review of `StateEventDelivery` and `StateEventStacks` shows an empty selection writes no context and never opens a stack. |
| B | **B1–B3** `StateMethodSelectorTest` and `AgentStackTest` check ordered first and marked matches without counting a marked first method twice. **B4** `TaskWatchDeliveryTest` dispatches both Tasks events and distinguishes their selection. **B5** `StateEventDeliveryTest` checks ordinary and marked command groups in order. |
| C | **C1** `TaskWatchDeliveryTest` records a higher Allow and lower task Deny in a real hook and retains the watch context. **C2–C4** `AgentStackTest` checks every called answer, the sticky denial and later refusal reason. **C5** the same suite accepts a non-bottom Allow and checks input restrictions. |
| D | **D1–D3** `AgentStackTest` covers context ordered independently of answers, including duplicate text. **D4** `AgentStackTest` records only called methods, and `TaskWatchDeliveryTest` excludes shadowed listeners from the trace. **D5** `HookRewriteTest` checks message aggregation and `AgentMessageDeliveryTest` checks the idle and busy delivery paths. |
| E | **E1** `AgentStackTest` proves Delegate does not reopen selection. **E2** `HookRewriteTest` verifies an overwritten rewrite never reaches the parser. **E3** `AgentStackTest` verifies that a selected `before()` answer prevents a second call. **E4–E5** `HookRewriteTest` covers replacement checking, repeat rewrite refusal and both walks' context. |
| F | **F1–F2** `AgentStackTest` and `TransparentFramesTest` exercise finished and disabled frames. The shared selector uses the same liveness rule for events. **F3–F5** `AgentStackTest` checks origin-attributed transitions, lower push refusal and the next-walk rule. |
| G | **G1–G2** `AgentMessageDeliveryTest` and `TaskWatchDeliveryTest` verify retained order and one attention request, with plain context alone remaining quiet. **G3** `StateEventDeliveryTest` covers command order. **G4** `EventCommandsTest` checks the ten-command bound and `StateEventDeliveryTest` verifies a failed collection leaves no partial context. **G5** `TaskWatchDeliveryTest` uses the public fact and `StateEventDeliveryTest` covers a failure after the producer committed. |
| H | **H1–H5** `StateEventDeliveryTest` exercises a highest ordinary origin below a methodless state, a covering state, continued marked effects, a recreated occurrence and retained context from a stale origin. Source review of `StateEventOriginGuard` confirms fresh liveness is checked before every command, including after a disable. |
| I | **I1–I3** `StateMethodsTest` and `DomainEventRulesTest` cover the names, locations and signatures. **I4** `StateMethodSelectorTest` and `TaskWatchDeliveryTest` exercise inheritance and the unmarked override. **I5** `StateEventRegistrationTest` checks cached and uncached registration and rejects stale manifests. |
| J | **J1–J2** `ListenerPolicyTest` and `DomainEventRulesTest` exercise owner and usage boundaries. **J3–J5** `StateEventScopeTest`, `TaskWatchDeliveryTest` and `StateEventDeliveryTest` cover admitted targets, unaddressed events, Engine grants and original command authority. |
| K | **K1–K2** `AgentStateMachineTest` and `StateEventDeliveryTest` verify failed collection, rollback and committed work after an effect fails. **K3–K5** `StateEventScopeTest`, `StateEventActivityTest` and `StateEventDeliveryTest` exercise repeated dispatch, cycle and depth limits, and restoration of enclosing scopes after failure. |
| L | **L1–L3** `AgentStackTest` covers marked skill, communication, sequence, file and tool-policy methods alongside ordinary handlers. **L4** `TaskWatchDeliveryTest` records selections, distinct frame occurrences, guarded effects and pending context. **L5** Source review follows admitted targets to `AgentStack::DEEPEST` and grouped loads in `StackRestorer`. This establishes the lookup boundary and the frame cap. It does not measure throughput with many unrelated stacks. |
