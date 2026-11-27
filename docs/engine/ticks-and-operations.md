# The engine: ticks, periodic work and operations

The engine (doc 35, built in `app/Engine`) gives Core a clock. One process, `php artisan engine:tick`, runs a pass about
once a second. Each pass first tells periodic listeners that time passed, then ticks the stack frames whose state
asked for ticks. This page is what a domain author needs to write a ticking state or periodic work, and what an
operator needs to run the engine.

## A ticking state

A state type ticks when its loader carries the `App\Hooks\Contracts\TickableStateLoader` mark. Every state that loader
builds must implement `App\Contracts\Work\TickableState`. Loaders without the mark are never restored to look for
ticks. A marked loader that builds a state without `onTick` fails with `TickableStateMissing` when its batch is built.

```php
use App\Contracts\Work\TickableState;
use App\Hooks\Contracts\TickableStateLoader;
use App\Stacks\AgentState;
use App\Support\Ticks\TickCommands;
use App\Engine\Ticks\TickContext;

final class AwaitingAnswerLoader implements TickableStateLoader { /* statesFor, schemaVersion as for any loader */ }

final class AwaitAnswerState extends AgentState implements TickableState
{
    public function onTick(TickContext $tick): TickCommands
    {
        if ($tick->enteredAt->diffInSeconds($tick->now) < 60) {
            return TickCommands::none();
        }

        return TickCommands::of(new SendQuestionReminder($tick->target, $this->questionId));
    }
}
```

The fixture `tests/Fixtures/Domains/Reminders` is a full working example.

`TickContext` has exactly four fields:

| Field | What it is |
| --- | --- |
| `now` | The server time of this tick. |
| `delta` | An `App\Engine\Ticks\ElapsedTime`: the time since this frame's last settled tick. It is never null. |
| `enteredAt` | The server time the frame entered the stack. It survives covering, resuming and restoring. |
| `target` | The `StackTarget` the frame sits on. |

`ElapsedTime` reads as `seconds()` or `milliseconds()`. `isApproximate()` is true when the engine had no measurement of
its own: on a frame's first tick, and after an engine restart, the delta is worked out from the database (the frame's
last checkpoint, or its entry time) and marked approximate. A delta never goes below zero.

What `onTick` may do:

- Read only its own restored snapshot and the context.
- Answer at most ten commands (`TickCommands::MAXIMUM`) in the order they should run, or `TickCommands::none()`.
- Never write a model, sleep, call the network, start a process or dispatch a job. Expensive work belongs in a command
  or a job.

A tick is not a hook. Covered frames tick too. A finished state is skipped and stays stored; the engine
never prunes stacks.

## The commands a tick answers

Each command runs as its own top-level bus call, in its own transaction and isolation, with the Engine as actor. The
engine holds no session or stack lock while it runs them. The list is not atomic: the commands run in order, the first
failure stops the rest, and the ones before it stay committed. A frame settles only when every command succeeded (or it
answered none). Only then does its timing baseline move, so after a failure the next tick is told the whole interval
since the last success.

The engine is authorized like any actor: its authorizer allows a command only while it holds a grant, the frame it is
ticking or a maintenance capability (`App\Engine\EngineAccess`). Outside one it may run nothing. Its own
maintenance commands, such as `App\Sessions\Commands\MarkSilentSessions\MarkSilentSessionsCommand`, name the `EngineMaintenance` entry.

Every command a tick answers runs with the frame's work as its origin (`App\Hooks\Values\WorkOccurrence`, for
example run 3 of task 41). Inside the command's transaction and before its handler, `GuardTickOrigin` takes the
origin's row lock through the ticking type's `WorkOccurrenceGuard` and checks the work is still live; a retried
attempt checks again first. When the work is over (`WorkOccurrenceStale`) the command commits nothing, the tick's
remaining commands are dropped, and the frame settles, since running it again cannot bring the work back. A finish
between two commands of one tick lets the first commit and refuses the second.

A ticking loader names its guard, so a ticking type without one cannot be declared:

```php
public function occurrenceGuard(): WorkOccurrenceGuard
{
    return new AwaitAnswerGuard(); // locks the question and requires it still waiting
}
```

A command that changes work besides its origin implements `App\Hooks\Contracts\TickSubjectLocks` and names every
other subject it locks. The engine takes the origin first, then those subjects ordered by type and id, so two ticks
never wait on each other in opposite order; a command nested inside it that locks undeclared work is refused
(`TickSubjectUndeclared`).

Its handler must still make a repeat harmless, because a frame can be reconsidered after a crash or a partial failure:

1. Lock the subject through its model.
2. Recheck the condition under the lock (still unanswered, not yet reminded).
3. Change the subject only then.

```php
public function handle(SendQuestionReminder $command): void
{
    $question = Question::lockedById($command->questionId);

    if ($question->answered) {
        $this->stacks->popExposed($command->target);

        return;
    }

    if ($question->isWaiting()) {
        $question->remindAt($this->clock->now());
    }
}
```

Use `App\Time\Contracts\ServerClock` for times that are stored, never the PHP clock.

## Changing a stack from a handler

The engine's grant for a tick covers only that frame's target. In a handler:

- `App\Hooks\Contracts\EngineStack::push($target, $reference)` pushes a state through the same push every caller uses.
  It refuses a target outside the grant (`EngineAccessRefused`) and a session that no longer runs.
- `App\Stacks\Contracts\Work\AgentStacks::popExposed($target)` pops the finished and switched-off frames exposed at the top,
  with their exits; frames buried under a live one stay.

Never change a stack from `onTick` itself.

## Periodic work: engine listeners

Work that belongs to no frame, such as the start silence sweep, implements `App\Contracts\Events\EngineListener`:

```php
final readonly class MarkSilentSessionsOnTick implements EngineListener
{
    public function __construct(private CommandBus $commands) {}

    public function maintenanceScope(): string
    {
        return MarkSilentSessions::MAINTENANCE_SCOPE; // 'agents.silence'
    }

    public function __invoke(EngineTicked $event): void
    {
        $this->commands->run(new MarkSilentSessions);
    }
}
```

Add it to `App\Engine\EngineListenerSet` from a Core provider. Each pass builds the listener fresh and grants
it only its own maintenance scope. Its commands check that scope with `EngineAccess::checkMaintenance()`. A listener
that throws is logged and the next one still runs. `App\Events\Engine\EngineTicked` (`now` and `sincePrevious`) is also
dispatched on the event dispatcher for plain observers that run no commands. Listeners must do small, bounded reads.

## Configuration: `config/journal.php (engine)`

| Setting | Default | Meaning |
| --- | --- | --- |
| `lock_key` | `ENGINE_LOCK_KEY` | The advisory lock key that makes one process the engine. |
| `pass_budget_ms` | 800 | How long a pass may tick frames; the frames left wait for the next pass. |
| `command_budget_ms` | 250 | The intended limit of one tick command. |
| `batch_size` | 100 | Frames selected per pass. |
| `watchdog_seconds` | 10 | The process alarm that ends a hung pass. |

The engine has its own database connection, `engine` in `config/database.php`. It must reach PostgreSQL directly or
through a session-pinned proxy, because a transaction-pooling proxy breaks the advisory lock. The connection never
reconnects: a lost connection ends the process (`EngineConnectionLost`), and PostgreSQL releases the lock.

Presence is configured in `config/journal.php (actors)`: `presence_seconds` (120) is both how long a heartbeat keeps an actor
present and an agent session's silence threshold; `heartbeat_seconds` (30, never more than 60) is how often senders
beat.

### Operating envelope

The budgets above are provisional limits. They are to be measured by running `engine:tick` against the fixture of
`tests/Fixtures/Domains/Reminders` with 100, 500 and 1000 ticking frames and recording the logged `pass_duration_ms`:

| Ticking frames | Passes to visit all | Pass duration (ms) |
| --- | --- | --- |
| 100 | 1 | not yet measured |
| 500 | 5 | not yet measured |
| 1000 | 10 | not yet measured |

## The watchdog

Each pass runs under `pcntl_alarm(watchdog_seconds)` with SIGALRM left at its default action, which ends the process
even inside a blocking call. Nothing may install a SIGALRM handler. Checked in the app image (`dunglas/frankenphp:1-php8.5`
with pcntl): `pcntl_alarm(1)` during `sleep(5)`, and during a blocking `exec('sleep 5')` with async signals and a
SIGTERM handler installed, both end PHP with exit code 142 (128 + SIGALRM). A blocking PDO query was not checked.

## What the engine does not promise

- **No exactly-once delivery.** A crash between a command's commit and the frame's timing checkpoint makes the frame
  reconsider the same interval. Handlers' rechecks keep that harmless. Durable counters or money need their own
  processed-through checkpoint in their own domain.
- **No unattended isolation of a poison frame.** An ordinary exception is logged and the next frame runs. A frame that
  hangs again and again makes the watchdog end the process every time; the operator disables or fixes that state type
  and restarts.
- **No protection from an uninterruptible kernel hang.**
- **No fencing of remote side effects.** The advisory lock gives one cooperating database writer, not more.

## Running the engine

The `ticker` service in `compose.yaml` runs `php artisan engine:tick` from the same image as `queue`. It restarts
unless stopped and has no health check. A second ticker waits for the lock without running passes. SIGTERM or SIGINT
ends it after the current pass, releasing the lock.

- After a code change in development: `docker compose -p agent-journal-6 restart ticker`. No file watcher does it.
- A production deploy restarts `ticker` together with `app` and `queue`.
- Neither an Octane worker timer nor `schedule:work` runs periodic engine work.
- The log shows each pass (`pass_lateness_ms`, `pass_duration_ms`), missed intervals (`missed_intervals`), and every
  failed tick with its frame and state class.
