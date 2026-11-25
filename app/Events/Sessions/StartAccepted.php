<?php

declare(strict_types=1);

namespace App\Events\Sessions;

/**
 * A start the journal accepted and committed: what the host's delivery receives, so no driver starts inside the
 * transaction.
 */
final readonly class StartAccepted extends SessionEvent
{
    public function __construct(
        public string $requestId,
        public string $agentId,
        public string $sessionId,
        // The agent that started it as its helper, none for a start of its own.
        public string|null $parentAgentId = null,
    ) {}
}
