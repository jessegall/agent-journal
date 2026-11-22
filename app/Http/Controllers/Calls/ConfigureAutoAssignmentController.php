<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Assignments\ConfigureAutoAssignmentCall;
use App\Commands\ConfigureAutoAssignment\ConfigureAutoAssignmentCommand;
use App\Contracts\CommandBus;
use App\Contracts\RecordResolver;
use App\Data\Assignments\AutoAssignmentChangeData;

/**
 * Configures an auto-assignment and answers its revision.
 */
final readonly class ConfigureAutoAssignmentController
{
    public function __invoke(
        ConfigureAutoAssignmentCall $call,
        RecordResolver $records,
        CommandBus $commands,
    ): AutoAssignmentChangeData {
        $command = new ConfigureAutoAssignmentCommand($call->input($records), $call->expectedRevision);

        return AutoAssignmentChangeData::of($commands->run($command));
    }
}
