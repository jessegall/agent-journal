<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Drivers\MenuEntryEvent;

/**
 * A menu entry was replaced by a newer entry.
 */
final readonly class MenuEntrySuperseded implements MenuEntryEvent, SessionEvent
{
    public function __construct(
        public string $entryId,
        public string $supersededById,
    ) {}
}
