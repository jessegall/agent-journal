<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Domains\Support\DomainEntry;
use App\Domains\Support\DomainRegistry;

/**
 * The tests a set of changed files can break, read from the domain boundaries: a change inside one domain that touches
 * none of its exports runs that domain's tests; a change to an export also runs every domain that requires it, however
 * far up; a change anywhere else (Core in app, the shared tests, configuration) runs every test.
 */
final readonly class AffectedTests
{
    /**
     * Every test, for a change no single domain holds.
     */
    public const array EVERYTHING = [];

    /**
     * The architecture tests judge every domain's shape, so any domain change runs them too.
     */
    private const string ARCHITECTURE = 'tests/Architecture';

    public function __construct(private DomainRegistry $registry, private string $root) {}

    /**
     * The test folders to run for the changed files, relative to the project root; EVERYTHING when every test must run.
     *
     * @param  list<string>  $changedFiles  paths relative to the project root
     * @return list<string>
     */
    public function for(array $changedFiles): array
    {
        $affected = [];

        foreach ($changedFiles as $file) {
            $owner = $this->ownerOf($file);

            if ($owner === null) {
                return self::EVERYTHING;
            }

            $affected[$owner->name] = $owner;

            if ($this->isExport($owner, $file)) {
                foreach ($this->dependentsOf($owner) as $dependent) {
                    $affected[$dependent->name] = $dependent;
                }
            }
        }

        $folders = array_values(array_filter(
            array_map(fn (DomainEntry $entry) => $this->testFolderOf($entry), $affected),
            fn (string $folder) => is_dir("{$this->root}/{$folder}"),
        ));
        sort($folders);

        return [self::ARCHITECTURE, ...$folders];
    }

    /**
     * The domain whose package holds the file, its code or its tests, or null for a file outside every domain.
     */
    private function ownerOf(string $file): DomainEntry|null
    {
        return array_find($this->registry->all(), fn (DomainEntry $entry) => str_starts_with("{$this->root}/{$file}", $this->packageOf($entry).'/'));
    }

    private function isExport(DomainEntry $owner, string $file): bool
    {
        $code = $owner->folder.'/';
        $path = "{$this->root}/{$file}";

        if (! str_starts_with($path, $code) || ! str_ends_with($path, '.php')) {
            return false;
        }

        return $owner->exportsName($owner->namespace.'\\'.str_replace('/', '\\', substr($path, strlen($code), -4)));
    }

    /**
     * Every domain that requires the owner, directly or through another domain that does.
     *
     * @return list<DomainEntry>
     */
    private function dependentsOf(DomainEntry $owner): array
    {
        $found = [];
        $waiting = [$owner];

        while ($waiting !== []) {
            $current = array_pop($waiting);

            foreach ($this->registry->all() as $entry) {
                if (! isset($found[$entry->name]) && $entry->requiresDomain($current)) {
                    $found[$entry->name] = $entry;
                    $waiting[] = $entry;
                }
            }
        }

        return array_values($found);
    }

    /**
     * The domain's package folder, domain/<Name>, which holds its src and its tests.
     */
    private function packageOf(DomainEntry $entry): string
    {
        return dirname($entry->folder);
    }

    private function testFolderOf(DomainEntry $entry): string
    {
        return substr($this->packageOf($entry), strlen($this->root) + 1).'/tests';
    }
}
