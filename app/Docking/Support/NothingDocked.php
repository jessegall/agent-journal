<?php

declare(strict_types=1);

namespace App\Docking\Support;

use App\Docking\Cards\DockIdentity;
use App\Docking\Sources\Contracts\DockedSources;

/**
 * Nothing is docked anywhere, for a journal with no domain that docks sources.
 */
final readonly class NothingDocked implements DockedSources
{
    public function isDocked(DockIdentity $source): bool
    {
        return false;
    }

    public function inboxesDocking(DockIdentity $source): array
    {
        return [];
    }
}
