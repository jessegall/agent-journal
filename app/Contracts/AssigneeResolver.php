<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Support\AssigneeIdentity;
use App\Support\AssigneeList;
use App\Support\AssigneeName;
use App\Support\AssignmentHolders;
use App\Support\AssignmentSet;
use App\Support\Page;
use App\Support\RecordIdentity;

/**
 * The names actors are shown by and the actors of one type work may be given to, read through each type's owner.
 */
interface AssigneeResolver
{
    /**
     * @param  list<AssigneeIdentity>  $actors
     * @return list<AssigneeName>
     */
    public function names(array $actors): array;

    public function eligible(string $type, Page $page): AssigneeList;

    /**
     * The holders of a set of assignments with their names, read with one call per actor type.
     */
    public function holdersOf(AssignmentSet $assignments): AssignmentHolders;

    /**
     * The holders of the visible assignments of at most 100 records, with their names.
     *
     * @param  list<RecordIdentity>  $records
     */
    public function holdersOfRecords(array $records): AssignmentHolders;
}
