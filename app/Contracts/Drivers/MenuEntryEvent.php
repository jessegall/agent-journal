<?php

declare(strict_types=1);

namespace App\Contracts\Drivers;

use App\Contracts\Events\Event;

/**
 * A change to a menu entry: every event of it implements this, so a listener typed on it hears them all.
 */
interface MenuEntryEvent extends Event
{
    public string $entryId { get; }
}
