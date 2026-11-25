<?php

declare(strict_types=1);

namespace Domain\Chat\Listeners;

use App\Attributes\Listeners\InCommandTransaction;
use App\Contracts\Events\Listener;
use App\Support\Cards\DockIdentity;
use App\Support\Sources\Contracts\DockSourceDeleted;
use Domain\Chat\Models\DockPlacement;

/**
 * A deleted source leaves every chat it was docked in.
 */
#[InCommandTransaction]
final readonly class RemoveDeletedSource implements Listener
{
    public function handle(DockSourceDeleted $fact): void
    {
        $source = new DockIdentity($fact->dockType(), $fact->dockId());

        foreach (DockPlacement::query()->ofSource($source)->lockForUpdate()->get() as $placement) {
            $placement->remove();
        }
    }
}
