<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Assignments\DisableAutoAssignmentCall;
use App\Commands\DisableAutoAssignment\DisableAutoAssignmentCommand;
use App\Contracts\Bus\CommandBus;
use App\Data\Assignments\AutoAssignmentChangeData;

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
