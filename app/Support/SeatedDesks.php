<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\SharedHolders;
use App\Models\DeskRecord;

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
