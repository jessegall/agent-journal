<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Assignments\EnableAutoAssignmentPayload;
use App\Assignments\Commands\EnableAutoAssignment\EnableAutoAssignmentCommand;
use App\Assignments\Data\AutoAssignmentChangeData;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Records\Contracts\RecordResolver;

/**
 * Enables an auto-assignment and answers its revision.
 */
final readonly class EnableAutoAssignmentController
{
    #[Dispatches(EnableAutoAssignmentCommand::class)]
    public function __invoke(
        EnableAutoAssignmentPayload $call,
        RecordResolver $records,
        CommandBus $commands,
    ): AutoAssignmentChangeData {
        $command = new EnableAutoAssignmentCommand($call->input($records), $call->expectedRevision);

        return AutoAssignmentChangeData::of($commands->run($command));
    }
}
