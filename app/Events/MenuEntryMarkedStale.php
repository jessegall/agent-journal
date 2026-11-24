<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Drivers\MenuEntryEvent;

/**
 * A menu entry was found stale on a driver build.
 */
final readonly class MenuEntryMarkedStale extends SessionEvent implements MenuEntryEvent
{
    public function __construct(
        public string $entryId,
        public string $build,
    ) {}
}
