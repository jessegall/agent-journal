# The command bus

Every public write in journal version 6 is a command on Core's command bus (doc 19, built in `app/Bus`). A domain or a
module adds a command, a handler for it, and, if it wants, middleware that watches or changes commands. This page is
everything a module developer needs for that.

## A command and its handler

A command is a final readonly value in the owner's `Commands` folder that extends `App\Bus\Support\Command` and
declares only its business fields in its constructor, and its docblock says what it answers. Its handler is found by
its name: `Domain\Rules\Commands\ProposeRule\ProposeRuleCommand` is handled by `Domain\Rules\Commands\ProposeRule\ProposeRuleHandler`, so the command
names no handler and the two folders import one way. A handler has one public `handle` method that takes the command,
and holds no transaction code: the bus opens the transaction.

The handler reads who dispatched the command with `$command->dispatchedBy()`: an `App\Actors\Support\ActorContext`,
the actor's type and id and nothing more, no authority. The bus binds it on every call. A command the caller has just
built is unbound, and reading `dispatchedBy()` on it raises `App\Bus\Exceptions\CommandDispatcherMissing`.

A command and its one handler share a folder of their own under the owner's `Commands` folder:
`domain/Rules/src/Commands/ProposeRule/ProposeRuleCommand.php` beside `ProposeRuleHandler.php`, with an optional
`Support` folder inside for code only that pair uses. The bus finds the handler by the command's name, `Command`
replaced by `Handler`, in the same folder.

```php
namespace Domain\Rules\Commands\ProposeRule;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Rules\Policies\RulePolicy;

/**
 * Proposes a rule with its text; it holds only once the user approves it.
 *
 * @extends Command<string>
 */
#[Authorize(RulePolicy::class, AccessType::Create)]
final readonly class ProposeRuleCommand extends Command
{
    public function __construct(
        public string $text,
        public string $reason,
        public string|null $replacesRuleId = null,
    ) {}
}
```

```php
namespace Domain\Rules\Commands\ProposeRule;

use App\Contracts\CommandHandler;
use Domain\Rules\Exceptions\RuleMissing;
use Domain\Rules\Models\Rule;

final readonly class ProposeRuleHandler implements CommandHandler
{
    /**
     * @throws RuleMissing when the rule it would replace does not exist
     */
    public function handle(ProposeRuleCommand $command): string
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
`withDispatcher($command->dispatchedBy())`, as `App\Agents\Commands\OpenHostMainRuntime\OpenHostMainRuntimeHandler`,
`App\Agents\Support\DriverHeartbeatSource` and `App\Profiles\Commands\InstallBuiltInProfiles\InstallBuiltInProfilesHandler` do. Every other
command goes through the bus.

A command carries whole numbers, text, yes or no, decimals, backed enums, their nullable forms, final readonly values the
owner may name, and lists of those, never a model, a service or a stack target (a session is an int id the handler
resolves). A handler returns nothing, one of those, or a final readonly value such as `App\Assignments\Support\AssignmentResult`.

Every command a person or an agent sends declares who may run it with one `#[Authorize(Policy::class,
AccessType::Case)]`: the policy names the model it guards, so the declaration needs no subject. A command whose policy
decides on one record implements `App\Bus\Contracts\RecordCommand` and returns that locked record from `subject()`,
as `Domain\Tasks\Commands\BlockTask\BlockTaskCommand` does for `Domain\Tasks\Policies\TaskRunPolicy`; its handler takes the record as
its second argument, as `Domain\Tasks\Commands\BlockTask\BlockTaskHandler::handle(BlockTask $command, Task $task)` does, so it
loads it once. The bus checks the caller's profile grants before the subject is loaded and refuses with
`App\Bus\Exceptions\CommandAdmissionRefused`, then authorizes the subject and refuses with
`App\Actors\Exceptions\ActorNotAllowed`. A command with neither `Authorize` nor a trusted entry fails the boot with
`App\Bus\Exceptions\CommandDeclarationInvalid`; a trusted entry is `#[Entry(CommandEntry::HostControl)]`,
`ShareGateway`, `SkillPublisher` or `EngineMaintenance`. Such a command runs only through that entry's dispatcher, as
the journal itself, and never from a request. No command asks what kind of actor calls (rule 39); the guide in
docs/domains/authorization.md shows how a module declares its policies.

One attribute changes how a command runs:

- `#[RepeatableRead]` runs it in a repeatable-read transaction, as `App\Assignments\Commands\AssignRecord\AssignRecordCommand` does.

The owner lists its commands on its Domain class through `App\Bus\Contracts\CommandProvider`, and exports the ones other
owners may run. Callers take `App\Bus\Contracts\CommandBus` as a method parameter and call `run`:

```php
use App\Bus\Contracts\CommandBus;
use Domain\Tasks\Commands\FinishTask\FinishTaskCommand;

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
- It runs after the actor check and the binding of the dispatcher, and before stack admission: a caller of the
  wrong actor type is refused for that first, and bad input takes no stack turn, opens no transaction and leaves no
  refusal receipt, so the same request key can be sent again with the input corrected. It runs before the check that the command's domain is switched on, so bad input
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
through `App\Bus\Contracts\CommandMiddlewareProvider`:

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
- Order: Core's frame first (logging, the entry check, binding the dispatcher, the input check, stack admission), then
  the before-transaction stage, the transaction, the inside stage and the handler. Within a stage, owners run in the
  order of `bootstrap/domains.php`, and each owner's middleware in its declaration order.

`App\Bus\CommandMiddleware\BindDispatcher` runs right after `App\Bus\CommandMiddleware\CheckEntry`, before
`App\Bus\CommandMiddleware\ValidateCommand`. It reads the request's actor from `App\Actors\Contracts\CurrentActor`
and passes on `$call->withDispatcher($actor)`, a call whose command is a copy bound to that actor; the caller's own
object stays unbound. A call without an actor is refused there with `App\Actors\Exceptions\ActorContextMissing`, before
the input check and stack admission. `replacedBy($command)` keeps its one argument and binds the replacement to the
call's actor, so module middleware never binds a command itself.

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

## Facts: raised, required, held and released

A model raises the fact of its change after its own save, and the command's code stages a fact with no row through
`CommandFacts::publishAfterCommit`; both join the event unit of the command's transaction in save order. Before the
transaction commits, the unit runs each fact's required listeners (those marked `#[InCommandTransaction]`) in order,
and a fact one of them raises joins the end of the queue. `CommandFacts::applyRequired` runs them earlier, where the
command reads what they wrote, and `CommandFacts::holdUntilReturn` keeps an operation's facts back until it returns, so
they follow the work it does on the way. After the real commit, once no command of the request still runs, the facts
go to their public listeners through Laravel's dispatcher; a rollback releases nothing. Outside a unit, a staged fact's
required listeners run at once before it goes out. `.ai/guidelines/models-raise-their-events.md` is the guideline.

## Errors at start-up

The registry checks every declaration when the application starts:

| Error | Fix |
|---|---|
| `App\Bus\Exceptions\CommandDeclarationInvalid` | Make the command final readonly in `Commands`, extending `App\Bus\Support\Command`, with fields and a result the grammar above allows. |
| `App\Bus\Exceptions\CommandHandlerMissing` | Write the handler the message names: the command's name with `Command` replaced by `Handler`, beside the command in its folder. |
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
in a handler), not for hostile PHP. Commands run synchronously: a command that implements `ShouldQueue` is refused. The
dispatcher is kept in a private field of the base, so it is never part of a command's fingerprint, its receipt or its
public fields. A `CommandCall` built by hand is trusted code: its known gaps, such as a middleware passing on the same
command early or `authorizedOn` on a hand-built call, stay as they are. Doc 10's earlier "no command bus" decision is
replaced by this design.
