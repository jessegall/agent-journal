<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Support\AssigneeIdentity;
use App\Support\AssignmentResult;
use App\Support\RecordIdentity;

interface MaintenanceAssignmentWriter
{
    public function assignForMaintenance(RecordIdentity $record, AssigneeIdentity $recipient): AssignmentResult;
}
