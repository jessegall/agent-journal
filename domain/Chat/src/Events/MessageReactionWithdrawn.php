<?php

declare(strict_types=1);

namespace Domain\Chat\Events;

use App\Support\ActorIdentity;
use Domain\Chat\Contracts\MessageReactionEvent;

/**
 * A chat member took back a reaction to a message.
 */
final readonly class MessageReactionWithdrawn extends ChatEvent implements MessageReactionEvent
{
    public function __construct(public string $inboxId, public string $messageId, public ActorIdentity $owner) {}
}
