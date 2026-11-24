<?php

declare(strict_types=1);

namespace Domain\Chat\Events;

/**
 * A chat was marked as owing a reconcile: a change to its members could not finish in the transaction that made it.
 */
final readonly class ChatReconcileMarked extends ChatEvent
{
    public function __construct(public string $conversationId) {}
}
