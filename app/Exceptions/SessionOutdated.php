<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Refusals\StaleRefusal;
use App\Notifications\Contracts\Refusals\FieldRefusal;
use RuntimeException;

/**
 * A message written for a session the agent no longer runs; it is not delivered, so the sender can send it again
 * to the session that runs now.
 */
final class SessionOutdated extends RuntimeException implements FieldRefusal, StaleRefusal
{
    public static function forAgent(string $agentId): self
    {
        return new self("Agent {$agentId} now runs another session; send the message again to reach it.");
    }

    public function staleCode(): string
    {
        return 'stale-generation';
    }

    public function field(): string
    {
        return 'session';
    }

    public function fieldError(): string
    {
        return 'The agent now runs another session. Send the message again to reach it.';
    }
}
