<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Assignments\UnassignRecordPayload;
use App\Commands\Assignments\UnassignRecord\UnassignRecordCommand;
use App\Contracts\Assignments\AssigneeResolver;
use App\Contracts\Bus\CommandBus;
use App\Data\Assignments\AssignmentResultData;

/**
 * Unassigns a record and answers what changed.
 */
final readonly class UnassignRecordController
{
    public function __invoke(
        UnassignRecordPayload $call,
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
