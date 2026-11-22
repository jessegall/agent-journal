<?php

declare(strict_types=1);

namespace App\Assignments\Http\Controllers\Calls;

use App\Assignments\Calls\AssignRecordCall;
use App\Assignments\Commands\AssignRecord\AssignRecordCommand;
use App\Assignments\Contracts\AssigneeResolver;
use App\Bus\Contracts\CommandBus;
use App\Http\Data\Assignments\AssignmentResultData;

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
