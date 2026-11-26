<?php

declare(strict_types=1);

namespace Tests\Architecture\Support\EntryPoints;

use App\Support\Reflector;
use Tests\Architecture\Support\ClassesDeclared;
use Tests\Support\ScanCache\ScanCache;

/**
 * The entries the test classes of core and of every domain name in their Tests attributes, read by reflection; the
 * fixtures, the test machinery, abstract classes and the test case bases name none.
 */
final readonly class EntryAttributes
{
    /**
     * The folders whose classes are machinery or material for tests, never tests of an entry.
     */
    private const string UNJUDGED
        = '#^(tests/(Fixtures|Support|bin|Contracts|Measurements)/|domain/[^/]+/tests/Fixtures/)#';

    private const string TEST_CASE_FILE = 'TestCase.php';

    public function __construct(private string $root) {}

    /**
     * @return list<NamedEntry>
     */
    public function named(): array
    {
        $named = [];

        foreach ($this->testClasses() as $file => $classes) {
            foreach ($classes as $class) {
                $named = [...$named, ...$this->namedBy($file, $class)];
            }
        }

        return $named;
    }

    /**
     * Every judged test file, by its path from the project root.
     *
     * @return list<string>
     */
    public function files(): array
    {
        return array_keys($this->testClasses());
    }

    /**
     * Each declared class under the tests that does not load, by its file: its namespace does not match its folder.
     *
     * @return list<string>
     */
    public function unloadable(): array
    {
        $unloadable = [];

        foreach ($this->testClasses() as $file => $classes) {
            foreach ($classes as $class) {
                if (! Reflector::exists($class)) {
                    $unloadable[] = "{$file} declares {$class}, which does not load: give it its folder's namespace.";
                }
            }
        }

        return $unloadable;
    }

    /**
     * @return list<NamedEntry>
     */
    private function namedBy(string $file, string $class): array
    {
        if (! Reflector::exists($class) || Reflector::of($class)->isAbstract()) {
            return [];
        }

        $type = Reflector::of($class);
        $named = [];

        foreach (EntryType::cases() as $entryType) {
            foreach ($type->attributes($entryType->attribute())->entries() as $attribute) {
                $named[] = new NamedEntry($file, $class, $entryType, $attribute->instance()->entryName());
            }
        }

        return $named;
    }

    /**
     * The classes each judged test file declares, by its path from the project root.
     *
     * @return array<string, list<string>>
     */
    private function testClasses(): array
    {
        $folders = ["{$this->root}/tests", ...glob("{$this->root}/domain/*/tests", GLOB_ONLYDIR) ?: []];
        $judged = [];

        foreach (ScanCache::findingsInFolders(new ClassesDeclared(), $folders) as $path => $classes) {
            $file = substr($path, strlen($this->root) + 1);

            if (preg_match(self::UNJUDGED, $file) !== 1 && basename($file) !== self::TEST_CASE_FILE) {
                $judged[$file] = $classes;
            }
        }

        return $judged;
    }
}
