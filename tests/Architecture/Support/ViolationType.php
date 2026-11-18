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
    case PrivateCoreType = 'private-core-type';
    case PrivateTypeInSignature = 'private-type-in-signature';
    case DisallowedCategory = 'disallowed-category';
    case CompositionMisuse = 'composition-misuse';
    case BindingMisuse = 'binding-misuse';
    case PrivateEventHeard = 'private-event-heard';
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

    public function reason(Violation $violation): string
    {
        return match ($this) {
            self::UndeclaredDomain => "uses {$violation->used}, but {$violation->usingDomain} does not require {$violation->owner}",
            self::PrivateType => "uses {$violation->used}, which {$violation->owner} does not export; add it to {$violation->owner}'s exports() if it is meant to be public, or use what {$violation->owner} exports",
            self::PrivateCoreType => "uses {$violation->used}, which is private to Core; list it in CoreApi if it is meant to be public, or use what CoreApi lists",
            self::PrivateTypeInSignature => "shows {$violation->used} at {$violation->detail}, but it is private to {$violation->owner}; export it or keep it out of the public signature",
            self::DisallowedCategory => "exports {$violation->used}, which is {$violation->detail}; an owner publishes only interfaces, enums, immutable values and its own exceptions",
            self::CompositionMisuse => "names {$violation->used} of {$violation->owner}, but a composition file names only what it composes: a descriptor, a provider, a middleware, the user model or a seeder",
            self::BindingMisuse => "binds {$violation->used}, but {$violation->detail}",
            self::PrivateEventHeard => "hears {$violation->used}, an event {$violation->owner} does not publish",
            self::OutsideEveryDomain => "uses {$violation->used}, which is project code outside every domain",
            self::TableOfNoDomain => "uses table {$violation->used}, which no domain owns",
            self::OtherOwnersTable => "uses table {$violation->used} of {$violation->owner}; only {$violation->owner} reads, joins, keys or changes its tables, so use what {$violation->owner} exports",
            self::ChangesOtherTable => "changes table {$violation->used}, which {$violation->owner} owns",
            self::TableNotWritten => "names a table with {$violation->used}; write the table name out",
            self::PivotNotWritten => "leaves the pivot table of {$violation->used} to Laravel; write it out",
            self::ModelTableElsewhere => "has model table {$violation->used}, which {$violation->owner} owns",
            self::TableCreatedTwice => "creates table {$violation->used}, which {$violation->owner} also creates",
            self::MigrationNameTwice => "has the migration file name {$violation->used}, as does {$violation->owner}",
            self::RootMigrationChangesDomainTable => "changes table {$violation->used} of {$violation->owner} from database/migrations",
            self::StringEventName => "names the event {$violation->used} by a string; name its event class instead",
            self::ReRaisedEvent => "raises {$violation->used} again, an event of {$violation->owner}; only its owner raises it",
            self::ReRaisedReceivedEvent => "passes the event it received, {$violation->used}, on to a raise; only the owner of an event raises it",
            self::MisnamedDomainClass => "declares {$violation->used}, but a Domain class must be Domain\\<Name>\\<Name>Domain",
            self::FileOutsideDomains => 'lies outside every domain; new behaviour lives in a domain, and the starter-kit list is for existing starter-kit code until it moves',
            self::StarterKitUsesDomain => "is starter-kit code that uses {$violation->used} of {$violation->owner}; starter-kit code may use no domain",
            self::NamespaceOutsideDomain => "declares namespace {$violation->used}, outside {$violation->owner}",
            self::SharedPlaceFile => 'is not one of the fixed files of App\\Domains; the shared foundation holds only Domain, DomainEntry, DomainRegistry, DomainServiceProvider, the listener class reader and the named start-up exceptions',
            self::FillableNotListed => "declares model {$violation->used}; list every fillable attribute with #[Fillable([...])], and nothing else",
            self::OpenModel => "declares model {$violation->used}, which is open to mass assignment; close its guard",
            self::OpeningModelCall => "calls {$violation->used}, which opens a model to mass assignment",
            self::EventOutsideListener => "names {$violation->used}, an event of {$violation->owner}; only a listener of {$violation->usingDomain} may name it, as an import, a type or ::class",
        };
    }
}
