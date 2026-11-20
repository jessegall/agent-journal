<?php

declare(strict_types=1);

namespace App\Agents\Events;

use App\Contracts\Event;
use App\Records\Support\RecordIdentity;

/**
 * A start began a journal session for an agent, raised inside the start transaction.
 */
final readonly class SessionOpened implements Event
{
    public function __construct(
        public string $agentId,
        public string $sessionId,
        public RecordIdentity|null $authorizedSource = null,
    ) {}
}
