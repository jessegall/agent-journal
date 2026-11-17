<?php

declare(strict_types=1);

namespace App\Core\Agents\Events;

/**
 * A launch began a journal session for an agent, raised inside the launch transaction.
 */
final readonly class LaunchStarted
{
    public function __construct(
        public int $agentId,
        public int $sessionId,
        public string $role,
    ) {}
}
