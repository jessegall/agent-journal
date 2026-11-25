<?php

declare(strict_types=1);

namespace Tests\Support\Entries\Attributes;

use App\Support\Command;
use Attribute;
use Tests\Support\Entries\Contracts\NamesEntry;

/**
 * The command a test class is the one test of.
 */
#[Attribute(Attribute::TARGET_CLASS)]
final readonly class TestsCommand implements NamesEntry
{
    /**
     * @param  class-string<Command<mixed>>  $command
     */
    public function __construct(public string $command) {}

    public function entryName(): string
    {
        return $this->command;
    }
}
