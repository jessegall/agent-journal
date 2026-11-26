<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Assignments\ActivityDefinition;
use App\Assignments\AssigneeDefinition;

/**
 * A domain whose actors or places can hold assigned records, such as Access for users.
 */
interface AssigneeContributor
{
    /**
     * @return list<AssigneeDefinition>
     */
    public function assignees(): array;

    /**
     * @return list<ActivityDefinition>
     */
    public function activities(): array;
}
