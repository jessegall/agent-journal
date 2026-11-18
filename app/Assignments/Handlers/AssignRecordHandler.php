<?php

declare(strict_types=1);

namespace App\Assignments\Handlers;

use App\Assignments\Commands\AssignRecord;
use App\Assignments\Contracts\AssignmentWriter;
use App\Assignments\Support\AssignmentResult;

/**
 * Runs Core's writer inside the command's repeatable-read transaction and answers what it did.
 */
final readonly class AssignRecordHandler
{
    public function __construct(private AssignmentWriter $writer) {}

    public function handle(AssignRecord $command): AssignmentResult
    {
        return $this->writer->assign($command->record, $command->recipient);
    }
}
