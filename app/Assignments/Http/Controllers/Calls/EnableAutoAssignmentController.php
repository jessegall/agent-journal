<?php

declare(strict_types=1);

namespace App\Assignments\Http\Controllers\Calls;

use App\Assignments\Calls\EnableAutoAssignmentCall;
use App\Assignments\Commands\EnableAutoAssignment;
use App\Bus\Contracts\CommandBus;
use App\Http\Data\Assignments\AutoAssignmentChangeData;
use App\Records\Contracts\RecordResolver;

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
        $command = new EnableAutoAssignment($call->input($records), $call->expectedRevision);

        return AutoAssignmentChangeData::of($commands->run($command));
    }
}
