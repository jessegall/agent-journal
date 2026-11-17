<?php

declare(strict_types=1);

namespace App\Domain\Agents\Events;

/**
 * A launch was confirmed lost: its program exited or was killed without an end hook. Owning domains decide what
 * happens to its work; the loss itself finishes nothing.
 */
final readonly class LaunchLost
{
    public function __construct(
        public int $agentId,
        public int $sessionId,
    ) {}
}
