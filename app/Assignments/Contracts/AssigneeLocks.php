<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Assignments\Exceptions\AssigneeUnavailable;
use App\Assignments\Support\AssigneeIdentity;

/**
 * Locks the assignees a change involves, always in one order by type and id, before anything else is locked, so two
 * changes that involve the same assignees never wait on each other in turn.
 */
interface AssigneeLocks
{
    /**
     * @param  list<AssigneeIdentity>  $assignees
     *
     * @throws AssigneeUnavailable
     */
    public function lockShared(array $assignees): void;

    /**
     * @param  list<AssigneeIdentity>  $assignees
     *
     * @throws AssigneeUnavailable
     */
    public function lockExclusive(array $assignees): void;
}
