<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Event;
use App\Support\RecordIdentity;

/**
 * A start the journal accepted and committed: what the host's delivery receives, so no driver starts inside the
 * transaction.
 */
final readonly class StartAccepted implements Event
{
    public function __construct(
        public string $requestId,
        public string $agentId,
        public string $sessionId,
        public RecordIdentity|null $authorizedSource = null,
        // The agent that started it as its helper, none for a start of its own.
        public string|null $parentAgentId = null,
    ) {}
}
