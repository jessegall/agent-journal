<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Actors\Support\ActorIdentity;
use App\Assignments\Support\AssignmentSet;
use App\Assignments\Support\Page;
use App\Assignments\Support\RecordIdentity;
use App\Assignments\Support\RecordIds;

/**
 * The current assignments the calling actor may see, read in bounded batches.
 */
interface AssignmentReader
{
    /**
     * One page of the ids of records of one type the holder holds and the caller may see.
     */
    public function recordIdsFor(string $type, ActorIdentity $holder, Page $page): RecordIds;

    /**
     * Every id of the records of one type the holder holds and the caller may see, page after page.
     *
     * @return list<int>
     */
    public function allRecordIdsFor(string $type, ActorIdentity $holder): array;

    /**
     * The visible assignments of at most 100 records.
     *
     * @param  list<RecordIdentity>  $records
     */
    public function assignmentsFor(array $records): AssignmentSet;
}
