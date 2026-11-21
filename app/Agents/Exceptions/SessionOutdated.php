<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A message written for a session the agent no longer runs; it is not delivered, so the sender can send it again
 * to the session that runs now.
 */
final class SessionOutdated extends RuntimeException implements CommandRefusal
{
    public static function forAgent(string $agentId): self
    {
        return new self("Agent {$agentId} now runs another session; send the message again to reach it.");
    }
}
