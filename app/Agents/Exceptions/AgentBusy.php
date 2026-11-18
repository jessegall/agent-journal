<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A launch of an agent that already runs a session; it is ended or continued first.
 */
final class AgentBusy extends RuntimeException implements CommandRefusal
{
    public static function forAgent(string $agentId): self
    {
        return new self("Agent {$agentId} is already running a session. End it, or continue its work, before launching it again.");
    }
}
