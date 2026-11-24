<?php

declare(strict_types=1);

namespace Domain\Chat\Events;

use App\Contracts\Chat\ChatAnswer;
use App\Support\ActorIdentity;

/**
 * A chat member reacted to a message with an emoji.
 */
final readonly class MessageReactionAdded extends ChatEvent implements ChatAnswer
{
    public function __construct(
        public string $inboxId,
        public string $messageId,
        public ActorIdentity $owner,
    ) {}

    public function answerer(): ActorIdentity
    {
        return $this->owner;
    }
}
