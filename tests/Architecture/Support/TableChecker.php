<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use Tests\Support\ScanCache\ScanCache;

/**
 * Judges table use: each table belongs to the domain or Core whose migrations create it, and only that owner reads,
 * joins, keys or changes it; another owner asks it through what it exports.
 */
final readonly class TableChecker
{
    private const string ROOT_MIGRATIONS = 'database/migrations';

    /**
     * @param  list<TableOwner>  $entries
     * @param  array<string, TableUse>  $creations  the creating migration of each owned table
     * @param  array<string, TableOwner>  $owners
     */
    private function __construct(
        private array $entries,
        private string $rootMigrationFolder,
        private array $creations,
        private array $owners,
    ) {}

    /**
     * @param  list<TableOwner>  $entries
     */
    public static function for(array $entries, string $rootMigrationFolder): self
    {
        $creations = [];
        $owners = [];

        foreach ($entries as $entry) {
            foreach (self::creationsIn($entry->migrationFolders) as $creation) {
                $creations[$creation->table] ??= $creation;
                $owners[$creation->table] ??= $entry;
            }
        }

        return new self($entries, $rootMigrationFolder, $creations, $owners);
    }

    /**
     * @param  list<TableUse>  $uses
     * @return list<Violation>
     */
    public function violations(array $uses): array
    {
        $violations = [];

        foreach ($uses as $use) {
            $violation = $this->violationOf($use);

            if ($violation !== null) {
                $violations[] = $violation;
            }
        }

        return $violations;
    }

    /**
     * Tables created twice, migration file names used twice, and root migrations changing domain tables.
     *
     * @return list<Violation>
     */
    public function migrationViolations(): array
    {
        return [...$this->tablesCreatedTwice(), ...$this->migrationNamesTwice(), ...$this->rootMigrationChanges()];
    }

    private function violationOf(TableUse $use): Violation|null
    {
        $user = $this->ownerHolding($use->file);
        $owner = $this->owners[$use->table] ?? null;

        $type = match (true) {
            $use->type === TableType::Create => null,
            $use->type === TableType::NotWritten => ViolationType::TableNotWritten,
            $use->type === TableType::PivotNotWritten => ViolationType::PivotNotWritten,
            $owner === null => ViolationType::TableOfNoDomain,
            $owner === $user => null,
            $use->type === TableType::ModelTable => ViolationType::ModelTableElsewhere,
            $use->type === TableType::Change => ViolationType::ChangesOtherTable,
            default => ViolationType::OtherOwnersTable,
        };

        if ($type === null) {
            return null;
        }

        return new Violation($use->file, $use->line, $use->table, $user->name, $owner->name ?? 'no domain', $type);
    }

    /**
     * @return list<Violation>
     */
    private function tablesCreatedTwice(): array
    {
        $violations = [];

        foreach ($this->entries as $entry) {
            foreach (self::creationsIn($entry->migrationFolders) as $creation) {
                $first = $this->creations[$creation->table];

                if ($first->file !== $creation->file) {
                    $violations[] = new Violation(
                        $creation->file,
                        $creation->line,
                        $creation->table,
                        $entry->name,
                        $first->file,
                        ViolationType::TableCreatedTwice,
                    );
                }
            }
        }

        return $violations;
    }

    /**
     * @return list<Violation>
     */
    private function migrationNamesTwice(): array
    {
        $folders = [
            $this->rootMigrationFolder,
            ...array_merge(...array_map(fn (TableOwner $entry) => $entry->migrationFolders, $this->entries)),
        ];
        $seen = [];
        $violations = [];

        foreach (DomainFiles::in($folders) as $file) {
            $name = basename($file);

            if (isset($seen[$name])) {
                $violations[] = new Violation(
                    $file,
                    1,
                    $name,
                    $this->ownerNameOf($file),
                    $seen[$name],
                    ViolationType::MigrationNameTwice,
                );

                continue;
            }

            $seen[$name] = $file;
        }

        return $violations;
    }

    /**
     * @return list<Violation>
     */
    private function rootMigrationChanges(): array
    {
        $violations = [];

        foreach (ScanCache::findings(new TableScan(), DomainFiles::in([$this->rootMigrationFolder])) as $use) {
            $owner = $this->owners[$use->table] ?? null;

            if ($owner !== null && $use->type === TableType::Change) {
                $violations[] = new Violation(
                    $use->file,
                    $use->line,
                    $use->table,
                    self::ROOT_MIGRATIONS,
                    $owner->name,
                    ViolationType::RootMigrationChangesDomainTable,
                );
            }
        }

        return $violations;
    }

    /**
     * @param  list<string>  $folders
     * @return list<TableUse>
     */
    private static function creationsIn(array $folders): array
    {
        $creations = [];

        foreach (ScanCache::findings(new TableScan(), DomainFiles::in($folders)) as $use) {
            if ($use->type === TableType::Create) {
                $creations[] = $use;
            }
        }

        return $creations;
    }

    private function ownerHolding(string $path): TableOwner
    {
        return array_find($this->entries, fn (TableOwner $entry) => $entry->holdsFile($path))
            ?? throw FileOutsideEveryDomain::for($path);
    }

    private function ownerNameOf(string $path): string
    {
        return array_find(
            $this->entries,
            fn (TableOwner $entry) => $entry->holdsFile($path),
        )->name ?? self::ROOT_MIGRATIONS;
    }
}
