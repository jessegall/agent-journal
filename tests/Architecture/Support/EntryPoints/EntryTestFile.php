<?php

declare(strict_types=1);

namespace Tests\Architecture\Support\EntryPoints;

/**
 * The entry test the generator writes for one route method or MCP tool: the entry it names, the file under the project
 * and the class text.
 */
final readonly class EntryTestFile
{
    public function __construct(public EntryType $type, public string $entry, public string $path, public string $text) {}

    public function isFor(NamedEntry $named): bool
    {
        return $named->type === $this->type && $named->name === $this->entry;
    }
}
