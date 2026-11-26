# Authorizing a module's commands and reads

Every command and every read of owned records asks one question: may this actor have this access on what this policy
guards? The answer comes from the actor's own profile (an agent) or owner authority (a user). No code asks what kind
of actor calls, its role or its profile type (rule 39); `tests/Architecture/ActorCategoryRuleTest.php` fails on any
such branch.

The worked example is the Notes test module in `tests/Fixtures/Modules/Notes/src`.

## 1. A policy names its model

A policy implements `App\Access\Contracts\Policy` and says which model it guards. Most policies decide by the grant
alone and hold nothing else:

```php
final readonly class NoteWorkPolicy implements Policy
{
    public static function model(): string
    {
        return NotePage::class;
    }
}
```

A policy that decides on one record implements `App\Access\Contracts\RecordPolicy` and has a public
`permits(Actor $actor, <its model> $record, AccessType $access): Response`, which Laravel's Gate calls once the grant
is held. `Domain\Tasks\Policies\TaskRunPolicy` is the one in the journal: only the run's holder finishes, blocks or
cancels it. The model points Laravel at it with `#[UsePolicy(TaskRunPolicy::class)]`; a model has one record policy.

## 2. Registering the policy

The module lists its policies in its domain class's `policies()`, each with the accesses it accepts and the ones the
journal's built-in agent profiles never get, get only when they coordinate, or never get as a read-only helper:

```php
public function policies(): array
{
    return [
        new PolicyDefinition(NotePolicy::class, [AccessType::Read, AccessType::Create, AccessType::Edit]),
        new PolicyDefinition(
            NoteWorkPolicy::class,
            [AccessType::Create, AccessType::Edit],
            ownerOnly: [AccessType::Edit],
        ),
    ];
}
```

One owner guards a model; several grant-only policies of that owner may share it. A built-in profile holds a pair when
the registration accepts the access, its restrictions allow it for the profile's base, and the base's own access list
(`App\Values\ProfileBase`) includes it.

## 3. Declaring a command

A command declares one pair:

```php
#[Authorize(NoteWorkPolicy::class, AccessType::Create)]
final readonly class WriteNote extends Command
{
    public function __construct(public string $text) {}
}
```

A command whose policy is a record policy implements `App\Bus\Contracts\RecordCommand`, returns the locked record from
`subject()`, and its handler takes the record as its second argument: `Domain\Tasks\Commands\BlockTask\BlockTaskCommand` and
`Domain\Tasks\Commands\BlockTask\BlockTaskHandler` show it. A command with neither `Authorize` nor a trusted entry fails the boot;
see docs/commands/command-bus.md.

## 4. Declaring a read

A read declares its entitlement once, by name, through `App\Access\Contracts\ReadEntitlements` in the module's provider:
`ReadEntitlement::grant(TaskPolicy::class)` for a model read, `ReadEntitlement::named()` for a read the profile must hold
by name (the orientation reads, a draft of one document). The tool and the MCP resource of one read check the same
declaration.

## 5. Reading owned records

A read of owned rows goes through `App\Actors\Contracts\ActorVisibility`: `ownRead`, `readAcrossOwners` and `ownRows`
narrow the query to what the acting actor may see, per the visibility provider of its kind of actor. A reader never
loads rows first and filters them afterwards, so a page stays bounded.

## 6. Showing what an actor may do

A page or a reply that offers actions asks `App\Access\Contracts\CurrentAuthorizer::filterActions($policy, $subject,
$accesses)` for the accesses the caller holds, and shows only those. The same call answers a question such as "does
this caller see every agent's sessions?" (`AgentMaintenancePolicy` with `AccessType::Read`). To act for another actor,
such as the agent a message asks to answer, ask `App\Access\Contracts\TargetAuthorizer`, which reads that actor's own
profile; the caller's rights never count.

## 7. Refusals

A command the caller's profile does not grant is refused before its subject loads with
`App\Bus\Exceptions\CommandAdmissionRefused`; a refused record decision throws `App\Exceptions\ActorNotAllowed`,
which names the access and the kind of subject and nothing else. A pair no available policy accepts, because its domain
is switched off or it was never registered, throws `App\Exceptions\GrantNotRegistered`; a switched-off domain's
commands are refused before they run (`App\Bus\Exceptions\DomainDisabled`), see docs/domains/switches.md.
