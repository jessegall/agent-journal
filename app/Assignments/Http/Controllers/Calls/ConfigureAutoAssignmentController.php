<?php

declare(strict_types=1);

namespace App\Assignments\Http\Controllers\Calls;

use App\Assignments\Calls\ConfigureAutoAssignmentCall;
use App\Assignments\Commands\ConfigureAutoAssignment\ConfigureAutoAssignmentCommand;
use App\Bus\Contracts\CommandBus;
use App\Http\Data\Assignments\AutoAssignmentChangeData;
use App\Records\Contracts\RecordResolver;

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
