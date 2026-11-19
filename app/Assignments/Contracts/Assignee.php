<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Assignments\Support\AssigneeIdentity;

/**
 * Something that can hold assigned work, an actor or a desk alike, named by its assignee identity.
 */
interface Assignee
{
    public function assigneeIdentity(): AssigneeIdentity;
}
