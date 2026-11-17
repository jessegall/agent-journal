<?php

declare(strict_types=1);

namespace App\Core\Assignments\Contracts;

use App\Core\Actors\Support\ActorIdentity;
use App\Core\Assignments\Support\AssigneeList;
use App\Core\Assignments\Support\AssigneeName;
use App\Core\Assignments\Support\Page;
use App\Core\Contracts\Assignee;

/**
 * What the owner of one kind of actor answers for assignments: whether an actor may receive work, the names actors are
 * shown by, and the actors work may be given to.
 */
interface AssigneeProvider
{
    /**
     * The recipient, under a shared lock on its row, when it exists, may be seen and may receive work now.
     */
    public function requireEligible(ActorIdentity $recipient): Assignee;

    /**
     * @param  list<ActorIdentity>  $actors
     * @return list<AssigneeName>
     */
    public function names(array $actors): array;

    public function eligible(Page $page): AssigneeList;
}
