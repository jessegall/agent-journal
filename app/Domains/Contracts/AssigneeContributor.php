<?php

declare(strict_types=1);

namespace App\Domains\Contracts;

use App\Assignments\Support\ActivityRegistration;
use App\Assignments\Support\AssigneeRegistration;

/**
 * A domain whose actors or places can hold assigned records, such as Access for users.
 */
interface AssigneeContributor
{
    /**
     * @return list<AssigneeRegistration>
     */
    public function assignees(): array;

    /**
     * @return list<ActivityRegistration>
     */
    public function activities(): array;
}
