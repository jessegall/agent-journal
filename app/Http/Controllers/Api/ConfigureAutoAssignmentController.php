<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Assignments\ConfigureAutoAssignmentPayload;
use App\Assignments\Commands\ConfigureAutoAssignment\ConfigureAutoAssignmentCommand;
use App\Assignments\Data\AutoAssignmentChangeData;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Records\Contracts\RecordResolver;

/**
 * Configures an auto-assignment and answers its revision.
 */
final readonly class ConfigureAutoAssignmentController
{
    #[Dispatches(ConfigureAutoAssignmentCommand::class)]
    public function __invoke(
        ConfigureAutoAssignmentPayload $call,
        RecordResolver $records,
        CommandBus $commands,
    ): AutoAssignmentChangeData {
        $command = new ConfigureAutoAssignmentCommand($call->input($records), $call->expectedRevision);

        return AutoAssignmentChangeData::of($commands->run($command));
    }
}
