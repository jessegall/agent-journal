<?php

declare(strict_types=1);

namespace App\Events\Sessions;

/**
 * A start began a journal session for an agent, raised inside the start transaction.
 */
final readonly class SessionOpened extends SessionEvent
{
    public function __construct(
        public string $agentId,
        public string $sessionId,
    ) {}
}
