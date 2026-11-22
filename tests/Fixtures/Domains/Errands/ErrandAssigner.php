<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Errands;

use App\Support\ActorIdentity;
use App\Contracts\Assignments\AssignmentPool;
use App\Contracts\Assignments\AutoAssigner;
use App\Support\OrderedRecordIds;
use App\Support\RecordIdentity;

/**
 * Picks no errand and lets every errand pass as a candidate.
 */
final class ErrandAssigner implements AutoAssigner
{
    public function pick(ActorIdentity $assignee, AssignmentPool $pool, int $room): OrderedRecordIds
    {
        return new OrderedRecordIds([]);
    }

    public function requireCandidate(RecordIdentity $record): void {}
}
