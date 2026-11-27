<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Assignments\UnassignRecordPayload;
use App\Assignments\Commands\UnassignRecord\UnassignRecordCommand;
use App\Assignments\Contracts\AssigneeResolver;
use App\Assignments\Data\AssignmentResultData;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;

/**
 * Unassigns a record and answers what changed.
 */
final readonly class UnassignRecordController
{
    #[Dispatches(UnassignRecordCommand::class)]
    public function __invoke(
        UnassignRecordPayload $call,
        CommandBus $commands,
        AssigneeResolver $assignees,
    ): AssignmentResultData {
        $assignmentChange = $commands->run(new UnassignRecordCommand($call->record(), $call->expected()));

        return AssignmentResultData::withHolders($assignmentChange, $assignees);
    }
}
