<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Support\Reflector;
use Tests\Support\CommitsHookRows;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\ScanCache\ScanCache;

/**
 * The unit test classes of a project that use a database trait, which a unit test may not: it runs without the
 * database, so it stays fast.
 */
final readonly class UnitTestDatabaseTraits
{
    private const array TRAITS = [RefreshHookDatabase::class, CommitsHookRows::class];

    public function __construct(private string $root) {}

    /**
     * @return list<string>
     */
    public function users(): array
    {
        $folders = [
            ...glob("{$this->root}/tests/Unit", GLOB_ONLYDIR) ?: [],
            ...glob("{$this->root}/domain/*/tests/Unit", GLOB_ONLYDIR) ?: [],
        ];
        $found = [];

        foreach (ScanCache::findingsInFolders(new ClassesDeclared(), $folders) as $path => $classes) {
            $file = substr($path, strlen($this->root) + 1);

            foreach ($classes as $class) {
                foreach (array_intersect(self::TRAITS, $this->traitsOf($class)) as $trait) {
                    $found[] = "{$file} uses ".class_basename($trait).': a unit test runs without the database, so '
                        .'move it to its entry test or to tests/Machinery.';
                }
            }
        }

        return $found;
    }

    /**
     * @return list<string>
     */
    private function traitsOf(string $class): array
    {
        return Reflector::exists($class) ? array_values(class_uses_recursive($class)) : [];
    }
}
