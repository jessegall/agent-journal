<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;
use Throwable;

final class StartRefused extends RuntimeException
{
    public static function projectNotServed(string $label): self
    {
        return new self("No folder of {$label} is connected right now.");
    }

    public static function withoutRuntime(string $sessionId): self
    {
        return new self("The start of session {$sessionId} opened no runtime.");
    }

    public static function withoutHooks(string $driver): self
    {
        return new self("No domain supplies hooks for {$driver}, so it cannot be started under the journal.");
    }

    public static function withoutPredecessor(string $sessionId): self
    {
        return new self("No start of session {$sessionId} of this agent can be continued.");
    }

    public static function withoutAccountSettings(string $driver): self
    {
        return new self("No adapter prepares an account start of {$driver}, so it is not claimed.");
    }

    public static function withoutSignInMethod(string $driver): self
    {
        return new self("No sign-in method is named for this account start of {$driver}, so it is not claimed.");
    }

    public static function skillsUnsupported(string $driver): self
    {
        return new self("The journal cannot deliver skills to {$driver}, so it is not started.");
    }

    public static function forRetiredAgent(string $agentId, Throwable $previous): self
    {
        return new self("Agent {$agentId} does not exist or is retired, so it cannot be started.", 0, $previous);
    }
}
