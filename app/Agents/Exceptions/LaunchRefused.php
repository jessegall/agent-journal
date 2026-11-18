<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use RuntimeException;
use Throwable;

final class LaunchRefused extends RuntimeException
{
    public static function withoutRuntime(string $sessionId): self
    {
        return new self("The launch of session {$sessionId} opened no runtime.");
    }

    public static function withoutHooks(string $program): self
    {
        return new self("No domain supplies hooks for {$program}, so it cannot be launched under the journal.");
    }

    public static function forRetiredAgent(string $agentId, Throwable $previous): self
    {
        return new self("Agent {$agentId} does not exist or is retired, so it cannot be launched.", 0, $previous);
    }
}
