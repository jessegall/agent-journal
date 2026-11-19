<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use RuntimeException;
use Throwable;

final class StartRefused extends RuntimeException
{
    public static function withoutRuntime(string $sessionId): self
    {
        return new self("The start of session {$sessionId} opened no runtime.");
    }

    public static function withoutHooks(string $program): self
    {
        return new self("No domain supplies hooks for {$program}, so it cannot be started under the journal.");
    }

    public static function withoutPredecessor(string $sessionId): self
    {
        return new self("No start of session {$sessionId} of this agent can be continued.");
    }

    public static function withoutAccountSettings(string $program): self
    {
        return new self("No adapter prepares an account start of {$program}, so it is not claimed.");
    }

    public static function skillsUnsupported(string $program): self
    {
        return new self("The journal cannot deliver skills to {$program}, so it is not started.");
    }

    public static function skillsNotReady(string $sessionId, string $reason): self
    {
        return new self("The skills of session {$sessionId} are not delivered yet, so it is not spawned: {$reason}");
    }

    public static function forRetiredAgent(string $agentId, Throwable $previous): self
    {
        return new self("Agent {$agentId} does not exist or is retired, so it cannot be started.", 0, $previous);
    }
}
