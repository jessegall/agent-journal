<?php

declare(strict_types=1);

namespace App\Core\Agents\Events;

/**
 * A launch stayed silent past its time limit, so its session ended without an end hook. Owning domains decide what
 * happens to its work; the time-out itself finishes nothing.
 */
final readonly class LaunchTimedOut
{
    public function __construct(
        public int $agentId,
        public int $sessionId,
    ) {}
}
