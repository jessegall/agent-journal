<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Drivers\MenuEntryEvent;

/**
 * A menu entry was used once more.
 */
final readonly class MenuEntryUsed extends SessionEvent implements MenuEntryEvent
{
    public function __construct(
        public string $entryId,
    ) {}
}
