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

Every other event stays private to its owner. Another domain hears a public event only through a concrete typed listener in its `Listeners` folder, and only when it requires the owner; Core's public events need no requirement. Core's two extension requests are public events too: they ask listeners to contribute, at once, inside the work that raised them. Whether an event is public and when it is raised are separate choices: a public event may be raised at once or after the commit.

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

A fact that changes what users see also implements `App\Ui\Contracts\UpdatesUserInterface` (Chat's three, Plans' two and Rules' three today). Web's `BroadcastPageChange` listens for that marker, and the checked provider turns it into one listener for each exported event that implements it, so a new domain's or module's exported fact refreshes the open pages without any change to Web, while a fact nobody exports refreshes nothing; Core owns the marker and names no domain.

`TaskStarted` is exported and raised at once, not after the commit: its listeners push stack states inside the same transaction. Plans hears it through its approved requirement of Tasks. `SequenceStarted` and `MessageNeedsAnswer` are internal: their owners do not export them, so only their own listeners hear them.

## How a private event is refused

One provider, `App\Domains\Providers\DomainEventServiceProvider`, registers every listener: it discovers the `Listeners` folders of Core (`CoreApi::listenerFolders()`) and of each domain, and `App\Domains\Support\ListenerPolicy` checks each event and listener pair. A listener on an event its owner does not export, on an event of a domain its own domain does not require, or on something that is not a concrete event stops the application with `InvalidListener`, naming the listener, the event and its owner. The same check runs when `php artisan event:cache` writes the cache and when a cached boot reads it, so a cache cannot let a private pair through. A cache written before a declaration change is refused with the instruction to run `php artisan event:cache` again; restart long-lived workers (`php artisan octane:reload`, `php artisan queue:restart`) after a declaration change. A listener registered by hand (`Event::listen` on a project event, a wildcard, a subscriber or a `listen` property) is refused by the architecture suite; the one exception is each domain's state types answering `StateTypesRequested` through the `RegisterStates` bootstrapper.

## Requests, answered inside the work

| Request | Raised | What a listener does |
|---|---|---|
| `StateTypesRequested` | once per worker, while the state types are built | registers its state types through `StateRegistration` |
| `ContextWasCompacted` | inside the hook call that handles a compaction, before the stack lock, in the same transaction | adds reminders through `ReminderContribution` and makes its own change idempotent by the compaction id |

## What a listener can count on, and what it cannot

- **One connection, one commit.** Domain writes and stack changes share the default connection, so the change and the stack push commit together or not at all. A listener of a fact runs after that commit, outside it.
- **Errors after the commit.** Listeners run synchronously in the order Laravel registered them. If one throws, the exception reaches the caller and Laravel's exception reporting records it with the event and the listener in its stack trace; the change itself has already committed and is not rolled back. Later listeners of that fact do not run, and a listener returning `false` also stops the ones after it.
- **No replay, no queue promise.** Nothing stores facts or retries them. A caller that lost the answer to an assignment command reads the record again (`journal assignment show`) instead of expecting the fact or a history; there is no assignment history, outbox or inheritance. A missed or failed reaction is not delivered again, and a repeated start of a running plan raises nothing. Web's `PageChanged` is the one queued broadcast; it is pushed only after the commit (`after_commit` on the Redis queue).
