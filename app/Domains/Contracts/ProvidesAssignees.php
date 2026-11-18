<?php

declare(strict_types=1);

namespace App\Domains\Contracts;

use App\Assignments\Support\AssigneeRegistration;

/**
 * A domain whose actors can hold assigned records, such as Access for users.
 */
interface ProvidesAssignees
{
    /**
     * @return list<AssigneeRegistration>
     */
    public function assignees(): array;
}
