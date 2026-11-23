<?php

declare(strict_types=1);

namespace Tests\Fixtures\Assignments\WriteBoundary;

use App\Models\Records\AssignmentRecord;

/**
 * A listener that moves an assignment's holder by writing the column, which the assignment write check refuses.
 */
final readonly class MovesTheHolder
{
    public function handle(string $assignmentId, string $holderId): void
    {
        $record = AssignmentRecord::query()->whereKey($assignmentId)->firstOrFail();
        $record->holder_id = $holderId;
        $record->save();
    }
}
