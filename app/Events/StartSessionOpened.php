<?php

declare(strict_types=1);

namespace App\Events;

use App\Attributes\TransactionListenerConsent;
use App\Support\RecordIdentity;

/**
 * A start opened its session for the work its owner named, so that work can attach to the session.
 */
#[TransactionListenerConsent]
final readonly class StartSessionOpened extends SessionEvent
{
    public function __construct(
        public string $startId,
        public string $agentId,
        public string $sessionId,
        public RecordIdentity $ownerWork,
    ) {}
}
