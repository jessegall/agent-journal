<?php

declare(strict_types=1);

namespace Domain\Chat\Policies;

use App\Contracts\Authorization\Policy;
use Domain\Chat\Models\DockPlacement;

/**
 * A member of a chat docks and undocks sources in it; whether it may read each source is checked on every dock.
 */
final readonly class DockPlacementPolicy implements Policy
{
    public static function model(): string
    {
        return DockPlacement::class;
    }
}
