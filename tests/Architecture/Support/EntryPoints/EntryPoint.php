<?php

declare(strict_types=1);

namespace Tests\Architecture\Support\EntryPoints;

/**
 * One way into the journal, by its name in the test attribute that names it, and where its test belongs: the test file
 * of a command, state or middleware, or the folder of a route, tool or hook moment's tests.
 */
final readonly class EntryPoint
{
    public function __construct(public EntryType $type, public string $name, public string $testPlace) {}

    /**
     * The folder of this type's tests in core or in the domain the class belongs to.
     */
    public static function folderOf(string $class, EntryType $type): string
    {
        return preg_match('/^Domain\\\\([^\\\\]+)\\\\/', $class, $domain) === 1
            ? "domain/{$domain[1]}/tests/{$type->folder()}"
            : "tests/{$type->folder()}";
    }

    /**
     * Whether a test file sits where this entry's test belongs.
     */
    public function isTestPlace(string $file): bool
    {
        return $this->type->hasTestFile() ? $file === $this->testPlace : str_starts_with($file, "{$this->testPlace}/");
    }
}
