<?php

declare(strict_types=1);

namespace Tests\Fixtures\Contracts;

use App\Bus\Support\EventUnitLifecycle;

/**
 * A required listener that stages a public occurrence it has no row to raise on.
 */
final readonly class StagesProgress
{
    public function __construct(private EventUnitLifecycle $lifecycle) {}

    public function handle(RowRenamed $event): void
    {
        $this->lifecycle->publishAfterCommit(new LegacyRenameNoticed("progress of {$event->name}"));
    }
}
