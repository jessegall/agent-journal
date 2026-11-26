<?php

declare(strict_types=1);

namespace App\Support\Storage;

use App\Assignments\Contracts\AssignmentQuery as AssignmentQueryContract;
use App\Models\Records\AssignmentRecord;
use App\Sharing\Contracts\SharedHolders;
use App\Support\AssigneeIdentity;
use Illuminate\Contracts\Database\Query\Builder;

/**
 * The assigned record ids as fresh subqueries on the assignments model, each selecting record_id only, for a domain
 * query on the same connection to filter by. Nothing here runs them.
 */
final readonly class AssignmentQuery implements AssignmentQueryContract
{
    public function __construct(private SharedHolders $shared) {}

    public function heldIds(string $type, AssigneeIdentity $holder): Builder
    {
        return AssignmentRecord::query()
            ->acrossSignIns()
            ->recordIds()
            ->withRecordType($type)
            ->heldOrShared($holder, $this->shared->sharedWith($holder));
    }

    public function assignedIds(string $type): Builder
    {
        return AssignmentRecord::query()->assignedRecordIds($type);
    }
}
