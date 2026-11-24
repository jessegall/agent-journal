<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

/**
 * What a domain did wrong, each case writing its own reason.
 */
enum ViolationType: string
{
    case UndeclaredDomain = 'undeclared-domain';
    case PrivateType = 'private-type';
    case PrivateTypeInSignature = 'private-type-in-signature';
    case DisallowedCategory = 'disallowed-category';
    case CompositionMisuse = 'composition-misuse';
    case BindingMisuse = 'binding-misuse';
    case PrivateEventListenedTo = 'private-event-listened-to';
    case OutsideEveryDomain = 'outside-every-domain';
    case TableOfNoDomain = 'table-of-no-domain';
    case OtherOwnersTable = 'other-owners-table';
    case ChangesOtherTable = 'changes-other-table';
    case TableNotWritten = 'table-not-written';
    case PivotNotWritten = 'pivot-not-written';
    case ModelTableElsewhere = 'model-table-elsewhere';
    case TableCreatedTwice = 'table-created-twice';
    case MigrationNameTwice = 'migration-name-twice';
    case RootMigrationChangesDomainTable = 'root-migration-changes-domain-table';
    case EventOutsideListener = 'event-outside-listener';
    case StringEventName = 'string-event-name';
    case ReRaisedEvent = 're-raised-event';
    case ReRaisedReceivedEvent = 're-raised-received-event';
    case MisnamedDomainClass = 'misnamed-domain-class';
    case FileOutsideDomains = 'file-outside-domains';
    case StarterKitUsesDomain = 'starter-kit-uses-domain';
    case NamespaceOutsideDomain = 'namespace-outside-domain';
    case SharedPlaceFile = 'shared-place-file';
    case FillableNotListed = 'fillable-not-listed';
    case OpenModel = 'open-model';
    case OpeningModelCall = 'opening-model-call';
    case KeyNotUlid = 'key-not-ulid';
    case ModelNotLinkable = 'model-not-linkable';
    case RawRowAccess = 'raw-row-access';
    case ListenerRegisteredByHand = 'listener-registered-by-hand';
    case ModelReadsUnbounded = 'model-reads-unbounded';

    public function reason(Violation $violation): string
    {
        return match ($this) {
            self::UndeclaredDomain => sprintf(
                'uses %s, but %s does not require %s',
                $violation->subject,
                $violation->usingDomain,
                $violation->owner,
            ),
            self::PrivateType => sprintf(
                "uses %s, which %s does not export; add it to %s's exports() if it is meant to be public, or use what %s exports",
                $violation->subject,
                $violation->owner,
                $violation->owner,
                $violation->owner,
            ),
            self::PrivateTypeInSignature => sprintf(
                'shows %s at %s, but it is private to %s; export it or keep it out of the public signature',
                $violation->subject,
                $violation->detail,
                $violation->owner,
            ),
            self::DisallowedCategory => sprintf(
                'exports %s, which is %s; an owner publishes only interfaces, enums, immutable values and its own exceptions',
                $violation->subject,
                $violation->detail,
            ),
            self::CompositionMisuse => sprintf(
                'names %s of %s, but a composition file names only what it composes: a descriptor, a provider, a middleware, the user model or a seeder',
                $violation->subject,
                $violation->owner,
            ),
            self::BindingMisuse => "binds {$violation->subject}, but {$violation->detail}",
            self::PrivateEventListenedTo => sprintf(
                'listens to %s, an event %s does not publish',
                $violation->subject,
                $violation->owner,
            ),
            self::OutsideEveryDomain => "uses {$violation->subject}, which is project code outside every domain",
            self::TableOfNoDomain => "uses table {$violation->subject}, which no domain owns",
            self::OtherOwnersTable => sprintf(
                'uses table %s of %s; only %s reads, joins, keys or changes its tables, so use what %s exports',
                $violation->subject,
                $violation->owner,
                $violation->owner,
                $violation->owner,
            ),
            self::ChangesOtherTable => "changes table {$violation->subject}, which {$violation->owner} owns",
            self::TableNotWritten => "names a table with {$violation->subject}; write the table name out",
            self::PivotNotWritten => "leaves the pivot table of {$violation->subject} to Laravel; write it out",
            self::ModelTableElsewhere => "has model table {$violation->subject}, which {$violation->owner} owns",
            self::TableCreatedTwice => "creates table {$violation->subject}, which {$violation->owner} also creates",
            self::MigrationNameTwice => "has the migration file name {$violation->subject}, "
                ."as does {$violation->owner}",
            self::RootMigrationChangesDomainTable => sprintf(
                'changes table %s of %s from database/migrations',
                $violation->subject,
                $violation->owner,
            ),
            self::StringEventName => "names the event {$violation->subject} by a string; name its event class instead",
            self::ReRaisedEvent => sprintf(
                'raises %s again, an event of %s; only its owner raises it',
                $violation->subject,
                $violation->owner,
            ),
            self::ReRaisedReceivedEvent => sprintf(
                'passes the event it received, %s, on to a raise; only the owner of an event raises it',
                $violation->subject,
            ),
            self::MisnamedDomainClass => sprintf(
                'declares %s, but a Domain class must be Domain\\<Name>\\<Name>Domain',
                $violation->subject,
            ),
            self::FileOutsideDomains => 'lies outside every domain; new behaviour lives in a domain, and the starter-kit list is for existing starter-kit code until it moves',
            self::StarterKitUsesDomain => sprintf(
                'is starter-kit code that uses %s of %s; starter-kit code may use no domain',
                $violation->subject,
                $violation->owner,
            ),
            self::NamespaceOutsideDomain => "declares namespace {$violation->subject}, outside {$violation->owner}",
            self::SharedPlaceFile => 'is not one of the fixed files of App\\Domains; the shared foundation holds only Domain, DomainEntry, DomainRegistry, DomainServiceProvider, the listener class reader and the named start-up exceptions',
            self::FillableNotListed => sprintf(
                'declares model %s; list every fillable attribute with #[Fillable([...])], and nothing else',
                $violation->subject,
            ),
            self::OpenModel => "declares model {$violation->subject}, "
                .'which is open to mass assignment; close its guard',
            self::OpeningModelCall => "calls {$violation->subject}, which opens a model to mass assignment",
            self::KeyNotUlid => "declares model {$violation->subject}, whose key is no ULID; use HasUlids",
            self::ModelReadsUnbounded => sprintf(
                'declares model %s, whose reads are not bounded; implement ReadableModel and use BoundedReads',
                $violation->subject,
            ),
            self::ListenerRegisteredByHand => sprintf(
                'registers a listener for %s by hand; write a concrete typed listener in a Listeners folder',
                $violation->subject,
            ),
            self::RawRowAccess => sprintf(
                "calls %s, which reaches rows past their model; use the model's scopes and methods (rule 25)",
                $violation->subject,
            ),
            self::ModelNotLinkable => sprintf(
                'declares model %s, which cannot be linked; use Linkable (rule 29)',
                $violation->subject,
            ),
            self::EventOutsideListener => sprintf(
                'names %s, an event of %s; only a listener of %s may name it, as an import, a type or ::class',
                $violation->subject,
                $violation->owner,
                $violation->usingDomain,
            ),
        };
    }
}
