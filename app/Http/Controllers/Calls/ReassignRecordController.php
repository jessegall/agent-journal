<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Assignments\ReassignRecordCall;
use App\Commands\ReassignRecord\ReassignRecordCommand;
use App\Contracts\Assignments\AssigneeResolver;
use App\Contracts\Bus\CommandBus;
use App\Data\Assignments\AssignmentResultData;

/**
 * Reassigns a record and answers what changed.
 */
final readonly class ReassignRecordController
{
    public function __invoke(
        ReassignRecordCall $call,
        CommandBus $commands,
        AssigneeResolver $assignees,
    ): AssignmentResultData {
        $command = new ReassignRecordCommand($call->record(), $call->expected(), $call->recipient());
        $assignmentChange = $commands->run($command);

        return AssignmentResultData::of(
            $assignmentChange,
            $assignees->holdersOf($assignmentChange->currentAssignments()),
        );
    }
}
