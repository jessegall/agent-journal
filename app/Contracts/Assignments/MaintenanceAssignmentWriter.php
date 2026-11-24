<?php

declare(strict_types=1);

namespace App\Contracts\Assignments;

use App\Support\AssigneeIdentity;
use App\Support\AssignmentResult;
use App\Support\RecordIdentity;

interface MaintenanceAssignmentWriter
{
    /**
     * Assigns the record to the recipient as maintenance, outside the journal's own rules for who may assign.
     */
    public function assignForMaintenance(RecordIdentity $record, AssigneeIdentity $recipient): AssignmentResult;
}
