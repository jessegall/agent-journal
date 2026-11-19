<?php

declare(strict_types=1);

namespace App\Assignments\Calls\Concerns;

use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\AssignmentReference;

/**
 * A call that changes an assignment only while it is the one its caller read.
 */
trait NamesExpectedAssignment
{
    public function expected(): AssignmentReference
    {
        $holder = new AssigneeIdentity($this->holderType->value, strtolower($this->holderId));

        return new AssignmentReference(strtolower($this->assignmentId), $holder);
    }
}
