<?php

declare(strict_types=1);

namespace App\Domain\Contracts;

use App\Core\Assignments\Support\AssigneeRegistration;

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
