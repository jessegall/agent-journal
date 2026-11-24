<?php

declare(strict_types=1);

namespace App\Contracts\Assignments;

use App\Support\AssigneeIdentity;
use App\Support\AssigneeList;
use App\Support\AssigneeName;
use App\Support\IdListPage;

/**
 * What the owner of one type of actor answers for assignments: whether an actor may receive work, the names actors are
 * shown by, and the actors work may be given to.
 */
interface AssigneeProvider
{
    /**
     * The recipient, under a shared lock on its row, when it exists, may be seen and may receive work now.
     */
    public function requireEligible(AssigneeIdentity $recipient): Assignee;

    /**
     * The recipient under an exclusive lock on its row, for a change that must not race another change of it.
     */
    public function requireExclusive(AssigneeIdentity $recipient): Assignee;

    /**
     * @param  list<AssigneeIdentity>  $assignees
     * @return list<AssigneeName>
     */
    public function names(array $assignees): array;

    public function eligible(IdListPage $page): AssigneeList;
}
