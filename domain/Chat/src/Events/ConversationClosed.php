<?php

declare(strict_types=1);

namespace Domain\Chat\Events;

/**
 * A conversation was closed, so it takes no more messages.
 */
final readonly class ConversationClosed extends ChatEvent
{
    public function __construct(public string $conversationId) {}
}
