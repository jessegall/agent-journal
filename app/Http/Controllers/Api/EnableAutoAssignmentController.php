<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Assignments\EnableAutoAssignmentPayload;
use App\Attributes\Bus\Dispatches;
use App\Commands\Assignments\EnableAutoAssignment\EnableAutoAssignmentCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Records\RecordResolver;
use App\Data\Assignments\AutoAssignmentChangeData;

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
