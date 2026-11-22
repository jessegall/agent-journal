<?php

declare(strict_types=1);

namespace App\Calls\Assignments\Concerns;

use App\Support\AssigneeIdentity;
use App\Support\AssignmentReference;

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
