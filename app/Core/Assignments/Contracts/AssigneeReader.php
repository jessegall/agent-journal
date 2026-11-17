<?php

declare(strict_types=1);

namespace App\Core\Assignments\Contracts;

use App\Core\Actors\Enums\ActorType;
use App\Core\Actors\Support\ActorIdentity;
use App\Core\Assignments\Support\AssigneeList;
use App\Core\Assignments\Support\AssigneeName;
use App\Core\Assignments\Support\AssignmentHolders;
use App\Core\Assignments\Support\AssignmentSet;
use App\Core\Assignments\Support\Page;

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
}
