<?php

declare(strict_types=1);

namespace Tests\Fixtures\Contracts;

/**
 * A transaction listener that notes the row renamed first, raising a fact of its own.
 */
final readonly class NotesFirstRename
{
    public function handle(RowRenamed $event): void
    {
        if ($event->name === 'first') {
            RaisingRow::query()->findOrFail($event->rowId)->note();
        }
    }
}
