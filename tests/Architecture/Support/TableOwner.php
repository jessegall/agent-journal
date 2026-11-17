<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Domain\DomainEntry;

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
     * Core, with the migrations of each of its areas, such as app/Core/Hooks/Database/Migrations.
     */
    public static function core(string $coreFolder): self
    {
        return new self('Core', $coreFolder, glob("{$coreFolder}/*/Database/Migrations", GLOB_ONLYDIR) ?: []);
    }

    public function holdsFile(string $path): bool
    {
        return str_starts_with($path, $this->folder.DIRECTORY_SEPARATOR);
    }
}
