<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Support\ActivityDefinition;
use App\Support\AssigneeDefinition;

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
