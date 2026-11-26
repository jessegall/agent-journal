<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Support\AssigneeIdentity;

/**
 * Something that can hold assigned work, an actor or a desk alike, named by its assignee identity.
 */
interface Assignee
{
    /**
     * The identity assignments to this assignee are kept under.
     */
    public function assigneeIdentity(): AssigneeIdentity;
}
