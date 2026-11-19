<?php

declare(strict_types=1);

namespace App\Assignments\Http\Controllers\Calls;

use App\Assignments\Calls\ReassignRecordCall;
use App\Assignments\Commands\ReassignRecord;
use App\Assignments\Contracts\AssigneeResolver;
use App\Bus\Contracts\CommandBus;
use App\Http\Data\Assignments\AssignmentResultData;

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
        $command = new ReassignRecord($call->record(), $call->expected(), $call->recipient());
        $result = $commands->run($command);

        return AssignmentResultData::of($result, $assignees->holdersOf($result->currentAssignments()));
    }
}
