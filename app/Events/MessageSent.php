<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Event;
use App\Contracts\ListenerFailureLog;
use App\Contracts\UserInterfaceUpdater;
use App\Support\ActorIdentity;

/**
 * A user sent a message to an agent's session; raised once the send has committed.
 */
final readonly class MessageSent implements Event, ListenerFailureLog, UserInterfaceUpdater
{
    public function __construct(
        public string $messageId,
        public ActorIdentity $author,
        public string $sourceInboxId,
        public string $destinationInboxId,
    ) {}
}
