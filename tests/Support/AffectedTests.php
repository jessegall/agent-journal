<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Support\DomainEntry;
use App\Support\DomainRegistry;

/**
 * The tests a set of changed files can break, read from the domain boundaries and Core's areas: a change inside one
 * domain that touches none of its exports runs that domain's tests; a change to an export also runs every domain that
 * requires it, however far up; a change to a Core area in app/<Area> runs that area's own test folders and every test
 * or domain that names one of the changed classes; a changed test file runs itself. A change to an area everything
 * stands on, the shared test support or the configuration runs every test.
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

    /**
     * The Core areas every other area and domain stands on, so a change to one runs every test.
     */
    private const array GLOBAL_AREAS = ['Bus', 'Domains', 'Actors', 'Records', 'Providers', 'Contracts', 'Support'];

    /**
     * The test folders that mirror Core's areas, tests/<Kind>/<Area>.
     */
    private const array TEST_KINDS = ['Feature', 'Unit'];

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
        $paths = [];

        foreach ($changedFiles as $file) {
            $owner = $this->ownerOf($file);

            if ($owner !== null) {
                $affected[$owner->name] = $owner;

                if ($this->isExport($owner, $file)) {
                    foreach ($this->dependentsOf($owner) as $dependent) {
                        $affected[$dependent->name] = $dependent;
                    }
                }

                continue;
            }

            $corePaths = $this->corePathsFor($file);

            if ($corePaths === null) {
                return self::EVERYTHING;
            }

            foreach ($corePaths['paths'] as $path) {
                $paths[$path] = $path;
            }

            foreach ($corePaths['domains'] as $domain) {
                $affected[$domain->name] = $domain;
            }
        }

        $folders = array_map(fn (DomainEntry $entry) => $this->testFolderOf($entry), $affected);
        $selected = array_values(array_unique(array_filter(
            [...$folders, ...array_values($paths)],
            fn (string $path) => file_exists("{$this->root}/{$path}"),
        )));
        sort($selected);

        return [self::ARCHITECTURE, ...array_values(array_diff($selected, [self::ARCHITECTURE]))];
    }

    /**
     * What a change outside every domain runs: a changed test file itself, or a Core area's test folders with every
     * test and domain that names one of the changed class; null when the change reaches everything.
     *
     * @return array{paths: list<string>, domains: list<DomainEntry>}|null
     */
    private function corePathsFor(string $file): array|null
    {
        $isTestFile = preg_match('#^tests/(Feature|Unit|Architecture)/.+Test\.php$#', $file) === 1;

        if ($isTestFile) {
            return ['paths' => [$file], 'domains' => []];
        }

        if (preg_match('#^app/([A-Z][A-Za-z]+)/.+$#', $file, $area) !== 1
            || in_array($area[1], self::GLOBAL_AREAS, true)) {
            return null;
        }

        $paths = array_map(fn (string $kind) => "tests/{$kind}/{$area[1]}", self::TEST_KINDS);

        if (! str_ends_with($file, '.php')) {
            return ['paths' => $paths, 'domains' => []];
        }

        $class = 'App\\'.str_replace('/', '\\', substr($file, 4, -4));
        [$tests, $domains] = $this->namersOf($class);

        return ['paths' => [...$paths, ...$tests], 'domains' => $domains];
    }

    /**
     * The test files and the domains whose code name the class.
     *
     * @return array{list<string>, list<DomainEntry>}
     */
    private function namersOf(string $class): array
    {
        $tests = [];
        $domains = [];
        $domainFolders = array_map(fn (DomainEntry $entry) => $entry->folder, $this->registry->all());
        $folders = implode(' ', array_map(escapeshellarg(...), [$this->root.'/tests', ...$domainFolders]));
        exec('grep -rlF '.escapeshellarg($class).' '.$folders, $found);

        foreach ($found as $path) {
            $relative = substr($path, strlen($this->root) + 1);
            $owner = $this->ownerOf($relative);

            if ($owner !== null) {
                $domains[$owner->name] = $owner;
            } elseif (str_ends_with($relative, 'Test.php')) {
                $tests[] = $relative;
            }
        }

        return [$tests, array_values($domains)];
    }

    /**
     * The domain whose package holds the file, its code or its tests, or null for a file outside every domain.
     */
    private function ownerOf(string $file): DomainEntry|null
    {
        return array_find(
            $this->registry->all(),
            fn (DomainEntry $entry) => str_starts_with("{$this->root}/{$file}", $this->packageOf($entry).'/'),
        );
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
                if (isset($found[$entry->name]) || ! $entry->requiresDomain($current)) {
                    continue;
                }

                $found[$entry->name] = $entry;
                $waiting[] = $entry;
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
