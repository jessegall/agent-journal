<?php

declare(strict_types=1);

namespace App\Processes\Values\Grammar;

/**
 * The commands of a shell pipeline to read, with where its ! stood when it is negated.
 */
final readonly class PipedCommandsReading
{
    public function __construct(public NodeReading $reading, public int|null $negationStart) {}

    public function withFirst(int $command): PipedCommands
    {
        return new PipedCommands($this, [$command]);
    }
}
