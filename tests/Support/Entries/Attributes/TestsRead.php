<?php

declare(strict_types=1);

namespace Tests\Support\Entries\Attributes;

use Attribute;
use Tests\Support\Entries\Contracts\NamesEntry;

/**
 * The read a test class is the one test of: a loader's reader, or a class that builds what every page reads.
 */
#[Attribute(Attribute::TARGET_CLASS)]
final readonly class TestsRead implements NamesEntry
{
    /**
     * @param  class-string  $read
     */
    public function __construct(public string $read) {}

    public function entryName(): string
    {
        return $this->read;
    }
}
