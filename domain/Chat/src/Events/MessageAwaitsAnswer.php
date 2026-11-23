<?php

declare(strict_types=1);

namespace Domain\Chat\Events;

use App\Contracts\Events\Event;

/**
 * Told to the stack of an agent a chat message was sent to: that message now waits for its answer there.
 */
final readonly class MessageAwaitsAnswer implements Event
{
    public function __construct(
        public string $inboxId,
        public string $messageId,
    ) {}
}
