<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Assignments\AssignRecordPayload;
use App\Commands\Assignments\AssignRecord\AssignRecordCommand;
use App\Contracts\Assignments\AssigneeResolver;
use App\Contracts\Bus\CommandBus;
use App\Data\Assignments\AssignmentResultData;

/**
 * Assigns a record and answers what changed.
 */
final readonly class AssignRecordController
{
    public function __invoke(
        AssignRecordPayload $call,
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
