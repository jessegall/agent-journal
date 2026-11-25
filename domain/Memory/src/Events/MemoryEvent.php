<?php

declare(strict_types=1);

namespace Domain\Memory\Events;

use App\Contracts\Events\Event;

/**
 * A fact about memories: every event of that subject implements it, so a listener typed on it hears them all.
 */
interface MemoryEvent extends Event
{
    public string $memoryId { get; }
}
