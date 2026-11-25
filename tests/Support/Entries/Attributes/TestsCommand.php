<?php

declare(strict_types=1);

namespace Tests\Support\Entries\Attributes;

use App\Support\Command;
use Attribute;

/**
 * The command a test class is the one test of.
 */
#[Attribute(Attribute::TARGET_CLASS)]
final readonly class TestsCommand
{
    /**
     * @param  class-string<Command<mixed>>  $command
     */
    public function __construct(public string $command) {}
}
