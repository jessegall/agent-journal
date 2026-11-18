<?php

declare(strict_types=1);

namespace App\Agents\Events;

/**
 * A launch's journal session ended, raised inside the transaction that ended it.
 */
final readonly class LaunchEnded
{
    public function __construct(
        public int $agentId,
        public int $sessionId,
    ) {}
}
