<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Errands;

use App\Contracts\Assignments\Assignable;
use App\Contracts\Assignments\AssignableProvider;
use App\Exceptions\AssignmentTypeUnavailable;
use App\Support\RecordIdentity;

/**
 * Answers for errands with none to give: every errand is missing.
 */
final class ErrandAssignables implements AssignableProvider
{
    public function requireAssignable(RecordIdentity $record): Assignable
    {
        throw AssignmentTypeUnavailable::forType($record->type);
    }

    public function visibleRecords(array $records): array
    {
        return [];
    }

    public function finishedRecords(array $records): array
    {
        return [];
    }
}
