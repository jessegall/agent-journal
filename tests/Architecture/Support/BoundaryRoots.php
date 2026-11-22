<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Domains\Support\DomainEntry;

/**
 * The folders outside the code roots that the boundary check also owns (doc 107, Foundation permissions and discovery
 * roots): routes, seeders and migrations belong to Core at the repository root and to the package beside its src.
 */
final readonly class BoundaryRoots
{
    private const array CORE_FOLDERS = ['routes', 'database/seeders', 'database/migrations'];

    private const array PACKAGE_FOLDERS = ['routes', 'database/seeders'];

    /**
     * @param  list<DomainEntry>  $entries
     */
    public function __construct(private array $entries, private string $basePath) {}

    /**
     * Every extra folder to scan, Core's first; a folder that does not exist yet is left out.
     *
     * @return list<string>
     */
    public function folders(): array
    {
        $folders = array_map(fn (string $folder) => "{$this->basePath}/{$folder}", self::CORE_FOLDERS);

        foreach ($this->entries as $entry) {
            foreach (self::PACKAGE_FOLDERS as $folder) {
                $folders[] = dirname($entry->folder)."/{$folder}";
            }
        }

        return array_values(array_filter($folders, is_dir(...)));
    }

    /**
     * The package whose route or seeder folder holds the file, matched by whole folder names; null for Core's.
     */
    public function packageHolding(string $path): DomainEntry|null
    {
        return array_find($this->entries, function (DomainEntry $entry) use ($path): bool {
            foreach (self::PACKAGE_FOLDERS as $folder) {
                if (str_starts_with($path, dirname($entry->folder)."/{$folder}/")) {
                    return true;
                }
            }

            return false;
        });
    }
}
