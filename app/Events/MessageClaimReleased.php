<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Event;
use App\Contracts\ListenerFailureLog;
use App\Contracts\UserInterfaceUpdater;
use App\Support\AssignmentReference;

/**
 * A stalled claim on a waiting message was ended by recovery; the message waits for another member to take it up.
 */
final readonly class MessageClaimReleased implements Event, ListenerFailureLog, UserInterfaceUpdater
{
    public function __construct(
        public string $messageId,
        public AssignmentReference $claim,
    ) {}
}
