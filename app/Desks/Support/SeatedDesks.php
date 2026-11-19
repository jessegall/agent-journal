<?php

declare(strict_types=1);

namespace App\Desks\Support;

use App\Assignments\Contracts\SharedHolders;
use App\Assignments\Support\AssigneeIdentity;
use App\Desks\Models\DeskRecord;

/**
 * An assignee shares the work of every desk it sits at.
 */
final readonly class SeatedDesks implements SharedHolders
{
    public function sharedWith(AssigneeIdentity $member): array
    {
        return [DeskRecord::ASSIGNEE_TYPE => DeskRecord::query()->seatedAssignee($member)->select('id')];
    }
}
