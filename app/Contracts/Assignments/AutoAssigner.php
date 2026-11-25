<?php

declare(strict_types=1);

namespace App\Contracts\Assignments;

use App\Support\ActorReference;
use App\Support\OrderedRecordIds;
use App\Support\RecordIdentity;

/**
 * Picks the records of one assignable type an actor may be given next from a pool, and confirms one still qualifies
 * inside the claim transaction. Its domain supplies it.
 */
interface AutoAssigner
{
    /**
     * At most room record ids from the pool, unheld and still open, in the pool's order.
     */
    public function pick(
        ActorReference $assignee,
        AssignmentPool $pool,
        int $room,
    ): OrderedRecordIds;

    /**
     * Locks the record and fails, with a named exception, when it no longer qualifies to be given out.
     */
    public function requireCandidate(RecordIdentity $record): void;
}
