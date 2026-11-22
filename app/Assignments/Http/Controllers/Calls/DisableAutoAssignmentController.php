<?php

declare(strict_types=1);

namespace App\Assignments\Http\Controllers\Calls;

use App\Assignments\Calls\DisableAutoAssignmentCall;
use App\Assignments\Commands\DisableAutoAssignment\DisableAutoAssignmentCommand;
use App\Bus\Contracts\CommandBus;
use App\Http\Data\Assignments\AutoAssignmentChangeData;

/**
 * Disables an auto-assignment and answers its revision.
 */
final readonly class DisableAutoAssignmentController
{
    public function __invoke(DisableAutoAssignmentCall $call, CommandBus $commands): AutoAssignmentChangeData
    {
        $command = new DisableAutoAssignmentCommand($call->key(), $call->expectedRevision);

        return AutoAssignmentChangeData::of($commands->run($command));
    }
}
