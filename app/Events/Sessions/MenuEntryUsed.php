<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Agents\Drivers\Contracts\MenuEntryEvent;

/**
 * A menu entry was used once more.
 */
final readonly class MenuEntryUsed implements MenuEntryEvent, SessionEvent
{
    public function __construct(
        public string $entryId,
    ) {}
}
