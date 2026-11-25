<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Bus\CommandEnd as CommandEndContract;
use Closure;

/**
 * Hands a command that passed every middleware to its handler, with the subjects it was authorized on.
 */
final readonly class CommandEnd implements CommandEndContract
{
    public function __construct(private CommandSubjects $subjects) {}

    public function finish(CommandCall $call, Closure $handler): mixed
    {
        return $this->subjects->handOver($call, $handler);
    }
}
