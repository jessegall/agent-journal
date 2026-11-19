<?php

declare(strict_types=1);

namespace App\Communication\Events;

use App\Assignments\Support\AssignmentReference;
use App\Contracts\Event;
use App\Contracts\LogsListenerFailures;

/**
 * A stalled claim on a waiting message was ended by recovery; the message waits for another member to take it up.
 */
final readonly class MessageClaimReleased implements Event, LogsListenerFailures
{
    public function __construct(
        public string $messageId,
        public AssignmentReference $claim,
    ) {}
}
