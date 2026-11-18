<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Errands;

use App\Actors\Support\ActorIdentity;
use App\Assignments\Contracts\AssignmentPool;
use App\Assignments\Contracts\AutoAssigner;
use App\Assignments\Support\OrderedRecordIds;
use App\Records\Support\RecordIdentity;

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
