<?php

declare(strict_types=1);

namespace App\Assignments\Http\Controllers\Calls;

use App\Assignments\Calls\UnassignRecordCall;
use App\Assignments\Commands\UnassignRecord\UnassignRecordCommand;
use App\Assignments\Contracts\AssigneeResolver;
use App\Bus\Contracts\CommandBus;
use App\Http\Data\Assignments\AssignmentResultData;

/**
 * Unassigns a record and answers what changed.
 */
final readonly class UnassignRecordController
{
    public function __invoke(
        UnassignRecordCall $call,
        CommandBus $commands,
        AssigneeResolver $assignees,
    ): AssignmentResultData {
        $assignmentChange = $commands->run(new UnassignRecordCommand($call->record(), $call->expected()));

        return AssignmentResultData::of(
            $assignmentChange,
            $assignees->holdersOf($assignmentChange->currentAssignments()),
        );
    }
}
