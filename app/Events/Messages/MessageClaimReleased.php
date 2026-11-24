<?php

declare(strict_types=1);

namespace App\Events\Messages;

use App\Contracts\Events\ListenerFailureLog;
use App\Contracts\Navigation\UserInterfaceUpdater;
use App\Support\AssignmentReference;

/**
 * A stalled claim on a waiting message was ended by recovery; the message waits for another member to take it up.
 */
final readonly class MessageClaimReleased extends MessageEvent implements ListenerFailureLog, UserInterfaceUpdater
{
    public function __construct(
        public string $messageId,
        public AssignmentReference $claim,
    ) {}
}
