<?php

declare(strict_types=1);

namespace App\Commands\ReassignRecord;

use App\Contracts\Assignments\AssignmentWriter;
use App\Contracts\Bus\CommandHandler;
use App\Support\AssignmentResult;

/**
 * Runs Core's writer inside the command's repeatable-read transaction and answers what it did.
 */
final readonly class ReassignRecordHandler implements CommandHandler
{
    public function __construct(private AssignmentWriter $writer) {}

    public function handle(ReassignRecordCommand $command): AssignmentResult
    {
        return $this->writer->reassign($command->record, $command->expected, $command->recipient);
    }
}
