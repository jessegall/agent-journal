<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Assignments\AssignRecordCall;
use App\Commands\AssignRecord\AssignRecordCommand;
use App\Contracts\AssigneeResolver;
use App\Contracts\CommandBus;
use App\Data\Assignments\AssignmentResultData;

/**
 * Assigns a record and answers what changed.
 */
final readonly class AssignRecordController
{
    public function __invoke(
        AssignRecordCall $call,
        CommandBus $commands,
        AssigneeResolver $assignees,
    ): AssignmentResultData {
        $assignmentChange = $commands->run(new AssignRecordCommand($call->record(), $call->recipient()));

        return AssignmentResultData::of(
            $assignmentChange,
            $assignees->holdersOf($assignmentChange->currentAssignments()),
        );
    }
}
