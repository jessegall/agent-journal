<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Assignments\Support\AssigneeList;
use App\Assignments\Support\AssigneeName;
use App\Assignments\Support\AssignmentHolders;
use App\Assignments\Support\AssignmentSet;
use App\Assignments\Support\Page;
use App\Records\Support\RecordIdentity;

/**
 * The names actors are shown by and the actors of one type work may be given to, read through each type's owner.
 */
interface AssigneeReader
{
    /**
     * @param  list<ActorIdentity>  $actors
     * @return list<AssigneeName>
     */
    public function names(array $actors): array;

    public function eligible(ActorType $type, Page $page): AssigneeList;

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
