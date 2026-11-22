<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Assignments\EnableAutoAssignmentCall;
use App\Commands\EnableAutoAssignment\EnableAutoAssignmentCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Records\RecordResolver;
use App\Data\Assignments\AutoAssignmentChangeData;

/**
 * Enables an auto-assignment and answers its revision.
 */
final readonly class EnableAutoAssignmentController
{
    public function __invoke(
        EnableAutoAssignmentCall $call,
        RecordResolver $records,
        CommandBus $commands,
    ): AutoAssignmentChangeData {
        $command = new EnableAutoAssignmentCommand($call->input($records), $call->expectedRevision);

        return AutoAssignmentChangeData::of($commands->run($command));
    }
}
