<?php

declare(strict_types=1);

namespace App\Agents\Events;

use App\Contracts\Event;

/**
 * A launch's journal session ended, raised inside the transaction that ended it.
 */
final readonly class LaunchEnded implements Event
{
    public function __construct(
        public string $agentId,
        public string $sessionId,
    ) {}
}
