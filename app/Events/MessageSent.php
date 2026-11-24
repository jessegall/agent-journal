<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Events\ListenerFailureLog;
use App\Contracts\Navigation\UserInterfaceUpdater;
use App\Support\ActorIdentity;

/**
 * A user sent a message to an agent's session; raised once the send has committed.
 */
final readonly class MessageSent extends MessageEvent implements ListenerFailureLog, UserInterfaceUpdater
{
    public function __construct(
        public string $messageId,
        public ActorIdentity $author,
        public string $sourceInboxId,
        public string $destinationInboxId,
    ) {}
}
