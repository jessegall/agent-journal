<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Drivers\MenuEntryEvent;

/**
 * A menu entry was retired and is no longer used.
 */
final readonly class MenuEntryRetired implements MenuEntryEvent, SessionEvent
{
    public function __construct(
        public string $entryId,
    ) {}
}
