<?php

declare(strict_types=1);

namespace Domain\Chat\Events;

use App\Support\ActorIdentity;

/**
 * A conversation moved to the owner given.
 */
final readonly class ConversationTransferred extends ChatEvent
{
    public function __construct(public string $conversationId, public ActorIdentity $owner) {}
}
