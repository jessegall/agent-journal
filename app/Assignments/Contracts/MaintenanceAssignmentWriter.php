<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\AssignmentResult;
use App\Records\Support\RecordIdentity;

interface MaintenanceAssignmentWriter
{
    public function assignForMaintenance(RecordIdentity $record, AssigneeIdentity $recipient): AssignmentResult;
}
