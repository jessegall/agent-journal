<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Attributes\Listeners\TransactionListenerConsent;

/**
 * A start's journal session ended, raised inside the transaction that ended it.
 */
#[TransactionListenerConsent]
final readonly class SessionClosed implements SessionEvent
{
    public function __construct(
        public string $agentId,
        public string $sessionId,
    ) {}
}
