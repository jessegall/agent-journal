<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use RuntimeException;
use Throwable;

final class LaunchRefused extends RuntimeException
{
    public static function withoutHooks(string $program): self
    {
        return new self("No domain supplies hooks for {$program}, so it cannot be launched under the journal.");
    }

    public static function forRetiredAgent(int $agentId, Throwable $previous): self
    {
        return new self("Agent {$agentId} does not exist or is retired, so it cannot be launched.", 0, $previous);
    }
}
