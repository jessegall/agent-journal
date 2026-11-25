<?php

declare(strict_types=1);

namespace App\Events\Inboxes;

use App\Contracts\Events\Event;

/**
 * A fact about who is attached to an inbox: every event of that subject implements it, so a listener typed on it hears
 * them all.
 */
interface InboxEvent extends Event
{
    public string $inboxId { get; }
}
