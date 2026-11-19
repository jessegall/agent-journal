<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Assignments\Support\AdmittedAssignment;
use App\Assignments\Support\AssigneeIdentity;
use App\Records\Support\RecordIdentity;

/**
 * Admits a public assignment before anything is written: the record type is public work, the caller may give work to
 * the requested recipient, the recipient's lock is held, the recipient resolves once to its final holder, and the
 * record may be assigned.
 */
interface AssignmentAdmission
{
    public function admitPublic(RecordIdentity $record, AssigneeIdentity $requested): AdmittedAssignment;
}
