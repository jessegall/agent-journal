<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Drivers\MenuEntryEvent;

/**
 * A menu entry was retired and is no longer used.
 */
final readonly class MenuEntryRetired extends SessionEvent implements MenuEntryEvent
{
    public function __construct(
        public string $entryId,
    ) {}
}
