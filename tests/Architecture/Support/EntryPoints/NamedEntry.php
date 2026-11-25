<?php

declare(strict_types=1);

namespace Tests\Architecture\Support\EntryPoints;

/**
 * One entry a test class names in a Tests attribute: the class and its file, and the entry's type and name.
 */
final readonly class NamedEntry
{
    public function __construct(
        public string $file,
        public string $testClass,
        public EntryType $type,
        public string $name,
    ) {}

    public function isFor(EntryPoint $entry): bool
    {
        return $entry->type === $this->type && $entry->name === $this->name;
    }
}
