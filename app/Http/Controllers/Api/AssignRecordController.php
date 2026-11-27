<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Assignments\AssignRecordPayload;
use App\Assignments\Commands\AssignRecord\AssignRecordCommand;
use App\Assignments\Contracts\AssigneeResolver;
use App\Assignments\Data\AssignmentResultData;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;

/**
 * Assigns a record and answers what changed.
 */
final readonly class AssignRecordController
{
    #[Dispatches(AssignRecordCommand::class)]
    public function __invoke(
        AssignRecordPayload $call,
        CommandBus $commands,
        AssigneeResolver $assignees,
    ): AssignmentResultData {
        $assignmentChange = $commands->run(new AssignRecordCommand($call->record(), $call->recipient()));

        return AssignmentResultData::withHolders($assignmentChange, $assignees);
    }
}
