<?php

declare(strict_types=1);

namespace App\Communication\Events;

use App\Actors\Support\ActorIdentity;
use App\Contracts\Event;
use App\Contracts\ListenerFailureLog;
use App\Ui\Contracts\UserInterfaceUpdater;

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
