<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Support\DomainEntry;

/**
 * A domain or Core as the owner of the tables its migrations create: only its own files use them.
 */
final readonly class TableOwner
{
    /**
     * @param  list<string>  $migrationFolders
     */
    private function __construct(
        public string $name,
        private string $folder,
        public array $migrationFolders,
    ) {}

    public static function fromDomain(DomainEntry $entry): self
    {
        return new self($entry->name, $entry->folder, [$entry->migrationFolder()]);
    }

    /**
     * Core, with its migrations in database/migrations beside app.
     */
    public static function core(string $coreFolder): self
    {
        return new self('Core', $coreFolder, [dirname($coreFolder).'/database/migrations']);
    }

    /**
     * Whether the file is in the owner's code or in one of its migration folders, such as Core's database/migrations.
     */
    public function holdsFile(string $path): bool
    {
        return array_any(
            [$this->folder, ...$this->migrationFolders],
            fn (string $folder) => str_starts_with($path, $folder.DIRECTORY_SEPARATOR),
        );
    }
}
