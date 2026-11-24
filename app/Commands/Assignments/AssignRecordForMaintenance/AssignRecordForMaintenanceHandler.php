<?php

declare(strict_types=1);

namespace App\Commands\Assignments\AssignRecordForMaintenance;

use App\Contracts\Assignments\MaintenanceAssignmentWriter;
use App\Contracts\Bus\CommandHandler;
use App\Support\AssignmentResult;

final readonly class AssignRecordForMaintenanceHandler implements CommandHandler
{
    public function __construct(private MaintenanceAssignmentWriter $writer) {}

    public function handle(AssignRecordForMaintenanceCommand $command): AssignmentResult
    {
        return $this->writer->assignForMaintenance($command->record, $command->recipient);
    }
}
