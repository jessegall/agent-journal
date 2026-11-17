<?php

declare(strict_types=1);

namespace App\Core\Assignments\Contracts;

use App\Core\Actors\Support\ActorIdentity;
use App\Core\Assignments\Support\AssignmentSet;
use App\Core\Assignments\Support\Page;
use App\Core\Assignments\Support\RecordIdentity;
use App\Core\Assignments\Support\RecordIds;

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
     * The visible assignments of at most 100 records.
     *
     * @param  list<RecordIdentity>  $records
     */
    public function assignmentsFor(array $records): AssignmentSet;
}
