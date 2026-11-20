# Public events

An event is any class that implements Core's marker interface `App\Contracts\Event`, Core's, a domain's or a module's, whatever folder it sits in; `EventMarkerTest` fails on a class in an `Events` folder that does not. An event is public only when its owner lists it under `events` in its exports:

```php
public function exports(): Exports
{
    return Exports::make()
        ->events(PlanStarted::class, PlanProgressChanged::class)
        ->contracts(PlanReader::class)
        ->commands(StartPlan::class)
        ->build();
}
```

Every other event stays private to its owner. Another domain hears a public event through a checked typed listener or a checked state method, and only when it requires the owner. Core's public events need no requirement. Core's two extension requests are public events too: they ask listeners to contribute, at once, inside the work that raised them. Whether an event is public and when it is raised are separate choices: a public event may be raised at once or after the commit.

## Facts, raised after the outermost commit

Each fact implements `ShouldDispatchAfterCommit`, so a listener hears it only once the transaction that made the change has committed, the outermost one when transactions nest. A rolled-back change raises nothing. Each carries plain values: ids, and Core values such as `StackTarget` or `ActorContext`.

| Fact | Owner | Raised when | Payload |
|---|---|---|---|
| `PlanStarted` | Plans | a plan starts; starting it again raises nothing | plan id, the actor who started it |
| `PlanProgressChanged` | Plans | a task in one of the plan's phases started, finished, was blocked or cancelled | plan id |
| `MessageSent` | Chat | the user sent a message to a running agent session | message id, stack target |
| `MessageAnswered`, `MessageDismissed` | Chat | a message was answered or dismissed | message id |
| `RuleApproved`, `RuleDenied`, `RuleRemoved` | Rules | the user reviewed a proposed rule, or a rule was removed | rule id |
| `TaskFinished`, `TaskBlocked`, `TaskCancelled` | Tasks | a task changed state through `ChangeTaskState` | task id |
| `AssignmentsChanged` | Core | an assignment command or a retirement changed at least one record; a command that changed nothing raises nothing | operation id, the acting actor, the reason (assigned, reassigned, unassigned, retired), every actual change with its record and before and after assignment, the time |

`AssignmentsChanged` is raised once per command, never per record, and only from the attempt that committed: an attempt the writer ran again after a serialization failure leaves no fact. A cascade over a plan raises one fact for all its changes.

A fact that changes what users see also implements `App\Ui\Contracts\UserInterfaceUpdater` (Chat's three, Plans' two and Rules' three today). Web's `BroadcastPageChange` listens for that marker, and the checked provider turns it into one listener for each exported event that implements it, so a new domain's or module's exported fact refreshes the open pages without any change to Web, while a fact nobody exports refreshes nothing; Core owns the marker and names no domain.

`TaskStarted` is exported and raised at once, not after the commit: its listeners push stack states inside the same transaction. Plans hears it through its approved requirement of Tasks. `SequenceStarted` and `MessageNeedsAnswer` are internal: their owners do not export them, so only their own listeners hear them.

## How a private event is refused

One provider, `App\Domains\Providers\DomainEventServiceProvider`, registers every listener: it discovers the `Listeners` folders of Core (`CoreApi::listenerFolders()`) and of each domain, and `App\Domains\Support\ListenerPolicy` checks each event and listener pair. A listener on an event its owner does not export, on an event of a domain its own domain does not require, or on something that is not a concrete event stops the application with `InvalidListener`, naming the listener, the event and its owner. The same check runs when `php artisan event:cache` writes the cache and when a cached boot reads it, so a cache cannot let a private pair through. A cache written before a declaration change is refused with the instruction to run `php artisan event:cache` again; restart long-lived workers (`php artisan octane:reload`, `php artisan queue:restart`) after a declaration change. A listener registered by hand (`Event::listen` on a project event, a wildcard, a subscriber or a `listen` property) is refused by the architecture suite; the one exception is each domain's state types answering `StateTypesRequested` through the `RegisterStates` bootstrapper.

## Requests, answered inside the work

| Request | Raised | What a listener does |
|---|---|---|
| `StateTypesRequested` | while building the declaration snapshot and when initializing the live state registry | registers its state types through `StateRegistration` |
| `ContextWasCompacted` | inside the hook call that handles a compaction, before the stack lock, in the same transaction | adds reminders through `ReminderContribution` and makes its own change idempotent by the compaction id |

## What a listener can count on, and what it cannot

- **One connection, one commit.** Domain writes and stack changes share the default connection, so the change and the stack push commit together or not at all. A listener of a fact runs after that commit, outside it.
- **Errors after the commit.** Listeners run synchronously in the order Laravel registered them. If one throws, the exception reaches the caller and Laravel's exception reporting records it with the event and the listener in its stack trace; the change itself has already committed and is not rolled back. Later listeners of that fact do not run, and a listener returning `false` also stops the ones after it.
- **No replay, no queue promise.** Nothing stores facts or retries them. A caller that lost the answer to an assignment command reads the record again (`journal assignment show`) instead of expecting the fact or a history; there is no assignment history, outbox or inheritance. A missed or failed reaction is not delivered again, and a repeated start of a running plan raises nothing. Web's `PageChanged` is the one queued broadcast; it is pushed only after the commit (`after_commit` on the Redis queue).

## Application events on live stack states

A registered state may declare one public instance method named `on<EventClassName>` per concrete event, with one
required argument of exactly that event type and an `App\Hooks\Values\EventCommands` return type. A loader declares
its concrete `stateClass()` without loading subjects. The declaration is checked at boot and restoration checks that
the loaded state matches. The normal ownership, exports and declared dependency rules apply to the exact method
signature. The state folder grants no permission to use a foreign event elsewhere or raise it.

The provider installs one bridge per declared event after the ordinary listeners. Cache generation and cached boot
validate the declaration, owner and effective `#[StackWide]` marker. Cached data names methods. The current stack
and its state subjects are loaded at delivery.

```php
public function onTaskFinished(TaskFinished $event): EventCommands
{
    if ($event->taskId !== $this->watch->id) {
        return EventCommands::none();
    }

    return EventCommands::of(new RecordFinishedTask($event->taskId, $this->watch->runNumber))
        ->withContext('A watched task finished.');
}

#[StackWide]
public function onTaskCancelled(TaskCancelled $event): EventCommands
{
    if ($event->taskId !== $this->watch->id) {
        return EventCommands::none();
    }

    return EventCommands::of(new RecordCancelledTask($event->taskId, $this->watch->runNumber))
        ->withMessage('A watched task was cancelled.');
}
```

In the Tasks fixture, a watch on top shadows each lower ordinary finish handler. The same watch plus any lower
marked cancellation handlers respond to cancellation. An ordinary override of the inherited cancellation method
stays shadowed when a higher watch handles it. Returning an empty result still claims the method's selection.

The admission boundary captures the acting identity, authority and allowed stack targets at dispatch, including the
original signed session or Engine frame grant where applicable. An event payload cannot grant access to a stack.
The bridge considers only admitted stacks that still exist and are active, up to 100 frames per target. A dispatch
with no admitted target still reaches ordinary listeners. Engine maintenance with no frame grant has no state
recipients. The bridge never opens a stack.

Selected state event methods evaluate live state and return an immutable result. They do not run commands directly,
change the stack, or send attention. The bridge collects and checks all results before applying effects. Each method
can supply up to ten normal application commands. Plain context and messages are retained once in call order for the
next eligible hook. `withMessage()` includes its text in that context and requests attention. A delivery requests
attention once per target with messages. Plain context does not wake the runtime.

Commands run through the normal bus with the original caller's policies and deadline, in listener and command order.
The bus rechecks the exact originating frame under admission and lock before every command. An ordinary origin must
still be the highest live match, even if a methodless frame covers it. A marked origin must still be the same live
occurrence with the effective marker. An ineligible origin loses its remaining commands with a diagnostic. Other
origins can continue and the context already retained stays available. A closed or unavailable stack stops effects
for that target.

A synchronous dispatch runs in its caller's work. A fact marked `ShouldDispatchAfterCommit` retains its captured audience
until the outermost commit. A rollback discards the deferred delivery. Failure reports identify collection, retention
or effects. After commit the original write and any committed effects remain. Events opting into
`ListenerFailureLog` log failures without failing the caller. There is no automatic replay or exactly-once delivery.
The active target, frame and event key detects cycles, same-stack evaluation refuses reentry, and nesting is capped
at ten deliveries. Distinct sequential dispatches can run independently.

## Listener migration review

- Keep `PushTaskState`, `PushSequenceState`, `RegisterAnsweringState` and start-stack listeners at their
  creation boundaries. Their pushes or registration must work before any matching frame exists.
- Keep global updates in their ordinary listeners. Examples include `RaisePlanProgressChanged`, `BroadcastPageChange`,
  `CloseEndedSessionDraft`, link invalidation, process activity and skill settings and receipts. Their work cannot
  depend on a live frame or an admitted stack target.
- Keep `SupplyMemories`, `SupplyHookContext` and `RemindRequiredSkills` as context-boundary contributors. They
  cover the session's boundary and add directly to that reply. A reminder meant only for the live frame responsible
  for particular work is a candidate for a state method on a later fact, with its text delivered at the next hook.
- Existing production listeners stay registered. The task and sequence stop guards, communication and skill
  instructions, and Ready policies use marked hook methods. Ready's tool guard retains the operation-policy check
  beneath higher matching tool handlers.
