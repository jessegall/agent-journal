<?php

declare(strict_types=1);

namespace App\Assignments\Storage;

use App\Assignments\Contracts\AssignmentQuery;
use App\Assignments\Models\AssignmentRecord;
use App\Assignments\Support\AssigneeIdentity;
use Illuminate\Database\Query\Builder;

/**
 * The assigned record ids as fresh subqueries on the assignments model, each selecting record_id only, for a domain
 * query on the same connection to filter by. Nothing here runs them.
 */
final readonly class DatabaseAssignmentQuery implements AssignmentQuery
{
    public function heldIds(string $type, AssigneeIdentity $holder): Builder
    {
        return AssignmentRecord::query()->heldRecordIds($type, $holder)->toBase();
    }

    public function assignedIds(string $type): Builder
    {
        return AssignmentRecord::query()->assignedRecordIds($type)->toBase();
    }
}
