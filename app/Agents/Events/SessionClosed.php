<?php

declare(strict_types=1);

namespace App\Agents\Events;

use App\Contracts\Attributes\RequiresListener;
use App\Contracts\Event;

/**
 * A start's journal session ended, raised inside the transaction that ended it.
 */
#[RequiresListener('Domain\Documents\Listeners\CloseEndedSessionDraft')]
final readonly class SessionClosed implements Event
{
    public function __construct(
        public string $agentId,
        public string $sessionId,
    ) {}
}
