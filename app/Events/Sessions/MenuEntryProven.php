<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Drivers\MenuEntryEvent;

/**
 * A menu entry was proven on a driver build.
 */
final readonly class MenuEntryProven extends SessionEvent implements MenuEntryEvent
{
    public function __construct(
        public string $entryId,
        public string $build,
    ) {}
}
