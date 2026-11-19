# The command bus

Every public write in journal version 6 is a command on Core's command bus (doc 19, built in `app/Bus`). A domain or a
module adds a command, a handler for it, and, if it wants, middleware that watches or changes commands. This page is
everything a module developer needs for that.

## A command and its handler

A command is a final readonly value in the owner's `Commands` folder that extends `App\Bus\Support\Command` and
declares only its business fields in its constructor. It names its handler with `#[HandledBy]`, and its docblock says
what it answers. A handler sits in `Handlers`, has one public `handle` method that takes the command, and holds no
transaction code: the bus opens the transaction.

The handler reads who dispatched the command with `$command->dispatchedBy()`: an `App\Actors\Support\ActorContext`,
the actor's type and id and nothing more, no authority. The bus binds it on every call. A command the caller has just
built is unbound, and reading `dispatchedBy()` on it raises `App\Bus\Exceptions\CommandDispatcherMissing`.

```php
namespace Domain\Rules\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use Domain\Rules\Enums\RuleAbility;
use Domain\Rules\Handlers\ProposeRuleHandler;
use Domain\Rules\Models\Rule;
use Domain\Rules\Policies\RulePolicy;

/**
 * Proposes a rule with its text; it holds only once the user approves it.
 *
 * @extends Command<string>
 */
#[HandledBy(ProposeRuleHandler::class)]
#[Authorize(RulePolicy::class, RuleAbility::Propose)]
final readonly class ProposeRule extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public string $text,
        public string $reason,
        public string|null $replacesRuleId = null,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Rule::class;
    }
}
```

```php
namespace Domain\Rules\Handlers;

use App\Contracts\CommandHandler;
use Domain\Rules\Commands\ProposeRule;
use Domain\Rules\Exceptions\RuleMissing;
use Domain\Rules\Models\Rule;

final readonly class ProposeRuleHandler implements CommandHandler
{
    /**
     * @throws RuleMissing when the rule it would replace does not exist
     */
    public function handle(ProposeRule $command): string
    {
        if ($command->replacesRuleId !== null) {
            Rule::query()->find($command->replacesRuleId) ?? throw RuleMissing::withId($command->replacesRuleId);
        }

        $author = $command->dispatchedBy();

        return Rule::proposed($command->text, $command->reason, $command->replacesRuleId, $author)->id;
    }
}
```

A handler that runs another handler directly, without the bus, binds that command to its own dispatcher with
`withDispatcher($command->dispatchedBy())`, as `App\Agents\Handlers\OpenHostMainRuntimeHandler`,
`App\Agents\Support\DriverHeartbeatSource` and `App\Profiles\Handlers\InstallBuiltInProfilesHandler` do. Every other
command goes through the bus.

A command carries whole numbers, text, yes or no, decimals, backed enums, their nullable forms, final readonly values the
owner may name, and lists of those, never a model, a service or a stack target (a session is an int id the handler
resolves). A handler returns nothing, one of those, or a final readonly value such as `App\Assignments\Support\AssignmentResult`.

Every command a person or an agent sends declares who may run it: `#[Authorize(Policy::class, Ability::Case)]` and a
`subject()`, through `App\Bus\Contracts\HasAuthorizationSubject`. The subject is a model class for a class-level
ability (creating a task: `Domain\Tasks\Commands\CreateTask` returns `Task::class`), or the record the ability acts on
(blocking a task: `Domain\Tasks\Commands\BlockTask` returns the locked task). A handler may take that subject as its
second argument, as `Domain\Tasks\Handlers\BlockTaskHandler::handle(BlockTask $command, Task $task)` does, so it
loads the record once. The bus asks the caller's own profile before the handler runs and refuses with
`App\Actors\Exceptions\ActorNotAllowed`. A command without `Authorize` fails the boot with
`App\Bus\Exceptions\CommandAuthorizationMissing`, unless it names a trusted entry: `#[Entry(CommandEntry::HostControl)]`,
`ShareGateway`, `SkillPublisher` or `EngineMaintenance`. Such a command runs only through that entry's dispatcher, as
the journal itself, and never from a request. No command asks what kind of actor calls (rule 39); the guide in
docs/domains/authorization.md shows how a module declares its policies.

One attribute changes how a command runs:

- `#[RepeatableRead]` runs it in a repeatable-read transaction, as `App\Assignments\Commands\AssignRecord` does.

The owner lists its commands on its Domain class through `App\Bus\Contracts\ProvidesCommands`, and exports the ones other
owners may run. Callers take `App\Bus\Contracts\CommandBus` as a method parameter and call `run`:

```php
use App\Bus\Contracts\CommandBus;
use Domain\Tasks\Commands\FinishTask;

$commands->run(new FinishTask($taskId));
```

## Middleware: scopes, stages and order

A module watches or changes commands with middleware in its `CommandMiddleware` folder, declared on its Domain class
through `App\Bus\Contracts\ProvidesCommandMiddleware`:

```php
use App\Bus\Support\CommandScope;
use App\Bus\Support\MiddlewareDeclaration;

public function commandMiddleware(): array
{
    return [
        MiddlewareDeclaration::around(RecordAll::class, CommandScope::all()),
        MiddlewareDeclaration::around(RecordWriteNote::class, CommandScope::command(WriteNote::class)),
        MiddlewareDeclaration::inside(AuditNotes::class, CommandScope::ownedBy(self::class)),
    ];
}
```

- Scopes: every command (`CommandScope::all`), one command (`CommandScope::command`) or every command of one owner
  (`CommandScope::ownedBy`, or `CommandScope::ownedByCore` for Core's own). A module names another owner's command only
  when that owner exports it and the module requires it; every module may name Core's exported commands.
- Stages: `around` runs before the transaction opens, and its writes are not rolled back; `inside` runs inside the
  command's transaction, so a refusal rolls its writes back with the handler's.
- Order: Core's frame first (logging, the entry check, binding the dispatcher, stack admission), then the
  before-transaction stage, the transaction, the inside stage and the handler. Within a stage, owners run in the order of `bootstrap/domains.php`, and
  each owner's middleware in its declaration order.

`App\Bus\CommandMiddleware\BindDispatcher` runs right after `App\Bus\CommandMiddleware\CheckEntry`. It reads the request's
actor from `App\Actors\Contracts\CurrentActor` and passes on `$call->withDispatcher($actor)`, a call whose command is a
copy bound to that actor; the caller's own object stays unbound. A call without an actor is refused there with
`App\Actors\Exceptions\ActorContextMissing`, before stack admission. `replacedBy($command)` keeps its one argument and
binds the replacement to the call's actor, so module middleware never binds a command itself.

A middleware implements `App\Bus\Contracts\CommandMiddleware` and gets an `App\Bus\Support\CommandCall`. The contract,
each break of it refused by name:

| Rule | Refused with |
|---|---|
| Call next exactly once. | `App\Bus\Exceptions\MiddlewareSkippedCommand`, `App\Bus\Exceptions\ContinuationCalledTwice` |
| Return what next returned. | `App\Bus\Exceptions\CommandResultChanged` |
| Do not catch and hide a failure. | `App\Bus\Exceptions\MiddlewareSwallowedFailure` |
| Replace the command only with the same class, through `replacedBy`. | `App\Bus\Exceptions\CommandReplacedWithOtherClass` |
| Replace another owner's command only when it is exported. | `App\Bus\Exceptions\CommandReplacementRefused` |
| Refuse by throwing `App\Bus\Exceptions\CommandRefused::because(...)`. | shown as a form error on the web, a 403 on agent routes |

## The transaction

The bus opens one transaction per command: read committed unless the command is `#[RepeatableRead]`, with lock and
statement limits always set (`App\Bus\Support\OperationDeadline`). A serialization failure or a deadlock reruns the
whole command, three attempts at most, then `App\Bus\Exceptions\CommandRetryExhausted`; a lock or statement timeout is
`App\Bus\Exceptions\StackLockTimedOut`. A command run by a handler joins the open transaction when its isolation matches,
and is refused with `App\Bus\Exceptions\CommandTransactionMismatch` otherwise, as it is for a transaction the bus did not
open. A handler that opens a transaction itself is refused with `App\Bus\Exceptions\ExplicitTransactionInCommand`, and a
handler that catches a failed inner command and goes on fails the whole command with
`App\Bus\Exceptions\NestedCommandFailureIgnored`. An exception a caller may be shown implements
`App\Contracts\CommandRefusal`.

## Errors at start-up

The registry checks every declaration when the application starts:

| Error | Fix |
|---|---|
| `App\Bus\Exceptions\CommandDeclarationInvalid` | Make the command final readonly in `Commands`, extending `App\Bus\Support\Command`, with fields and a result the grammar above allows. |
| `App\Bus\Exceptions\CommandHandlerMissing` | Add `#[HandledBy]` naming a handler in the owner's `Handlers` folder. |
| `App\Bus\Exceptions\CommandHandlerTwice` | Name one handler. |
| `App\Bus\Exceptions\HandlerServesTwoCommands` | Give each command its own handler. |
| `App\Bus\Exceptions\HandlerInOtherOwner` | Keep the handler with its command's owner. |
| `App\Bus\Exceptions\CommandListedTwice` | List each command once. |
| `App\Bus\Exceptions\MiddlewareDeclarationInvalid` | Name only commands the module may see, in a `CommandMiddleware` folder. |
| `App\Bus\Exceptions\MiddlewareListedTwice` | Declare each middleware once per scope and stage. |

A command nobody registered is refused at dispatch with `App\Bus\Exceptions\CommandNotRegistered`, and a ninth nested
command with `App\Bus\Exceptions\CommandNestingTooDeep`.

## What comes later, and the limits

The MCP work (doc 16) adds Core steps at fixed places of the frame: a receipt check and write with the request key, so a
repeated call replays its stored result, and the job guard between the transaction and the inside stage. A refusal then
records a refusal receipt in a new short transaction after the rollback, and nested commands are never receipted on their
own.

These guarantees hold for code the suite's architecture tests scan (no dispatch around the bus, no explicit transaction
in a handler), not for hostile PHP. Commands run synchronously: a command that implements `ShouldQueue` is refused. The
dispatcher is kept in a private field of the base, so it is never part of a command's fingerprint, its receipt or its
public fields. A `CommandCall` built by hand is trusted code: its known gaps, such as a middleware passing on the same
command early or `authorizedOn` on a hand-built call, stay as they are. Doc 10's earlier "no command bus" decision is
replaced by this design.
