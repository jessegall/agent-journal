# Authorizing a module's commands and reads

Every command and every read of owned records asks one question: may this actor do this thing? The answer comes from
the actor's own profile (an agent) or owner authority (a person), through the policy the module registers. No code asks
what kind of actor calls, its role or its profile type (rule 39); `tests/Architecture/ActorCategoryRuleTest.php` fails
on any such branch.

The worked example is the Notes test module in `tests/Fixtures/Modules/Notes/src`.

## 1. An ability enum

An ability is a case of a backed enum, named for what it lets an actor do. A class-level ability is decided on the
model class alone, before any record is loaded (create, list, ordinary work); the enum says which through
`App\Bus\Contracts\DeclaresClassLevelAbilities`:

```php
enum NoteWorkAbility: string implements DeclaresClassLevelAbilities
{
    case Work = 'work';

    public function isClassLevel(): bool
    {
        return true;
    }
}
```

An instance ability (edit this note, read this note) is not class-level and needs the record as its subject.

## 2. A policy

A policy implements `App\Actors\Contracts\Policy`. For class-level abilities it answers through
`authorize(Actor $actor, object|string $subject, BackedEnum $ability)` and throws to refuse; an empty body leaves the
decision to the profile's grants, as `NoteWorkPolicy` does. For instance abilities it names one method per ability that
takes the record, as `NotePolicy::edit(Actor $actor, Note $note)` does.

## 3. Registering it

The module's Domain class implements `App\Actors\Contracts\ProvidesPolicies` and lists one registration per model:

```php
public function policies(): array
{
    return [
        new PolicyRegistration(Note::class, NotePolicy::class, NoteAbility::class),
        new PolicyRegistration(NotePage::class, NoteWorkPolicy::class, NoteWorkAbility::class),
    ];
}
```

One model has one policy. A registration may name abilities only the owner holds (`ownerOnly`) and abilities only a
coordinating profile holds (`coordinatorOnly`); the built-in agent profiles are granted every other ability of every
registered policy. A profile grants an ability as the pair of the policy class and the ability case, so a grant never
depends on a profile's name.

## 4. Declaring it on a command

```php
#[HandledBy(WriteNoteHandler::class)]
#[Authorize(NoteWorkPolicy::class, NoteWorkAbility::Work)]
final readonly class WriteNote implements Command, HasAuthorizationSubject
{
    public function __construct(public string $text) {}

    public function subject(): string
    {
        return NotePage::class;
    }
}
```

For an instance ability `subject()` returns the record, and the handler may take it as its second argument:
`Domain\Tasks\Commands\BlockTask` and `Domain\Tasks\Handlers\BlockTaskHandler` show it. A command with no `Authorize`
fails the boot (`App\Bus\Exceptions\CommandAuthorizationMissing`) unless it names a trusted entry; see
docs/commands/command-bus.md.

## 5. Reading owned records

A read of owned rows goes through `App\Actors\Contracts\ActorVisibility`: `ownRead`, `readAcrossOwners` and `ownRows`
narrow the query to what the acting actor may see, per the visibility provider of its kind of actor. A reader never
loads rows first and filters them afterwards, so a page stays bounded.

## 6. Showing what an actor may do

A page or a reply that offers actions asks `App\Actors\Contracts\CurrentAuthorizer::filterActions($policy, $subject,
$abilities)` for the abilities the caller holds, and shows only those. The same call answers a question such as "does
this caller see every agent's sessions?" (`AgentAbility::Inspect`). To act for another actor, such as the agent a
message asks to answer, ask `App\Actors\Contracts\TargetAuthorizer`, which reads that actor's own profile; the caller's
rights never count.

## 7. Refusals

A refused ability throws `App\Actors\Exceptions\ActorNotAllowed`, which names the ability and the kind of subject and
nothing else, so a refusal never tells a caller what a record holds. An ability no available policy grants, because its
domain is switched off or it was never registered, throws `App\Actors\Exceptions\AbilityNotRegistered`; a switched-off
domain's commands are refused before they run (`App\Bus\Exceptions\DomainDisabled`), see docs/domains/switches.md.
