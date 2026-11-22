<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\StaleRefusal;
use RuntimeException;

/**
 * A message written for a session the agent no longer runs; it is not delivered, so the sender can send it again
 * to the session that runs now.
 */
final class SessionOutdated extends RuntimeException implements StaleRefusal
{
    public static function forAgent(string $agentId): self
    {
        return new self("Agent {$agentId} now runs another session; send the message again to reach it.");
    }

    public function staleCode(): string
    {
        return 'stale-generation';
    }
}
