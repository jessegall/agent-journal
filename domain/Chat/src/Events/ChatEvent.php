<?php

declare(strict_types=1);

namespace Domain\Chat\Events;

use App\Contracts\Events\Event;

/**
 * A fact about chats: their docks and reactions: every event of that subject implements it, so a listener typed on it receives them all.
 */
interface ChatEvent extends Event
{
    public string $inboxId { get; }
}
