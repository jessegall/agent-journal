<?php

declare(strict_types=1);

namespace Domain\Chat\Listeners;

use App\Attributes\Listeners\InCommandTransaction;
use App\Contracts\Events\Listener;
use App\Records\Contracts\RecordDeleted;
use Domain\Chat\Models\DockPlacement;
use Domain\Chat\Support\Cards\DockIdentity;

/**
 * A deleted source leaves every chat it was docked in.
 */
#[InCommandTransaction]
final readonly class RemoveDeletedSource implements Listener
{
    public function handle(RecordDeleted $fact): void
    {
        $source = new DockIdentity($fact->recordType(), $fact->recordId());

        foreach (DockPlacement::query()->ofSource($source)->lockForUpdate()->get() as $placement) {
            $placement->remove();
        }
    }
}
