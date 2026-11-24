<?php

declare(strict_types=1);

namespace App\Contracts\Assignments;

use App\Support\AssigneeIdentity;
use App\Support\AssignmentSet;
use App\Support\IdListPage;
use App\Support\RecordIdentity;
use App\Support\RecordIds;

/**
 * The current assignments the calling actor may see, read in bounded batches.
 */
interface AssignmentResolver
{
    /**
     * One page of the ids of records of one type the holder holds and the caller may see.
     */
    public function recordIdsFor(string $type, AssigneeIdentity $holder, IdListPage $page): RecordIds;

    /**
     * Every id of the records of one type the holder holds and the caller may see, page after page.
     *
     * @return list<string>
     */
    public function allRecordIdsFor(string $type, AssigneeIdentity $holder): array;

    /**
     * The visible assignments of at most 100 records.
     *
     * @param  list<RecordIdentity>  $records
     */
    public function assignmentsFor(array $records): AssignmentSet;
}
