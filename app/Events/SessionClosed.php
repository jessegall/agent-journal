<?php

declare(strict_types=1);

namespace App\Events;

use App\Attributes\RequiresListener;
use App\Contracts\Events\Event;

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
