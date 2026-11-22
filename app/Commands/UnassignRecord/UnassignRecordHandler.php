<?php

declare(strict_types=1);

namespace App\Commands\UnassignRecord;

use App\Contracts\AssignmentWriter;
use App\Contracts\CommandHandler;
use App\Support\AssignmentResult;

/**
 * Runs Core's writer inside the command's repeatable-read transaction and answers what it did.
 */
final readonly class UnassignRecordHandler implements CommandHandler
{
    public function __construct(private AssignmentWriter $writer) {}

    public function handle(UnassignRecordCommand $command): AssignmentResult
    {
        return $this->writer->unassign($command->record, $command->expected);
    }
}
