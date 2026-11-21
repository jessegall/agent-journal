<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Docking\Cards\DockIdentity;
use App\Docking\Sources\Contracts\DockedSources;
use Domain\Chat\Models\DockPlacement;

/**
 * A source is docked while some conversation holds a placement of it.
 */
final readonly class PlacedSources implements DockedSources
{
    public function isDocked(DockIdentity $source): bool
    {
        return DockPlacement::query()->ofSource($source)->exists();
    }
}
