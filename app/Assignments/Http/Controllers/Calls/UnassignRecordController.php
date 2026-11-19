<?php

declare(strict_types=1);

namespace App\Assignments\Http\Controllers\Calls;

use App\Assignments\Calls\UnassignRecordCall;
use App\Assignments\Commands\UnassignRecord;
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
        $result = $commands->run(new UnassignRecord($call->record(), $call->expected()));

        return AssignmentResultData::of($result, $assignees->holdersOf($result->currentAssignments()));
    }
}
