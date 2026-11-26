<?php

declare(strict_types=1);

namespace Domain\Chat\Policies;

use App\Access\Contracts\WorkspacePolicy;
use Domain\Chat\Models\DockPlacement;

/**
 * A member of a chat docks and undocks sources in it, a change to the shared workspace no read-only helper makes;
 * whether it may read each source is checked on every dock.
 */
final readonly class DockPlacementPolicy implements WorkspacePolicy
{
    public static function model(): string
    {
        return DockPlacement::class;
    }
}
