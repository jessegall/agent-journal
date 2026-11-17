<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

/**
 * What a domain did wrong, each case writing its own reason.
 */
enum ViolationKind: string
{
    case UndeclaredDomain = 'undeclared-domain';
    case OutsideEveryDomain = 'outside-every-domain';
    case TableOfNoDomain = 'table-of-no-domain';
    case UndeclaredTable = 'undeclared-table';
    case ChangesOtherTable = 'changes-other-table';
    case TableNotWritten = 'table-not-written';
    case PivotNotWritten = 'pivot-not-written';
    case LinksTable = 'links-table';
    case ModelTableElsewhere = 'model-table-elsewhere';
    case TableCreatedTwice = 'table-created-twice';
    case MigrationNameTwice = 'migration-name-twice';
    case RootMigrationChangesDomainTable = 'root-migration-changes-domain-table';

    public function reason(Violation $violation): string
    {
        return match ($this) {
            self::UndeclaredDomain => "uses {$violation->used}, but {$violation->usingDomain} does not require {$violation->owner}",
            self::OutsideEveryDomain => "uses {$violation->used}, which is project code outside every domain",
            self::TableOfNoDomain => "uses table {$violation->used}, which no domain owns",
            self::UndeclaredTable => "uses table {$violation->used} of {$violation->owner}, but {$violation->usingDomain} does not require {$violation->owner}",
            self::ChangesOtherTable => "changes table {$violation->used}, which {$violation->owner} owns",
            self::TableNotWritten => "names a table with {$violation->used}; write the table name out",
            self::PivotNotWritten => "leaves the pivot table of {$violation->used} to Laravel; write it out",
            self::LinksTable => 'uses table links, which only Links may use',
            self::ModelTableElsewhere => "has model table {$violation->used}, which {$violation->owner} owns",
            self::TableCreatedTwice => "creates table {$violation->used}, which {$violation->owner} also creates",
            self::MigrationNameTwice => "has the migration file name {$violation->used}, as does {$violation->owner}",
            self::RootMigrationChangesDomainTable => "changes table {$violation->used} of {$violation->owner} from database/migrations",
        };
    }
}
