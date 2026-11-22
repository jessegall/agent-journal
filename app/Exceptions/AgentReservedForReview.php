<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A start of an agent whose certified work is held for review; no other job takes it until the review releases it.
 */
final class AgentReservedForReview extends RuntimeException implements CommandRefusal
{
    public static function forAgent(string $agentId): self
    {
        return new self("Agent {$agentId} holds certified work that waits for its review, so it takes no other job.");
    }
}
