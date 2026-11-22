<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Events\Event;
use App\Contracts\Events\ListenerFailureLog;
use App\Contracts\Navigation\UserInterfaceUpdater;

/**
 * A message's author asked for an answer to it; it now waits at its destination inbox.
 */
final readonly class MessageAnswerRequired implements Event, ListenerFailureLog, UserInterfaceUpdater
{
    public function __construct(
        public string $messageId,
        public string $destinationInboxId,
    ) {}
}
