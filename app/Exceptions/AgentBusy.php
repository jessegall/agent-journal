<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use RuntimeException;

/**
 * A start of an agent that already runs a session; it is ended or continued first.
 */
final class AgentBusy extends RuntimeException implements CommandRefusal
{
    public static function forAgent(string $agentId): self
    {
        return new self(
            "Agent {$agentId} is already running a session. End it, or continue its work, before starting it again.",
        );
    }
}
