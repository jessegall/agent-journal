<?php

declare(strict_types=1);

namespace Tests\Fixtures\Contracts;

/**
 * A required listener that renames the row again on every rename: a loop the drain stops.
 */
final readonly class RenamesAgain
{
    public function handle(RowRenamed $event): void
    {
        RaisingRow::query()->findOrFail($event->rowId)->rename($event->name);
    }
}
