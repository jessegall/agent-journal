<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Support\AssigneeIdentity;

/**
 * Something that can hold assigned work, an actor or a desk alike, named by its assignee identity.
 */
interface Assignee
{
    public function assigneeIdentity(): AssigneeIdentity;
}
