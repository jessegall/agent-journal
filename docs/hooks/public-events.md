# Public events

An event is any class that implements Core's marker interface `App\Contracts\Events\Event`, Core's, a domain's or a module's, whatever folder it sits in; `EventMarkerTest` fails on a class in an `Events` folder that does not. An event is public only when its owner lists it under `events` in its exports:

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

## Facts, released after the real commit

A fact is captured where its change is made: a row fact is raised by the model method that saves the change, after
that save succeeded, and a command-level fact is staged by the command's own code through
`App\Contracts\Bus\CommandFacts::publishAfterCommit`. Both join the event unit of the transaction in save order.
The fact's transaction listeners run inside that transaction, before it commits; its public listeners hear it through
Laravel's dispatcher only after the real commit, once no command of the request still runs. A rolled-back change
releases nothing. Each fact carries plain values: ids, and Core values such as `StackTarget` or `ActorContext`.

| Fact | Owner | Raised when | Payload |
|---|---|---|---|
| `PlanStarted` | `Plan::startOnce` | a plan starts; starting it again raises nothing | plan id, the actor who started it |
| `PlanFinished`, `PlanCancelled` | `Plan::finish`, `Plan::cancel` | a plan ends | plan id, the actor who ended it |
| `PlanProgressChanged` | projection: `RaisePlanProgressChanged`, `SamplePlanOfStartedTask` | a task in one of the plan's phases started, finished, was blocked or cancelled | plan id |
| `MessageSent` | `Message::create` | an actor sent a message | message id, author, source and destination inbox |
| `MessageAnswered`, `MessageDismissed` | `Message::answerWith`, `Message::dismissBy` | a message was answered or dismissed | message id, the actor, the reply or the dismissal type |
| `RuleApproved`, `RuleDenied`, `RuleRemoved` | `Rule::approveBy`, `Rule::deny`, `Rule::remove` | the user reviewed a proposed rule, or a rule was removed | rule id |
| `TaskFinished`, `TaskBlocked`, `TaskCancelled` | `Task::finish`, `Task::block`, `Task::cancel` | a task's run ended | task id |
| `AssignmentsChanged` | command-level: `AssignmentFacts` | an assignment command or a retirement changed at least one record; a command that changed nothing raises nothing | operation id, the acting actor, the reason (assigned, reassigned, unassigned, retired), every actual change with its record and before and after assignment, the time |

`tests/Architecture/EventOwners` lists every event with its owner, and `EventProducerTest` fails on a fact
sent anywhere else. `AssignmentsChanged` is staged once per command, never per record, and only from the attempt that
committed: an attempt the writer ran again after a serialization failure leaves no fact. A cascade over a plan raises
one fact for all its changes.

A fact that changes what users see also implements `App\Contracts\Navigation\UserInterfaceUpdater`. Web's `BroadcastPageChange`
listens for that marker, and the checked provider turns it into one listener for each exported event that implements
it, so a new domain's or module's exported fact refreshes the open pages without any change to Web, while a fact
nobody exports refreshes nothing; Core owns the marker and names no domain.

`TaskStarted` is exported and raised by `Task::start` with the actor that started the task. Its transaction listener
`PushTaskState` pushes the task on the stack inside the start's transaction, before the commit, and Plans'
`SamplePlanOfStartedTask` reads the plan holding the task there too; its public listeners hear it after the commit.
Plans hears it through its approved requirement of Tasks. `SequenceStarted` and `MessageNeedsAnswer` are internal:
their owners do not export them, so only their own listeners hear them.

## How a private event is refused

One provider, `App\Providers\DomainEventServiceProvider`, registers every listener: it discovers the `Listeners` folders of Core (`CoreApi::listenerFolders()`) and of each domain, and `App\Domains\Support\ListenerPolicy` checks each event and listener pair. A listener on an event its owner does not export, on an event of a domain its own domain does not require, or on something that is not a concrete event stops the application with `InvalidListener`, naming the listener, the event and its owner. The same check runs when `php artisan event:cache` writes the cache and when a cached boot reads it, so a cache cannot let a private pair through. A cache written before a declaration change is refused with the instruction to run `php artisan event:cache` again; restart long-lived workers (`php artisan octane:reload`, `php artisan queue:restart`) after a declaration change. A listener registered by hand (`Event::listen` on a project event, a wildcard, a subscriber or a `listen` property) is refused by the architecture suite; the one exception is each domain's state types answering `StateTypesRequested` through the `RegisterStates` bootstrapper.

A listener whose writes the command's transaction requires carries `#[App\Attributes\InCommandTransaction]`. The policy takes it out of the dispatcher's map into `App\Domains\Support\RequiredListenerRegistry`, built from the same discovered or cached map, each event's listeners in the order of their full names; availability still gates a domain's listener, and no failure logging wraps it, so its failure rolls the command back. Boot is refused, naming the event and the listener, when a transaction listener is queued, broadcasts or handles events after the commit, is registered twice, or belongs to a domain other than the event's owner while the event does not name it with `#[App\Attributes\RequiresTransactionListener]`; ordinary subscription rights never grant that. The cache carries the lanes' version, so a cache written before them is refused: run `php artisan event:cache` again and restart long-lived workers after this change.

## Requests, answered inside the work

| Request | Raised | What a listener does |
|---|---|---|
| `StateTypesRequested` | while building the declaration snapshot and when initializing the live state registry | registers its state types through `StateRegistration` |
| `ContextWasCompacted` | inside the hook call that handles a compaction, before the stack lock, in the same transaction | adds reminders through `ReminderContribution` and makes its own change idempotent by the compaction id |

## What a listener can count on, and what it cannot

- **One connection, one commit.** Domain writes and stack changes share the default connection, so the change, its
  transaction listeners' writes and the stack push commit together or not at all. A public listener of a fact runs after
  that commit, outside it.
- **Errors after the commit.** Public listeners run in the order Laravel registered them. A failure is logged with the
  fact and the listener and delivery goes on with the next fact; the change itself has already committed and is not
  rolled back.
- **Two accepted limits.** A crash between the commit and the release loses that delivery: nothing stores facts or
  retries them. A queued listener's delivery is at least once, so a consumer tolerates a repeat. A caller that lost the
  answer to an assignment command reads the record again (`journal assignment show`) instead of expecting the fact or
  a history, and a repeated start of a running plan raises nothing. Web's `PageChanged` is the one queued broadcast;
  it is pushed only after the commit (`after_commit` on the Redis queue).

## Application events on live stack states

A registered state may declare one public instance method named `on<EventClassName>` per concrete event, with one
required argument of exactly that event type. It returns nothing, a command, an event, or several of them, as
`docs/hooks/state-answers.md` says. A loader declares its concrete `stateClass()` without loading subjects. The
declaration is checked at boot and restoration checks that the loaded state matches. The normal ownership, exports and
declared dependency rules apply to the exact method signature. The state folder grants no permission to use a foreign
event elsewhere or raise it.

The provider installs one bridge per declared event after the ordinary listeners. Cache generation and cached boot
validate the declaration and its owner. Cached data names methods. The current stack and its state subjects are loaded
at delivery.

```php
public function onTaskFinished(TaskFinished $event): RecordFinishedTask|null
{
    if ($event->taskId !== $this->watch->id) {
        return null;
    }

    return new RecordFinishedTask($event->taskId, $this->watch->runNumber);
}
```

Every live state that declares the listener is asked, from the top down, covered or not; a state filters the facts it
cares about itself.

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

A synchronous dispatch runs in its caller's work. A fact retains its captured audience until its release
after the real commit. A rollback discards the deferred delivery. Failure reports identify collection, retention
or effects. After commit the original write and any committed effects remain. Events opting into
`ListenerFailureLog` log failures without failing the caller. There is no automatic replay or exactly-once delivery.
The active target, frame and event key detects cycles, same-stack evaluation refuses reentry, and nesting is capped
at ten deliveries. Distinct sequential dispatches can run independently.

## Listener migration review

- Keep `PushTaskState`, `PushSequenceState`, `RegisterAnsweringState` and start-stack listeners at their
  creation boundaries. Their pushes or registration must work before any matching frame exists.
- Keep global updates in their own listeners. `RaisePlanProgressChanged` and `BroadcastPageChange` are public
  projections after the commit; `CloseEndedSessionDraft`, link invalidation (`InvalidateRemovedLinkMembers`) and
  process activity (`ReadOutputLive`, `RefreshRunActivity`) are transaction listeners inside the transaction. Their work
  cannot depend on a live frame or an admitted stack target.
- Keep `SupplyMemories`, `SupplyHookContext` and `RemindRequiredSkills` as context-boundary contributors. They
  cover the session's boundary and add directly to that reply. A reminder meant only for the live frame responsible
  for particular work is a candidate for a state method on a later fact, with its text delivered at the next hook.
- Existing production listeners stay registered. The task and sequence stop guards, communication and skill
  instructions, and Ready policies use marked hook methods. Ready's tool guard retains the operation-policy check
  beneath higher matching tool handlers.
