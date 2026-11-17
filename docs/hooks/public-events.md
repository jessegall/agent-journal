# Public events

A public event is a fact a domain publishes for anyone to hear: it lives in the owner's `Api/Events` folder and is on the owner's export list. Every other event stays private to its owner. Core's two extension requests are the other kind of public event: they ask listeners to contribute, at once, inside the work that raised them.

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

A fact that changes what users see also implements `App\Core\Ui\Contracts\ChangesWhatUsersSee` (Chat's three, Plans' two and Rules' three today). Web listens for that marker once, through the dispatcher's interface listeners, so a new domain's or module's fact refreshes the open pages without any change to Web; Core owns the marker and names no domain.

`TaskStarted`, `SequenceStarted` and `MessageNeedsAnswer` stay private: their listeners push stack states inside the same transaction, so they are not facts after a commit. Plans hears `TaskStarted` through its approved requirement of Tasks: `TasksDomain::exports()` lists it, so only a domain that requires Tasks may name it.

## Requests, answered inside the work

| Request | Raised | What a listener does |
|---|---|---|
| `StateTypesRequested` | once per worker, while the state types are built | registers its state types through `StateRegistration` |
| `ContextWasCompacted` | inside the hook call that handles a compaction, before the stack lock, in the same transaction | adds reminders through `ReminderContribution` and makes its own change idempotent by the compaction id |

## What a listener can count on, and what it cannot

- **One connection, one commit.** Domain writes and stack changes share the default connection, so the change and the stack push commit together or not at all. A listener of a fact runs after that commit, outside it.
- **Errors after the commit.** Listeners run synchronously in the order Laravel registered them. If one throws, the exception reaches the caller and Laravel's exception reporting records it with the event and the listener in its stack trace; the change itself has already committed and is not rolled back. Later listeners of that fact do not run, and a listener returning `false` also stops the ones after it.
- **No replay, no queue promise.** Nothing stores facts or retries them. A caller that lost the answer to an assignment command reads the record again (`journal assignment show`) instead of expecting the fact or a history; there is no assignment history, outbox or inheritance. A missed or failed reaction is not delivered again, and a repeated start of a running plan raises nothing. Web's `PageChanged` is the one queued broadcast; it is pushed only after the commit (`after_commit` on the Redis queue).
