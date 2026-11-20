<?php

declare(strict_types=1);

namespace App\Assignments\Handlers;

use App\Assignments\Commands\AssignRecordForMaintenance;
use App\Assignments\Contracts\MaintenanceAssignmentWriter;
use App\Assignments\Support\AssignmentResult;
use App\Contracts\CommandHandler;

final readonly class AssignRecordForMaintenanceHandler implements CommandHandler
{
    public function __construct(private MaintenanceAssignmentWriter $writer) {}

    public function handle(AssignRecordForMaintenance $command): AssignmentResult
    {
        return $this->writer->assignForMaintenance($command->record, $command->recipient);
    }
}
