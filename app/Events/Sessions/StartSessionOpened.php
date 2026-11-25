<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Attributes\Listeners\TransactionListenerConsent;
use App\Support\RecordIdentity;

/**
 * A start opened its session; the work its owner named, when it named one, can then attach to the session.
 */
#[TransactionListenerConsent]
final readonly class StartSessionOpened extends SessionEvent
{
    public function __construct(
        public string $startId,
        public string $agentId,
        public string $sessionId,
        public RecordIdentity|null $ownerWork,
    ) {}
}
