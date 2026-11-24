<?php

declare(strict_types=1);

namespace App\Events\Messages;

use App\Contracts\Chat\ChatAnswer;
use App\Support\ActorIdentity;

/**
 * A member of an inbox reacted to a message with an emoji.
 */
final readonly class MessageReactionAdded extends MessageEvent implements ChatAnswer
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
