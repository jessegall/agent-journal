<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Drivers\MenuEntryEvent;

/**
 * A menu entry was found stale on a driver build.
 */
final readonly class MenuEntryMarkedStale implements MenuEntryEvent, SessionEvent
{
    public function __construct(
        public string $entryId,
        public string $build,
    ) {}
}
