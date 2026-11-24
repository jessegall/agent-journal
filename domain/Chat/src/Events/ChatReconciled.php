<?php

declare(strict_types=1);

namespace Domain\Chat\Events;

/**
 * A chat that owed a reconcile was settled: the users no longer admitted to it are gone.
 */
final readonly class ChatReconciled extends ChatEvent
{
    public function __construct(public string $conversationId) {}
}
