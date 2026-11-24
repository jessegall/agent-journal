<?php

declare(strict_types=1);

namespace App\Events\Messages;

use App\Support\ActorIdentity;

/**
 * A member of an inbox took back a reaction to a message.
 */
final readonly class MessageReactionWithdrawn extends MessageEvent
{
    public function __construct(public string $inboxId, public string $messageId, public ActorIdentity $owner) {}
}
