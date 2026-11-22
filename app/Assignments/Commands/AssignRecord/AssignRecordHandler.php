<?php

declare(strict_types=1);

namespace App\Assignments\Commands\AssignRecord;

use App\Assignments\Contracts\AssignmentWriter;
use App\Assignments\Support\AssignmentResult;
use App\Contracts\CommandHandler;

/**
 * Runs Core's writer inside the command's repeatable-read transaction and answers what it did.
 */
final readonly class AssignRecordHandler implements CommandHandler
{
    public function __construct(private AssignmentWriter $writer) {}

    public function handle(AssignRecordCommand $command): AssignmentResult
    {
        return $this->writer->assign($command->record, $command->recipient);
    }
}
