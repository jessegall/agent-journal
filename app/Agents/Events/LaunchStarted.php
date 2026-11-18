<?php

declare(strict_types=1);

namespace App\Agents\Events;

use App\Contracts\Event;

/**
 * A launch began a journal session for an agent, raised inside the launch transaction.
 */
final readonly class LaunchStarted implements Event
{
    public function __construct(
        public string $agentId,
        public string $sessionId,
        public string $role,
    ) {}
}
