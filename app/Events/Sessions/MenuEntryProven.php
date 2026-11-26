<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Agents\Drivers\Contracts\MenuEntryEvent;

/**
 * A menu entry was proven on a driver build.
 */
final readonly class MenuEntryProven implements MenuEntryEvent, SessionEvent
{
    public function __construct(
        public string $entryId,
        public string $build,
    ) {}
}
