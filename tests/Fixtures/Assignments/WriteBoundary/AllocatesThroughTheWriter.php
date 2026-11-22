<?php

declare(strict_types=1);

namespace Tests\Fixtures\Assignments\WriteBoundary;

use App\Models\AssignmentRecord;

/**
 * A read of an assignment's holder outside the writers, which the check allows.
 */
final readonly class AllocatesThroughTheWriter
{
    public function holderOf(string $assignmentId): string
    {
        return (string) AssignmentRecord::query()->whereKey($assignmentId)->value('holder_id');
    }
}
