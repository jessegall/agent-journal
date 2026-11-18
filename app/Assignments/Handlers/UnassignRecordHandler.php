<?php

declare(strict_types=1);

namespace App\Assignments\Handlers;

use App\Assignments\Commands\UnassignRecord;
use App\Assignments\Contracts\AssignmentWriter;
use App\Assignments\Support\AssignmentResult;
use App\Contracts\CommandHandler;

/**
 * Runs Core's writer inside the command's repeatable-read transaction and answers what it did.
 */
final readonly class UnassignRecordHandler implements CommandHandler
{
    public function __construct(private AssignmentWriter $writer) {}

    public function handle(UnassignRecord $command): AssignmentResult
    {
        return $this->writer->unassign($command->record, $command->expected);
    }
}
