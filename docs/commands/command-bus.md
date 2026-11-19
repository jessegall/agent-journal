# The command bus

Every public write in journal version 6 is a command on Core's command bus (doc 19, built in `app/Bus`). A domain or a
module adds a command, a handler for it, and, if it wants, middleware that watches or changes commands. This page is
everything a module developer needs for that.

## A command and its handler

A command is a final readonly value in the owner's `Commands` folder. It names its handler with `#[HandledBy]`, and its
docblock says what it answers. A handler sits in `Handlers`, has one public `handle` method that takes the command, and
holds no transaction code: the bus opens the transaction.

```php
namespace Domain\Tasks\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Tasks\Handlers\FinishTaskHandler;

/**
 * @implements Command<null>
 */
#[HandledBy(FinishTaskHandler::class)]
final readonly class FinishTask implements Command
{
    public function __construct(public int $taskId) {}
}
```

```php
namespace Domain\Tasks\Handlers;

use Domain\Tasks\Api\Events\TaskFinished;
use Domain\Tasks\Commands\FinishTask;
use Domain\Tasks\Models\Task;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class FinishTaskHandler
{
    public function __construct(private Dispatcher $events) {}

    public function handle(FinishTask $command): void
    {
        Task::lockedById($command->taskId)->finish();
        $this->events->dispatch(new TaskFinished($command->taskId));
    }
}
```

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

## Input limits

A command declares what input it takes on its constructor properties, with Spatie's validation attributes
(`Spatie\LaravelData\Attributes\Validation\Max`, `Min`, `Between`, `Required`, `Filled`, `Regex`, `In`,
`RequiredWithout` and the rest) and Core's `App\Bus\Attributes\OneLine`, which refuses a line break between two words
of a title or an abstract. A limit several commands share is a constant on the model it describes, and the attribute
names it:

```php
use App\Bus\Attributes\OneLine;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;

public function __construct(
    #[Required, OneLine, Max(Document::TITLE_CHARACTERS)] public string $title,
    #[Max(Document::ABSTRACT_CHARACTERS)] public string|null $abstract = null,
) {}
```

- The registry reads the attributes once at start-up (`App\Bus\Support\PropertyRules`) and puts the rule for the
  property's type first: `string`, `integer`, `numeric`, `boolean` or `array`, so `Max` counts characters, the number
  or the items as the type says.
- `App\Bus\CommandMiddleware\ValidateCommand` checks each call: it gives the validator only the ruled properties and
  leaves out a property whose value is null, as a field that was not sent; `RequiredWithout` sees it as missing. A
  command that declares no limit passes without a validator.
- It runs after the actor check and before stack admission: a caller of the wrong actor type is refused for that first,
  and bad input takes no stack turn, opens no transaction and leaves no refusal receipt, so the same request key can be
  sent again with the input corrected. It runs before the check that the command's domain is switched on, so bad input
  to a disabled domain is refused for its input.
- A command a module middleware replaces with a changed copy through `replacedBy` is trusted and not checked again.
- An enum or a value class checks itself: its cases or its factory are the limit, never an attribute on the property.

The limits in use today:

| Attribute | Commands and properties | Constant |
|---|---|---|
| `Required` | `CreateAgent` name; `SendMessage`, `AskMessage`, `ReplyToMessage` body; `SaveMemory` text; `CreateDocument`, `CreateReport`, `ChangeDocumentDetails` title and abstract; `SettleDocument`, `SettleReport`, `RecoverDocument` reason | none |
| `OneLine` | `CreateDocument`, `CreateReport`, `ChangeDocumentDetails` title and abstract | none |
| `Max` | `CreateTask` title, `EditTask` title | `Task::TITLE_CHARACTERS` |
| `Max` | `CreateTask` brief, `EditTask` brief, `FinishTask` note, `BlockTask` reason, `CancelTask` reason | `Task::NOTE_CHARACTERS` |
| `Max` | `CreateDocument`, `CreateReport`, `ChangeDocumentDetails` title | `Document::TITLE_CHARACTERS` |
| `Max` | `CreateDocument`, `CreateReport`, `ChangeDocumentDetails` abstract | `Document::ABSTRACT_CHARACTERS` |
| `Max` | `SettleDocument`, `SettleReport`, `RecoverDocument` reason | `Document::SETTLEMENT_REASON_CHARACTERS` |
| `Max` | `CreateDocument`, `CreateReport` about | their own `MOST_LINKS` |
| `RequiredWithout('brief')` | `EditTask` title | none |
| `RequiredWithout('weight')`, `Filled` | `EditMemory` text | none |
| `Between` | `SaveMemory`, `EditMemory` weight | `Memory::LIGHTEST`, `Memory::HEAVIEST` |

Bad input is refused with `App\Bus\Exceptions\CommandInputInvalid`, code `invalid_input`, not retryable. Its message
reads `The input was refused.` and then one line per wrong field with its first problem, never the value sent. The
CLI prints it after `The journal refused the call (invalid_input):`, MCP and agent routes answer it with its code and
a 422, a JSON route answers 422 with Laravel's `errors` per field, and a web page goes back with each field's error and
the old input.

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
- Order: Core's frame first (logging, the actor check, the input check, stack admission), then the before-transaction
  stage, the
  transaction, the inside stage and the handler. Within a stage, owners run in the order of `bootstrap/domains.php`, and
  each owner's middleware in its declaration order.

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
| `App\Bus\Exceptions\CommandDeclarationInvalid` | Make the command final readonly in `Commands`, with fields and a result the grammar above allows. |
| `App\Bus\Exceptions\CommandHandlerMissing` | Add `#[HandledBy]` naming a handler in the owner's `Handlers` folder. |
| `App\Bus\Exceptions\CommandHandlerTwice` | Name one handler. |
| `App\Bus\Exceptions\HandlerServesTwoCommands` | Give each command its own handler. |
| `App\Bus\Exceptions\HandlerInOtherOwner` | Keep the handler with its command's owner. |
| `App\Bus\Exceptions\CommandListedTwice` | List each command once. |
| `App\Bus\Exceptions\MiddlewareDeclarationInvalid` | Name only commands the module may see, in a `CommandMiddleware` folder. |
| `App\Bus\Exceptions\MiddlewareListedTwice` | Declare each middleware once per scope and stage. |

`App\Bus\Exceptions\CommandDeclarationInvalid` also refuses an input limit that could never work:

| The limit | Fix |
|---|---|
| An attribute on an enum property | Take it off: the enum's cases already limit the value. |
| An attribute on a value-class property | Take it off: the value checks itself in its factory. |
| `Exists`, `Unique`, `CurrentPassword`, `Confirmed`, `ActiveUrl`, `File`, `Image`, `Mimes`, `MimeTypes` or `Dimensions` | Look the value up in the handler, inside the transaction: a command's rules check its input alone. |
| A rule naming a field the command does not have, such as `RequiredWithout('breif')` | Name one of the command's properties. |
| An attribute on a property of a value class the command carries | Check it in that value's factory: the attribute is never read. |
| An attribute Spatie cannot turn into a rule | Give it arguments of the types the attribute takes. |

A command nobody registered is refused at dispatch with `App\Bus\Exceptions\CommandNotRegistered`, and a ninth nested
command with `App\Bus\Exceptions\CommandNestingTooDeep`.

## What comes later, and the limits

The MCP work (doc 16) adds Core steps at fixed places of the frame: a receipt check and write with the request key, so a
repeated call replays its stored result, and the job guard between the transaction and the inside stage. A refusal then
records a refusal receipt in a new short transaction after the rollback, and nested commands are never receipted on their
own.

These guarantees hold for code the suite's architecture tests scan (no dispatch around the bus, no explicit transaction
in a handler), not for hostile PHP. Queued commands are refused for now. Doc 10's earlier "no command bus" decision is
replaced by this design.
