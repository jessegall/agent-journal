<?php

declare(strict_types=1);

namespace Domain\Chat\Events;

use App\Contracts\Events\Event;
use App\Support\ActorIdentity;

/**
 * A chat member reacted to a message with an emoji.
 */
final readonly class MessageReactionAdded implements Event
{
    public function __construct(
        public string $inboxId,
        public string $messageId,
        public ActorIdentity $owner,
    ) {}
}
