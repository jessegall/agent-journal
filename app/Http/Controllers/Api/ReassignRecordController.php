<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Assignments\ReassignRecordPayload;
use App\Attributes\Bus\Dispatches;
use App\Commands\Assignments\ReassignRecord\ReassignRecordCommand;
use App\Contracts\Assignments\AssigneeResolver;
use App\Contracts\Bus\CommandBus;
use App\Data\Assignments\AssignmentResultData;

/**
 * Reassigns a record and answers what changed.
 */
final readonly class ReassignRecordController
{
    #[Dispatches(ReassignRecordCommand::class)]
    public function __invoke(
        ReassignRecordPayload $call,
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
